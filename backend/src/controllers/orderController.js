import { Coupon } from '../models/Coupon.js';
import { Customer } from '../models/Customer.js';
import { CustomRequest } from '../models/CustomRequest.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { sendAdminOrderAlert, sendOrderConfirmation } from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateTotals } from '../utils/pricing.js';

/**
 * Rebuilds every line item from the database. Prices, names and images always
 * come from the server so a tampered client payload cannot change the amount.
 */
const resolveItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw ApiError.badRequest('Your bag is empty');
  }

  const items = [];
  const stockUpdates = [];

  for (const raw of rawItems) {
    const quantity = Math.max(1, Number(raw.quantity) || 1);

    // Bespoke pieces carry no price until the atelier quotes them.
    if (raw.customRequest) {
      const custom = await CustomRequest.findOne({ reference: raw.customRequest });
      if (!custom) throw ApiError.notFound(`Custom request ${raw.customRequest} not found`);

      items.push({
        product: `custom-${custom.reference}`,
        name: `${custom.productName} (Bespoke)`,
        image: custom.referenceImage,
        price: custom.quotedPrice || 0,
        metal: custom.plating,
        size: custom.ringSize || custom.bangleSize || '',
        quantity,
      });
      continue;
    }

    const productId = raw.productId || raw.id || raw.product;
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw ApiError.badRequest(`Product "${productId}" is no longer available`);

    // The admin panel's enable/disable switch takes a piece off sale instantly.
    if (!product.isAvailable) {
      throw ApiError.badRequest(`"${product.name}" is currently unavailable`);
    }
    if (product.stock < quantity) {
      throw ApiError.badRequest(
        product.stock === 0
          ? `"${product.name}" is out of stock`
          : `Only ${product.stock} left of "${product.name}"`
      );
    }

    items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      metal: raw.metal || product.metals?.[0] || '',
      size: raw.size || product.sizes?.[0] || '',
      quantity,
    });
    stockUpdates.push({ id: product._id, quantity });
  }

  return { items, stockUpdates };
};

const resolveCoupon = async (code, subtotal) => {
  if (!code) return null;

  const coupon = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
  if (!coupon) throw ApiError.badRequest('Invalid promo code');

  const reason = coupon.reasonInvalidFor(subtotal);
  if (reason) throw ApiError.badRequest(reason);

  return coupon;
};

// POST /api/orders  (guest or signed in)
export const createOrder = asyncHandler(async (req, res) => {
  const {
    items: rawItems,
    shippingAddress,
    couponCode = '',
    paymentMethod = 'COD',
    notes = '',
  } = req.body;

  const { items, stockUpdates } = await resolveItems(rawItems);
  const settings = await Settings.get();

  if (paymentMethod === 'COD' && !settings.commerce.codEnabled) {
    throw ApiError.badRequest('Cash on delivery is currently unavailable');
  }
  if (paymentMethod === 'RAZORPAY' && !settings.commerce.onlinePaymentEnabled) {
    throw ApiError.badRequest('Online payment is currently unavailable');
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = await resolveCoupon(couponCode, subtotal);
  const totals = calculateTotals(items, coupon, settings.commerce);

  const order = await Order.create({
    user: req.user?._id || null,
    isGuest: !req.user,
    items,
    shippingAddress,
    couponCode: coupon?.code || '',
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    currency: totals.currency,
    paymentMethod,
    paymentStatus: 'PENDING',
    status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
    statusHistory: [
      {
        status: paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
        note: paymentMethod === 'COD' ? 'Cash on delivery order placed' : 'Awaiting payment',
      },
    ],
    notes,
  });

  // Reserve stock and burn one coupon use.
  await Promise.all(
    stockUpdates.map((update) =>
      Product.updateOne({ _id: update.id }, { $inc: { stock: -update.quantity } })
    )
  );
  if (coupon) await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });

  // The bag has become an order.
  if (req.user) {
    req.user.cart = [];
    await req.user.save({ validateBeforeSave: false });
  }

  // Customer directory: one row per buyer, guests included.
  await Customer.recordOrder(order);

  res.status(201).json({ success: true, message: 'Order placed', data: { order } });

  // Email automation runs after the response so a slow SMTP hop never delays checkout.
  sendOrderConfirmation(order).catch(() => {});
  sendAdminOrderAlert(order).catch(() => {});
});

// GET /api/orders/my  (protected)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { orders } });
});

// GET /api/orders/:orderNumber
// Signed in owners and admins see it directly; guests must pass ?email= used at checkout.
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() });
  if (!order) throw ApiError.notFound('Order not found');

  const isOwner = req.user && order.user && order.user.equals(req.user._id);
  const isAdmin = req.user?.role === 'admin';
  const emailMatches =
    req.query.email &&
    order.shippingAddress.email === String(req.query.email).toLowerCase().trim();

  if (!isOwner && !isAdmin && !emailMatches) {
    throw ApiError.forbidden('Add the email used at checkout to view this order');
  }

  res.json({ success: true, data: { order } });
});

// PUT /api/orders/:orderNumber/cancel  (protected, owner only)
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() });
  if (!order) throw ApiError.notFound('Order not found');

  const isOwner = order.user && order.user.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') throw ApiError.forbidden('Not your order');

  if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
    throw ApiError.badRequest(`An order that is ${order.status.toLowerCase()} cannot be cancelled`);
  }

  order.status = 'CANCELLED';
  order.cancelledAt = new Date();
  order.statusHistory.push({ status: 'CANCELLED', note: req.body.reason || 'Cancelled by customer' });
  await order.save();

  // Put the reserved stock back.
  await Promise.all(
    order.items
      .filter((item) => !item.product.startsWith('custom-'))
      .map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))
  );

  res.json({ success: true, message: 'Order cancelled', data: { order } });
});

/**
 * POST /api/orders/quote — totals preview for the cart drawer, without creating
 * an order. Body: { items, couponCode }
 */
export const quoteOrder = asyncHandler(async (req, res) => {
  const { items } = await resolveItems(req.body.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = await resolveCoupon(req.body.couponCode, subtotal);
  const settings = await Settings.get();

  res.json({
    success: true,
    data: {
      items,
      coupon: coupon ? { code: coupon.code, description: coupon.description } : null,
      ...calculateTotals(items, coupon, settings.commerce),
    },
  });
});
