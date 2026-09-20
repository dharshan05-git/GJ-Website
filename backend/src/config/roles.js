/**
 * Staff access tiers. Every admin-panel route declares the permission it needs,
 * so a new tier is a data change here rather than a code change everywhere.
 *
 * A user's effective permissions = role defaults + `extraPermissions` on their
 * account − `deniedPermissions`. That is what lets one admin be given "a little
 * more access than the basic admin" without inventing a new role.
 */
export const PERMISSIONS = {
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_DELETE: 'products:delete',
  ORDERS_READ: 'orders:read',
  ORDERS_WRITE: 'orders:write',
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_WRITE: 'customers:write',
  CUSTOM_READ: 'custom:read',
  CUSTOM_WRITE: 'custom:write',
  MARKETING_READ: 'marketing:read',
  MARKETING_WRITE: 'marketing:write',
  EMAILS_READ: 'emails:read',
  EMAILS_SEND: 'emails:send',
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  MAINTENANCE_TOGGLE: 'maintenance:toggle',
  USERS_MANAGE: 'users:manage',
  COUPONS_WRITE: 'coupons:write',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLES = ['user', 'staff', 'manager', 'admin', 'superadmin'];

/** Anything above `user` can reach the admin panel. */
export const STAFF_ROLES = ['staff', 'manager', 'admin', 'superadmin'];

export const ROLE_PERMISSIONS = {
  user: [],

  // Order desk: reads the shop, works orders and enquiries.
  staff: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_WRITE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOM_READ,
    PERMISSIONS.EMAILS_READ,
  ],

  // Store manager: catalog + marketing, but no settings or staff accounts.
  manager: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_WRITE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_WRITE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_WRITE,
    PERMISSIONS.CUSTOM_READ,
    PERMISSIONS.CUSTOM_WRITE,
    PERMISSIONS.MARKETING_READ,
    PERMISSIONS.MARKETING_WRITE,
    PERMISSIONS.EMAILS_READ,
    PERMISSIONS.EMAILS_SEND,
    PERMISSIONS.COUPONS_WRITE,
    PERMISSIONS.SETTINGS_READ,
  ],

  // Basic admin: everything a manager has, plus deletes and store settings.
  admin: [
    ...new Set([
      PERMISSIONS.PRODUCTS_READ,
      PERMISSIONS.PRODUCTS_WRITE,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.ORDERS_READ,
      PERMISSIONS.ORDERS_WRITE,
      PERMISSIONS.CUSTOMERS_READ,
      PERMISSIONS.CUSTOMERS_WRITE,
      PERMISSIONS.CUSTOM_READ,
      PERMISSIONS.CUSTOM_WRITE,
      PERMISSIONS.MARKETING_READ,
      PERMISSIONS.MARKETING_WRITE,
      PERMISSIONS.EMAILS_READ,
      PERMISSIONS.EMAILS_SEND,
      PERMISSIONS.COUPONS_WRITE,
      PERMISSIONS.SETTINGS_READ,
      PERMISSIONS.SETTINGS_WRITE,
      PERMISSIONS.MAINTENANCE_TOGGLE,
    ]),
  ],

  // Owner: everything, including creating and demoting other staff.
  superadmin: ALL_PERMISSIONS,
};

export const permissionsForRole = (role) => ROLE_PERMISSIONS[role] || [];
