import { EmailLog } from '../models/EmailLog.js';
import { Order } from '../models/Order.js';
import {
  getTransportStatus,
  sendOrderConfirmation,
  sendTestEmail,
} from '../services/emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/admin/emails/logs
export const listEmailLogs = asyncHandler(async (req, res) => {
  const { type, status, limit = 50 } = req.query;

  const filter = {};
  if (type) filter.type = type.toUpperCase();
  if (status) filter.status = status.toUpperCase();

  const logs = await EmailLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 50, 200));

  res.json({ success: true, data: { logs, total: logs.length } });
});

// GET /api/admin/emails/status
export const emailStatus = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getTransportStatus() });
});

// POST /api/admin/emails/test  Body: { to }
export const sendTest = asyncHandler(async (req, res) => {
  const to = String(req.body.to || '').trim();
  if (!to) throw ApiError.badRequest('A recipient email is required');

  const log = await sendTestEmail(to);

  res.json({
    success: log.status === 'SENT',
    message:
      log.status === 'SENT'
        ? `Test email sent to ${to}`
        : `Test email ${log.status.toLowerCase()}: ${log.error}`,
    data: { log },
  });
});

// POST /api/admin/orders/:orderNumber/resend-email
export const resendOrderEmail = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() });
  if (!order) throw ApiError.notFound('Order not found');

  const log = await sendOrderConfirmation(order);
  if (!log) throw ApiError.badRequest('Order confirmation emails are switched off in settings');

  res.json({
    success: log.status === 'SENT',
    message:
      log.status === 'SENT'
        ? `Confirmation resent to ${order.shippingAddress.email}`
        : `Could not resend: ${log.error}`,
    data: { log },
  });
});
