import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { EmailLog } from '../models/EmailLog.js';
import { Settings } from '../models/Settings.js';
import {
  adminOrderAlertEmail,
  contactAckEmail,
  customRequestAckEmail,
  orderConfirmationEmail,
  orderStatusEmail,
  testEmail,
  welcomeEmail,
} from '../templates/emailTemplates.js';

/**
 * Dual-mode transport:
 *  • SMTP_HOST/USER/PASS set  → real delivery (Brevo, SES, Zoho, Gmail app password…)
 *  • nothing set, dev mode    → Ethereal test inbox; every email gets a preview URL
 *  • nothing set, production  → emails are skipped and logged, never thrown
 */
let transporter = null;
let transportKind = 'none';

const buildTransport = async () => {
  if (transporter) return transporter;

  if (env.mail.configured) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure || env.mail.port === 465,
      auth: { user: env.mail.user, pass: env.mail.pass },
    });
    transportKind = `smtp:${env.mail.host}`;
    return transporter;
  }

  if (!env.isProd) {
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });
    transportKind = 'ethereal';
    console.log('📧 No SMTP configured — using Ethereal test inbox (preview links appear in the logs).');
    return transporter;
  }

  return null;
};

/** Guards the configured daily quota so a loop cannot burn the sending limit. */
const underDailyLimit = async (settings) => {
  const limit = settings.email?.dailyLimit ?? 0;
  if (!limit) return true;

  const since = new Date();
  since.setHours(0, 0, 0, 0);

  const sentToday = await EmailLog.countDocuments({ status: 'SENT', createdAt: { $gte: since } });
  return sentToday < limit;
};

/**
 * Sends one email and always records the attempt. Never throws — a failed email
 * must not fail the order it was announcing.
 */
export const sendMail = async ({ to, subject, html, text, type = 'OTHER', relatedOrder = '' }) => {
  const settings = await Settings.get();

  if (!to) {
    return EmailLog.create({ to: 'unknown', subject, type, status: 'SKIPPED', error: 'No recipient' });
  }

  if (!(await underDailyLimit(settings))) {
    return EmailLog.create({
      to,
      subject,
      type,
      status: 'SKIPPED',
      error: `Daily limit of ${settings.email.dailyLimit} emails reached`,
      relatedOrder,
    });
  }

  try {
    const transport = await buildTransport();
    if (!transport) {
      return await EmailLog.create({
        to,
        subject,
        type,
        status: 'SKIPPED',
        error: 'No SMTP transport configured',
        relatedOrder,
      });
    }

    const info = await transport.sendMail({
      from: env.mail.from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000),
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || '';
    if (previewUrl) console.log(`📧 Email preview (${type}): ${previewUrl}`);

    return await EmailLog.create({
      to,
      subject,
      type,
      status: 'SENT',
      provider: transportKind,
      messageId: info.messageId || '',
      previewUrl,
      relatedOrder,
    });
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return EmailLog.create({
      to,
      subject,
      type,
      status: 'FAILED',
      provider: transportKind,
      error: error.message,
      relatedOrder,
    });
  }
};

const storeInfo = (settings) => ({
  name: settings.store.name,
  supportEmail: settings.store.supportEmail,
  supportPhone: settings.store.supportPhone,
  address: settings.store.address,
});

const adminRecipients = (settings) => {
  const list = settings.email?.adminRecipients?.length
    ? settings.email.adminRecipients
    : [env.mail.adminAlert || settings.store.supportEmail];
  return list.filter(Boolean).join(',');
};

/* ── Public helpers ─────────────────────────────────────────────── */

export const sendOrderConfirmation = async (order) => {
  const settings = await Settings.get();
  if (!settings.email.orderConfirmationEnabled) return null;

  const { subject, html } = orderConfirmationEmail(order, storeInfo(settings));
  return sendMail({
    to: order.shippingAddress.email,
    subject,
    html,
    type: 'ORDER_CONFIRMATION',
    relatedOrder: order.orderNumber,
  });
};

export const sendAdminOrderAlert = async (order) => {
  const settings = await Settings.get();
  if (!settings.email.adminNotificationEnabled) return null;

  const { subject, html } = adminOrderAlertEmail(order, storeInfo(settings));
  return sendMail({
    to: adminRecipients(settings),
    subject,
    html,
    type: 'ADMIN_ORDER_ALERT',
    relatedOrder: order.orderNumber,
  });
};

export const sendOrderStatusUpdate = async (order, note = '') => {
  const settings = await Settings.get();
  const { subject, html } = orderStatusEmail(order, storeInfo(settings), note);
  return sendMail({
    to: order.shippingAddress.email,
    subject,
    html,
    type: 'ORDER_STATUS',
    relatedOrder: order.orderNumber,
  });
};

export const sendContactAck = async (enquiry) => {
  const settings = await Settings.get();
  if (!settings.email.contactAckEnabled) return null;

  const { subject, html } = contactAckEmail(enquiry, storeInfo(settings));
  return sendMail({ to: enquiry.email, subject, html, type: 'CONTACT_ACK' });
};

export const sendCustomRequestAck = async (request) => {
  const settings = await Settings.get();
  if (!settings.email.customRequestAckEnabled || !request.contactEmail) return null;

  const { subject, html } = customRequestAckEmail(request, storeInfo(settings));
  return sendMail({ to: request.contactEmail, subject, html, type: 'CUSTOM_REQUEST_ACK' });
};

export const sendWelcome = async (user) => {
  const settings = await Settings.get();
  if (!settings.email.welcomeEmailEnabled) return null;

  const { subject, html } = welcomeEmail(user, storeInfo(settings));
  return sendMail({ to: user.email, subject, html, type: 'WELCOME' });
};

export const sendTestEmail = async (to) => {
  const settings = await Settings.get();
  const { subject, html } = testEmail(storeInfo(settings));
  return sendMail({ to, subject, html, type: 'TEST' });
};

/** Shown on the admin panel's system tab. */
export const getTransportStatus = async () => {
  const since = new Date();
  since.setHours(0, 0, 0, 0);

  const [sentToday, failedToday, settings] = await Promise.all([
    EmailLog.countDocuments({ status: 'SENT', createdAt: { $gte: since } }),
    EmailLog.countDocuments({ status: 'FAILED', createdAt: { $gte: since } }),
    Settings.get(),
  ]);

  return {
    mode: env.mail.configured ? 'SMTP' : env.isProd ? 'DISABLED' : 'ETHEREAL_PREVIEW',
    host: env.mail.host || null,
    from: env.mail.from,
    sentToday,
    failedToday,
    dailyLimit: settings.email.dailyLimit,
    remainingToday: Math.max(0, (settings.email.dailyLimit || 0) - sentToday),
  };
};
