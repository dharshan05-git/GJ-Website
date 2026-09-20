import { ALL_PERMISSIONS, ROLES } from '../config/roles.js';
import { Contact } from '../models/Contact.js';
import { Customer } from '../models/Customer.js';
import { CustomRequest } from '../models/CustomRequest.js';
import { Order, ORDER_STATUSES } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { Subscriber } from '../models/Subscriber.js';
import { User } from '../models/User.js';
import { sendOrderStatusUpdate } from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/admin/stats
export const getStats = asyncHandler(async (_req, res) => {
  const settings = await Settings.get();
  const lowStockThreshold = settings.commerce.lowStockThreshold || 5;

  const [
    products,
    outOfStock,
    unavailable,
    lowStock,
    users,
    customers,
    orders,
    pendingOrders,
    contacts,
    customRequests,
    subscribers,
    revenueRows,
    recentOrders,
    statusRows,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $lte: 0 } }),
    Product.countDocuments({ isActive: true, isAvailable: false }),
    Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: lowStockThreshold } }),
    User.countDocuments({ role: 'user' }),
    Customer.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } }),
    Contact.countDocuments({ status: 'NEW' }),
    CustomRequest.countDocuments({ status: 'NEW' }),
    Subscriber.countDocuments({ isSubscribed: true }),
    Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, revenue: { $sum: '$total' }, avgOrder: { $avg: '$total' } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber total status paymentStatus createdAt shippingAddress.fullName shippingAddress.email'),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  res.json({
    success: true,
    data: {
      products,
      outOfStock,
      unavailable,
      lowStock,
      users,
      customers,
      orders,
      pendingOrders,
      newEnquiries: contacts,
      newCustomRequests: customRequests,
      subscribers,
      revenue: Math.round((revenueRows[0]?.revenue || 0) * 100) / 100,
      averageOrderValue: Math.round((revenueRows[0]?.avgOrder || 0) * 100) / 100,
      statusBreakdown: Object.fromEntries(statusRows.map((row) => [row._id, row.count])),
      maintenanceMode: settings.maintenance.enabled,
      recentOrders,
    },
  });
});

// GET /api/admin/customers
export const listCustomers = asyncHandler(async (req, res) => {
  const { search, sort = 'recent', page = 1, limit = 25 } = req.query;

  const filter = {};
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }

  const sorts = {
    recent: { lastOrderAt: -1 },
    spend: { totalSpent: -1 },
    orders: { ordersCount: -1 },
    name: { name: 1 },
  };

  const perPage = Math.min(Number(limit) || 25, 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort(sorts[sort] || sorts.recent)
      .skip((currentPage - 1) * perPage)
      .limit(perPage),
    Customer.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { customers, pagination: { total, page: currentPage, limit: perPage } },
  });
});

// GET /api/admin/customers/:email — profile plus full order history
export const getCustomer = asyncHandler(async (req, res) => {
  const email = String(req.params.email).toLowerCase();

  const customer = await Customer.findOne({ email });
  if (!customer) throw ApiError.notFound('Customer not found');

  const [orders, customRequests] = await Promise.all([
    Order.find({ 'shippingAddress.email': email }).sort({ createdAt: -1 }),
    CustomRequest.find({ contactEmail: email }).sort({ createdAt: -1 }),
  ]);

  res.json({ success: true, data: { customer, orders, customRequests } });
});

// PUT /api/admin/customers/:email — tags and internal notes
export const updateCustomer = asyncHandler(async (req, res) => {
  const { tags, adminNote, acceptsMarketing } = req.body;

  const customer = await Customer.findOneAndUpdate(
    { email: String(req.params.email).toLowerCase() },
    {
      ...(Array.isArray(tags) ? { tags } : {}),
      ...(adminNote !== undefined ? { adminNote } : {}),
      ...(acceptsMarketing !== undefined ? { acceptsMarketing: Boolean(acceptsMarketing) } : {}),
    },
    { new: true }
  );
  if (!customer) throw ApiError.notFound('Customer not found');

  res.json({ success: true, message: 'Customer updated', data: { customer } });
});

// GET /api/admin/orders
export const listOrders = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 25 } = req.query;

  const filter = {};
  if (status) filter.status = status.toUpperCase();
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { orderNumber: rx },
      { 'shippingAddress.fullName': rx },
      { 'shippingAddress.email': rx },
      { 'shippingAddress.phone': rx },
    ];
  }

  const perPage = Math.min(Number(limit) || 25, 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      orders,
      pagination: { total, page: currentPage, limit: perPage, pages: Math.ceil(total / perPage) || 1 },
    },
  });
});

