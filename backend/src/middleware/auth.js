import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.js';

const readToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
};

const loadUser = async (token) => {
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('Account no longer available');
  return user;
};

/** Rejects the request unless a valid bearer token is present. */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = readToken(req);
  if (!token) throw ApiError.unauthorized('Please sign in to continue');

  try {
    req.user = await loadUser(token);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized('Session expired, please sign in again');
  }
  next();
});

/** Attaches req.user when a token happens to be present, but never blocks. */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      req.user = await loadUser(token);
    } catch {
      req.user = undefined;
    }
  }
  next();
});

/** Any staff tier (staff, manager, admin, superadmin). Must run after `protect`. */
export const adminOnly = (req, _res, next) => {
  if (!req.user?.isStaff()) {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};

/** Owner-only actions, e.g. changing another account's role. */
export const superAdminOnly = (req, _res, next) => {
  if (req.user?.role !== 'superadmin') {
    return next(ApiError.forbidden('Only the store owner can do this'));
  }
  next();
};

/**
 * Gate a route on a specific permission instead of a role, so access can be
 * tuned per account from the admin panel.
 *
 *   router.put('/products/:id', protect, requirePermission(PERMISSIONS.PRODUCTS_WRITE), handler)
 */
export const requirePermission = (...permissions) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized('Please sign in to continue'));

  const allowed = permissions.every((permission) => req.user.can(permission));
  if (!allowed) {
    return next(ApiError.forbidden(`Missing permission: ${permissions.join(', ')}`));
  }
  next();
};
