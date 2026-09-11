import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

let client = null;
const razorpay = () => {
  if (!env.razorpay.enabled) {
    throw ApiError.badRequest(
      'Online payment is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, or place the order as COD.'
    );
  }
  if (!client) {
    client = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });
  }
  return client;
};

// GET /api/payments/config — the publishable key the checkout widget needs
export const getPaymentConfig = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    data: {
      razorpayEnabled: env.razorpay.enabled,
      keyId: env.razorpay.keyId || null,
      currency: env.store.currency,
    },
  });
});

/**
 * POST /api/payments/razorpay/order
 * Body: { orderNumber }. The amount always comes from the stored order.
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: String(req.body.orderNumber).toUpperCase() });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentStatus === 'PAID') throw ApiError.badRequest('This order is already paid');
  if (order.total <= 0) throw ApiError.badRequest('This order has no payable amount yet');

  const rzpOrder = await razorpay().orders.create({
    amount: Math.round(order.total * 100), // paise
    currency: order.currency,
    receipt: order.orderNumber,
    notes: { orderNumber: order.orderNumber },
  });

  order.paymentMethod = 'RAZORPAY';
  order.payment.razorpayOrderId = rzpOrder.id;
  await order.save();

  res.status(201).json({
    success: true,
    data: {
      keyId: env.razorpay.keyId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      orderNumber: order.orderNumber,
      customer: {
        name: order.shippingAddress.fullName,
        email: order.shippingAddress.email,
        contact: order.shippingAddress.phone,
      },
    },
  });
});

/**
 * POST /api/payments/razorpay/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id: rzpOrderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;

  if (!rzpOrderId || !paymentId || !signature) {
    throw ApiError.badRequest('Incomplete payment response');
  }

  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${rzpOrderId}|${paymentId}`)
    .digest('hex');

  const order = await Order.findOne({ 'payment.razorpayOrderId': rzpOrderId });
  if (!order) throw ApiError.notFound('Order not found for this payment');

  const signatureValid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!signatureValid) {
    order.paymentStatus = 'FAILED';
    order.statusHistory.push({ status: order.status, note: 'Payment signature verification failed' });
    await order.save();
    throw ApiError.badRequest('Payment verification failed');
  }

  order.paymentStatus = 'PAID';
  order.payment.razorpayPaymentId = paymentId;
  order.payment.razorpaySignature = signature;
  order.payment.paidAt = new Date();
  order.status = 'CONFIRMED';
  order.statusHistory.push({ status: 'CONFIRMED', note: 'Payment received via Razorpay' });
  await order.save();

  res.json({ success: true, message: 'Payment verified', data: { order } });
});

/**
 * POST /api/payments/razorpay/webhook — raw body route, signed with
 * RAZORPAY_WEBHOOK_SECRET. Optional: only needed if you enable webhooks.
 */
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(200).json({ received: true, ignored: true });

  const signature = req.headers['x-razorpay-signature'];
  const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  if (signature !== expected) throw ApiError.badRequest('Invalid webhook signature');

  const event = JSON.parse(req.body.toString('utf8'));

  if (event.event === 'payment.captured') {
    const rzpOrderId = event.payload?.payment?.entity?.order_id;
    await Order.findOneAndUpdate(
      { 'payment.razorpayOrderId': rzpOrderId, paymentStatus: { $ne: 'PAID' } },
      {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        'payment.razorpayPaymentId': event.payload.payment.entity.id,
        'payment.paidAt': new Date(),
        $push: { statusHistory: { status: 'CONFIRMED', note: 'Payment captured (webhook)' } },
      }
    );
  }

  res.status(200).json({ received: true });
});
