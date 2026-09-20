import { Router } from 'express';
import { body } from 'express-validator';
import { PERMISSIONS } from '../config/roles.js';
import {
  createStaff,
  getCustomer,
  getStats,
  listCustomers,
  listOrders,
  listStaff,
  listUsers,
  setUserActive,
  updateCustomer,
  updateOrderStatus,
  updateStaffAccess,
} from '../controllers/adminController.js';
import {
  emailStatus,
  listEmailLogs,
  resendOrderEmail,
  sendTest,
} from '../controllers/emailController.js';
import { listAllProducts, setAvailability } from '../controllers/productController.js';
import {
  getSettings,
  toggleMaintenance,
  updateAnnouncement,
  updateSettings,
} from '../controllers/settingsController.js';
import { adminOnly, protect, requirePermission, superAdminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Every route below needs a signed-in staff account.
router.use(protect, adminOnly);

router.get('/stats', getStats);

/* ── Catalog ─────────────────────────────────────────────────────── */
router.get('/products', requirePermission(PERMISSIONS.PRODUCTS_READ), listAllProducts);
router.patch(
  '/products/:id/availability',
  requirePermission(PERMISSIONS.PRODUCTS_WRITE),
  setAvailability
);

/* ── Orders ──────────────────────────────────────────────────────── */
router.get('/orders', requirePermission(PERMISSIONS.ORDERS_READ), listOrders);
router.put('/orders/:id/status', requirePermission(PERMISSIONS.ORDERS_WRITE), updateOrderStatus);
router.post(
  '/orders/:orderNumber/resend-email',
  requirePermission(PERMISSIONS.EMAILS_SEND),
  resendOrderEmail
);

/* ── Customers ───────────────────────────────────────────────────── */
router.get('/customers', requirePermission(PERMISSIONS.CUSTOMERS_READ), listCustomers);
router.get('/customers/:email', requirePermission(PERMISSIONS.CUSTOMERS_READ), getCustomer);
router.put('/customers/:email', requirePermission(PERMISSIONS.CUSTOMERS_WRITE), updateCustomer);

/* ── Accounts ────────────────────────────────────────────────────── */
router.get('/users', requirePermission(PERMISSIONS.USERS_MANAGE), listUsers);
router.put('/users/:id/status', requirePermission(PERMISSIONS.USERS_MANAGE), setUserActive);

/* ── Staff & access tiers (owner only) ───────────────────────────── */
router.get('/staff', superAdminOnly, listStaff);
router.post(
  '/staff',
  superAdminOnly,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  createStaff
);
router.put('/staff/:id', superAdminOnly, updateStaffAccess);

/* ── Email automation ────────────────────────────────────────────── */
router.get('/emails/logs', requirePermission(PERMISSIONS.EMAILS_READ), listEmailLogs);
router.get('/emails/status', requirePermission(PERMISSIONS.EMAILS_READ), emailStatus);
router.post('/emails/test', requirePermission(PERMISSIONS.EMAILS_SEND), sendTest);

/* ── Store settings, maintenance mode & announcement ─────────────── */
router.get('/settings', requirePermission(PERMISSIONS.SETTINGS_READ), getSettings);
router.put('/settings', requirePermission(PERMISSIONS.SETTINGS_WRITE), updateSettings);
router.post(
  '/settings/maintenance',
  requirePermission(PERMISSIONS.MAINTENANCE_TOGGLE),
  [body('enabled').isBoolean().withMessage('enabled must be true or false')],
  validate,
  toggleMaintenance
);
router.put(
  '/settings/announcement',
  requirePermission(PERMISSIONS.SETTINGS_WRITE),
  updateAnnouncement
);

export default router;
