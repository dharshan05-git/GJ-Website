import { Settings } from '../models/Settings.js';

/**
 * When maintenance mode is on, the storefront API answers 503 so the React app
 * can swap itself for the "Website Under Construction" page. Staff keep working
 * normally, and a few routes stay open so the page can render and staff sign in.
 */
const ALWAYS_OPEN = [
  '/api',
  '/api/settings',
  '/api/settings/public',
  '/api/auth/login',
  '/api/auth/me',
];

const OPEN_PREFIXES = ['/api/admin', '/api/payments/razorpay/webhook'];

let cached = { value: null, at: 0 };
const CACHE_MS = 10_000;

const readSettings = async () => {
  if (cached.value && Date.now() - cached.at < CACHE_MS) return cached.value;
  const settings = await Settings.get();
  cached = { value: settings, at: Date.now() };
  return settings;
};

/** Call after changing settings so the next request sees the new value at once. */
export const invalidateMaintenanceCache = () => {
  cached = { value: null, at: 0 };
};

export const maintenanceGate = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') return next();

    // Mounted under /api, so req.path is relative — rebuild the full path.
    const path = `${req.baseUrl || ''}${req.path}`.replace(/\/$/, '') || '/api';

    if (ALWAYS_OPEN.includes(path)) return next();
    if (OPEN_PREFIXES.some((prefix) => path.startsWith(prefix))) return next();

    const settings = await readSettings();
    if (!settings.maintenance.enabled) return next();

    // Staff (identified by optionalAuth upstream) browse the live site as usual.
    if (req.user?.isStaff?.()) return next();

    const ip = req.ip || req.socket?.remoteAddress || '';
    if (settings.maintenance.allowedIps?.some((allowed) => ip.includes(allowed))) return next();

    return res.status(503).json({
      success: false,
      maintenance: true,
      message: settings.maintenance.title,
      data: {
        title: settings.maintenance.title,
        body: settings.maintenance.message,
        announcement: settings.announcement,
        expectedBackAt: settings.maintenance.expectedBackAt || null,
      },
    });
  } catch (error) {
    // Never let a settings hiccup take the API down.
    return next();
  }
};
