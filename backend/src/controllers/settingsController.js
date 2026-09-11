import { Settings } from '../models/Settings.js';
import { invalidateMaintenanceCache } from '../middleware/maintenance.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GET /api/settings/public
 * Called by the React app on boot. Drives the maintenance page, the
 * announcement bar and the free-shipping copy — all editable from the panel.
 */
export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await Settings.get();
  const announcement = settings.announcement;

  const now = new Date();
  const scheduled =
    (!announcement.startsAt || announcement.startsAt <= now) &&
    (!announcement.endsAt || announcement.endsAt >= now);

  res.json({
    success: true,
    data: {
      maintenance: {
        enabled: settings.maintenance.enabled,
        title: settings.maintenance.title,
        message: settings.maintenance.message,
        expectedBackAt: settings.maintenance.expectedBackAt || null,
      },
      announcement: {
        ...announcement.toObject(),
        enabled: announcement.enabled && scheduled,
      },
      store: settings.store,
      commerce: {
        freeShippingThreshold: settings.commerce.freeShippingThreshold,
        shippingFee: settings.commerce.shippingFee,
        codEnabled: settings.commerce.codEnabled,
        onlinePaymentEnabled: settings.commerce.onlinePaymentEnabled,
      },
    },
  });
});

// GET /api/settings  (admin) — the whole document
export const getSettings = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { settings: await Settings.get() } });
});

/**
 * PUT /api/settings  (admin)
 * Accepts a partial document; only the sections present in the body change.
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.get();
  const sections = ['maintenance', 'announcement', 'store', 'commerce', 'email'];

  for (const section of sections) {
    if (req.body[section]) Object.assign(settings[section], req.body[section]);
  }

  settings.updatedBy = req.user._id;
  await settings.save();
  invalidateMaintenanceCache();

  res.json({ success: true, message: 'Settings saved', data: { settings } });
});

/**
 * POST /api/settings/maintenance  (admin)
 * The one-switch version used by the panel's Maintenance Mode toggle.
 * Body: { enabled, title?, message?, expectedBackAt? }
 */
export const toggleMaintenance = asyncHandler(async (req, res) => {
  const settings = await Settings.get();
  const enabled = Boolean(req.body.enabled);

  settings.maintenance.enabled = enabled;
  settings.maintenance.startedAt = enabled ? new Date() : undefined;
  if (req.body.title) settings.maintenance.title = req.body.title;
  if (req.body.message) settings.maintenance.message = req.body.message;
  if (req.body.expectedBackAt !== undefined) {
    settings.maintenance.expectedBackAt = req.body.expectedBackAt || undefined;
  }
  if (Array.isArray(req.body.allowedIps)) settings.maintenance.allowedIps = req.body.allowedIps;

  settings.updatedBy = req.user._id;
  await settings.save();
  invalidateMaintenanceCache();

  res.json({
    success: true,
    message: enabled ? 'Maintenance mode is ON — the site now shows the construction page' : 'Maintenance mode is OFF — the site is live',
    data: { maintenance: settings.maintenance },
  });
});

/**
 * PUT /api/settings/announcement  (admin)
 * Body: { enabled, text, link?, linkLabel?, tone?, startsAt?, endsAt? }
 */
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const settings = await Settings.get();
  Object.assign(settings.announcement, req.body);

  settings.updatedBy = req.user._id;
  await settings.save();
  invalidateMaintenanceCache();

  res.json({ success: true, message: 'Announcement updated', data: { announcement: settings.announcement } });
});