// PUT /api/admin/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note = '' } = req.body;
  const next = String(status || '').toUpperCase();

  if (!ORDER_STATUSES.includes(next)) {
    throw ApiError.badRequest(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  order.status = next;
  if (next === 'DELIVERED') {
    order.deliveredAt = new Date();
    if (order.paymentMethod === 'COD') order.paymentStatus = 'PAID';
  }
  if (next === 'CANCELLED') order.cancelledAt = new Date();
  order.statusHistory.push({ status: next, note });
  await order.save();

  res.json({ success: true, message: `Order marked ${next.toLowerCase()}`, data: { order } });

  // Keep the customer posted unless the panel asked us not to.
  if (req.body.notifyCustomer !== false) sendOrderStatusUpdate(order, note).catch(() => {});
});

// GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 25 } = req.query;

  const filter = {};
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }

  const perPage = Math.min(Number(limit) || 25, 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { users: users.map((u) => u.toPublic()), pagination: { total, page: currentPage, limit: perPage } },
  });
});

// PUT /api/admin/users/:id/status — enable or disable an account
export const setUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user.role === 'superadmin') throw ApiError.forbidden('The owner account cannot be disabled');
  if (user._id.equals(req.user._id)) throw ApiError.badRequest('You cannot disable your own account');

  user.isActive = Boolean(req.body.isActive);
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: user.isActive ? 'Account enabled' : 'Account disabled',
    data: { user: user.toPublic() },
  });
});

/* ── Staff & access tiers (owner only) ──────────────────────────── */

// GET /api/admin/staff — the team plus the permission vocabulary for the UI
export const listStaff = asyncHandler(async (_req, res) => {
  const staff = await User.find({ role: { $ne: 'user' } }).sort({ role: 1, name: 1 });

  res.json({
    success: true,
    data: {
      staff: staff.map((member) => member.toPublic()),
      roles: ROLES.filter((role) => role !== 'user'),
      permissions: ALL_PERMISSIONS,
    },
  });
});

/**
 * PUT /api/admin/staff/:id — set a member's tier and fine-tune their access.
 * Body: { role?, extraPermissions?, deniedPermissions? }
 *
 * `extraPermissions` is how one admin gets "a little more access than the basic
 * admin" without inventing a new role for them.
 */
export const updateStaffAccess = asyncHandler(async (req, res) => {
  const { role, extraPermissions, deniedPermissions } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  if (user._id.equals(req.user._id)) throw ApiError.badRequest('You cannot change your own access');
  if (user.role === 'superadmin') throw ApiError.forbidden('The owner account cannot be changed here');

  if (role) {
    if (!ROLES.includes(role)) throw ApiError.badRequest(`Role must be one of: ${ROLES.join(', ')}`);
    user.role = role;
  }

  for (const [field, value] of [
    ['extraPermissions', extraPermissions],
    ['deniedPermissions', deniedPermissions],
  ]) {
    if (!Array.isArray(value)) continue;

    const unknown = value.filter((permission) => !ALL_PERMISSIONS.includes(permission));
    if (unknown.length) throw ApiError.badRequest(`Unknown permission(s): ${unknown.join(', ')}`);
    user[field] = value;
  }

  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Access updated', data: { user: user.toPublic() } });
});

/** POST /api/admin/staff — create a team member with a starting tier. */
export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, phone = '', role = 'staff', extraPermissions = [] } = req.body;

  if (!ROLES.includes(role) || role === 'user') {
    throw ApiError.badRequest(`Role must be one of: ${ROLES.filter((r) => r !== 'user').join(', ')}`);
  }
  if (role === 'superadmin') throw ApiError.forbidden('There can only be one owner account');

  if (await User.findOne({ email: String(email).toLowerCase() })) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const unknown = extraPermissions.filter((permission) => !ALL_PERMISSIONS.includes(permission));
  if (unknown.length) throw ApiError.badRequest(`Unknown permission(s): ${unknown.join(', ')}`);

  const user = await User.create({ name, email, password, phone, role, extraPermissions });

  res.status(201).json({ success: true, message: 'Team member added', data: { user: user.toPublic() } });
});
