import { env } from '../config/env.js';

/* Brand palette, mirrored from the storefront design system. */
const C = {
  canvas: '#FAF6F0',
  card: '#FFFFFF',
  ink: '#1A1615',
  inkSoft: '#5C4038',
  rose: '#7B3F42',
  roseSoft: '#A67B8A',
  gold: '#C6A46A',
  border: '#EDE5DC',
};

const money = (value = 0) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (date) =>
  new Date(date || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** Shared shell: centred card, serif headings, brand footer. */
const layout = ({ preheader = '', heading, body, store }) => `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.canvas};font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${C.ink};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:${C.card};border:1px solid ${C.border};border-radius:14px;overflow:hidden;">

        <tr>
          <td align="center" style="background:${C.ink};padding:26px 24px;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:6px;color:#fff;">GEVARIYA</div>
            <div style="font-size:10px;letter-spacing:5px;color:${C.gold};margin-top:6px;">J E W E L S</div>
          </td>
        </tr>

        <tr>
          <td style="padding:30px 26px 8px;">
            <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:22px;font-weight:400;letter-spacing:1px;text-transform:uppercase;color:${C.ink};">${escapeHtml(heading)}</h1>
            <div style="width:52px;height:2px;background:${C.gold};margin:10px 0 18px;"></div>
          </td>
        </tr>

        <tr><td style="padding:0 26px 28px;font-size:14px;line-height:1.7;color:${C.inkSoft};">${body}</td></tr>

        <tr>
          <td style="background:${C.canvas};border-top:1px solid ${C.border};padding:22px 26px;font-size:11px;line-height:1.8;color:${C.inkSoft};">
            <strong style="color:${C.rose};letter-spacing:1px;">CUSTOMER CARE</strong><br />
            ${escapeHtml(store.supportEmail)} &nbsp;•&nbsp; ${escapeHtml(store.supportPhone)}<br />
            ${escapeHtml(store.address)}<br /><br />
            <span style="color:${C.roseSoft};">Every Gevariya piece carries a 90-day colour warranty and a certificate of authenticity.</span><br />
            <span style="color:#9a8d86;">© ${new Date().getFullYear()} ${escapeHtml(store.name)}. All rights reserved.</span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

const itemsTable = (order) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:6px 0 18px;">
  <tr style="background:${C.canvas};">
    <th align="left"  style="padding:9px 10px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.rose};border-bottom:1px solid ${C.border};">Piece</th>
    <th align="center" style="padding:9px 6px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.rose};border-bottom:1px solid ${C.border};">Qty</th>
    <th align="right" style="padding:9px 10px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.rose};border-bottom:1px solid ${C.border};">Amount</th>
  </tr>
  ${order.items
    .map(
      (item) => `
  <tr>
    <td style="padding:12px 10px;border-bottom:1px solid ${C.border};">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        ${
          item.image && item.image.startsWith('http')
            ? `<td width="54" style="padding-right:12px;"><img src="${escapeHtml(item.image)}" width="54" height="54" alt="" style="display:block;border-radius:8px;object-fit:cover;border:1px solid ${C.border};" /></td>`
            : ''
        }
        <td>
          <div style="font-size:13px;font-weight:600;color:${C.ink};">${escapeHtml(item.name)}</div>
          <div style="font-size:11px;color:${C.roseSoft};margin-top:3px;">
            ${[item.metal, item.size].filter(Boolean).map(escapeHtml).join(' &nbsp;•&nbsp; ')}
          </div>
          <div style="font-size:11px;color:#9a8d86;margin-top:2px;">${money(item.price)} each</div>
        </td>
      </tr></table>
    </td>
    <td align="center" style="padding:12px 6px;border-bottom:1px solid ${C.border};font-size:13px;">${item.quantity}</td>
    <td align="right" style="padding:12px 10px;border-bottom:1px solid ${C.border};font-size:13px;font-weight:600;color:${C.ink};">${money(item.price * item.quantity)}</td>
  </tr>`
    )
    .join('')}
</table>`;

const summaryRows = (order) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
  <tr><td style="padding:5px 0;color:${C.inkSoft};">Subtotal</td><td align="right" style="padding:5px 0;">${money(order.subtotal)}</td></tr>
  ${order.discount > 0 ? `<tr><td style="padding:5px 0;color:${C.rose};">Discount ${order.couponCode ? `(${escapeHtml(order.couponCode)})` : ''}</td><td align="right" style="padding:5px 0;color:${C.rose};">− ${money(order.discount)}</td></tr>` : ''}
  <tr><td style="padding:5px 0;color:${C.inkSoft};">Insured shipping</td><td align="right" style="padding:5px 0;">${order.shipping > 0 ? money(order.shipping) : 'COMPLIMENTARY'}</td></tr>
  <tr>
    <td style="padding:12px 0 0;border-top:1px solid ${C.border};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Grand Total</td>
    <td align="right" style="padding:12px 0 0;border-top:1px solid ${C.border};font-size:17px;font-weight:700;color:${C.rose};">${money(order.total)}</td>
  </tr>
</table>`;

const addressBlock = (address) => `
<div style="background:${C.canvas};border:1px solid ${C.border};border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.7;">
  <div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.rose};margin-bottom:6px;">Delivering to</div>
  <strong style="color:${C.ink};">${escapeHtml(address.fullName)}</strong><br />
  ${escapeHtml(address.line1)}${address.line2 ? `, ${escapeHtml(address.line2)}` : ''}<br />
  ${escapeHtml(address.city)}, ${escapeHtml(address.state)} ${escapeHtml(address.postalCode)}<br />
  ${escapeHtml(address.country || 'India')}<br />
  ${escapeHtml(address.phone)} &nbsp;•&nbsp; ${escapeHtml(address.email)}
</div>`;

const metaRow = (order) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:12px;">
  <tr>
    <td style="padding:4px 0;color:#9a8d86;">Order number</td>
    <td align="right" style="padding:4px 0;font-weight:700;letter-spacing:1px;color:${C.ink};">${escapeHtml(order.orderNumber)}</td>
  </tr>
  <tr>
    <td style="padding:4px 0;color:#9a8d86;">Placed on</td>
    <td align="right" style="padding:4px 0;">${formatDate(order.createdAt)}</td>
  </tr>
  <tr>
    <td style="padding:4px 0;color:#9a8d86;">Payment</td>
    <td align="right" style="padding:4px 0;">${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid online'} • ${escapeHtml(order.paymentStatus)}</td>
  </tr>
</table>`;

/* ── Customer: order confirmation ────────────────────────────────── */
export const orderConfirmationEmail = (order, store) => ({
  subject: `Your Gevariya order ${order.orderNumber} is confirmed`,
  html: layout({
    store,
    preheader: `Order ${order.orderNumber} • ${money(order.total)}`,
    heading: 'Thank you for your order',
    body: `
      <p style="margin:0 0 16px;">Dear ${escapeHtml(order.shippingAddress.fullName)},</p>
      <p style="margin:0 0 18px;">Your order has been received and our atelier has begun preparing it. Here is your invoice.</p>
      ${metaRow(order)}
      ${itemsTable(order)}
      ${summaryRows(order)}
      <div style="height:18px;"></div>
      ${addressBlock(order.shippingAddress)}
      <p style="margin:20px 0 0;font-size:12.5px;color:${C.inkSoft};">
        We will email you again the moment your parcel is dispatched. Reply to this email for any change of address or size.
      </p>`,
  }),
});

/* ── Customer: status change ─────────────────────────────────────── */
export const orderStatusEmail = (order, store, note = '') => {
  const copy = {
    CONFIRMED: 'Your order has been confirmed.',
    PROCESSING: 'Our karigars are preparing your pieces.',
    SHIPPED: 'Your parcel is on its way, fully insured.',
    DELIVERED: 'Your order has been delivered. We hope you love it.',
    CANCELLED: 'Your order has been cancelled.',
    PENDING: 'Your order is awaiting payment.',
  };

  return {
    subject: `Order ${order.orderNumber} — ${order.status.toLowerCase()}`,
    html: layout({
      store,
      preheader: copy[order.status] || 'Order update',
      heading: `Order ${order.status.toLowerCase()}`,
      body: `
        <p style="margin:0 0 14px;">Dear ${escapeHtml(order.shippingAddress.fullName)},</p>
        <p style="margin:0 0 18px;">${escapeHtml(copy[order.status] || 'There is an update on your order.')}</p>
        ${note ? `<p style="margin:0 0 18px;padding:12px 14px;background:${C.canvas};border-left:3px solid ${C.gold};font-size:13px;">${escapeHtml(note)}</p>` : ''}
        ${metaRow(order)}
        ${summaryRows(order)}`,
    }),
  };
};

/* ── Internal: new order alert ───────────────────────────────────── */
export const adminOrderAlertEmail = (order, store) => ({
  subject: `New order ${order.orderNumber} • ${money(order.total)}`,
  html: layout({
    store,
    preheader: `${order.items.length} item(s) from ${order.shippingAddress.fullName}`,
    heading: 'New order received',
    body: `
      ${metaRow(order)}
      ${itemsTable(order)}
      ${summaryRows(order)}
      <div style="height:18px;"></div>
      ${addressBlock(order.shippingAddress)}
      ${order.notes ? `<p style="margin:16px 0 0;font-size:12.5px;"><strong>Customer note:</strong> ${escapeHtml(order.notes)}</p>` : ''}`,
  }),
});

/* ── Customer: consultation booking acknowledgement ──────────────── */
export const contactAckEmail = (enquiry, store) => ({
  subject: 'Your private consultation request — Gevariya Jewels',
  html: layout({
    store,
    preheader: 'We have received your consultation request.',
    heading: 'Consultation requested',
    body: `
      <p style="margin:0 0 14px;">Dear ${escapeHtml(enquiry.name)},</p>
      <p style="margin:0 0 18px;">Thank you for writing to us. Our concierge will confirm your appointment within one working day.</p>
      <div style="background:${C.canvas};border:1px solid ${C.border};border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.8;">
        ${enquiry.preferredDate ? `<div><strong>Preferred date:</strong> ${formatDate(enquiry.preferredDate)}</div>` : ''}
        <div><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</div>
        ${enquiry.message ? `<div style="margin-top:8px;"><strong>Your note:</strong><br />${escapeHtml(enquiry.message)}</div>` : ''}
      </div>`,
  }),
});

/* ── Customer: bespoke request acknowledgement ───────────────────── */
export const customRequestAckEmail = (request, store) => ({
  subject: `Bespoke request ${request.reference} received`,
  html: layout({
    store,
    preheader: `We are reviewing "${request.productName}".`,
    heading: 'Bespoke request received',
    body: `
      <p style="margin:0 0 14px;">Dear ${escapeHtml(request.contactName || 'Patron')},</p>
      <p style="margin:0 0 18px;">Our master karigars are reviewing your specifications and will send a quotation shortly.</p>
      <div style="background:${C.canvas};border:1px solid ${C.border};border-radius:10px;padding:14px 16px;font-size:12.5px;line-height:1.9;">
        <div><strong>Reference:</strong> ${escapeHtml(request.reference)}</div>
        <div><strong>Piece:</strong> ${escapeHtml(request.productName)} (${escapeHtml(request.productType)})</div>
        <div><strong>Metal:</strong> ${escapeHtml(request.metal)} • ${escapeHtml(request.plating)}</div>
        ${request.ringSize ? `<div><strong>Ring size:</strong> ${escapeHtml(request.ringSize)}</div>` : ''}
        ${request.bangleSize ? `<div><strong>Bangle size:</strong> ${escapeHtml(request.bangleSize)}</div>` : ''}
        ${request.notes ? `<div style="margin-top:6px;"><strong>Your notes:</strong><br />${escapeHtml(request.notes)}</div>` : ''}
      </div>`,
  }),
});

/* ── Customer: welcome ───────────────────────────────────────────── */
export const welcomeEmail = (user, store) => ({
  subject: 'Welcome to the Gevariya Circle',
  html: layout({
    store,
    preheader: 'Enjoy 10% off your first handcrafted order.',
    heading: 'Welcome to Gevariya',
    body: `
      <p style="margin:0 0 14px;">Dear ${escapeHtml(user.name)},</p>
      <p style="margin:0 0 18px;">Your account is ready. As a member of the Gevariya Circle, enjoy <strong>10% off</strong> your first handcrafted order with the code below.</p>
      <div style="text-align:center;margin:22px 0;">
        <span style="display:inline-block;border:1px dashed ${C.gold};color:${C.rose};font-size:18px;letter-spacing:5px;font-weight:700;padding:14px 26px;border-radius:8px;background:${C.canvas};">GEVARIYA10</span>
      </div>
      <div style="text-align:center;">
        <a href="${escapeHtml(env.siteUrl)}" style="display:inline-block;background:${C.rose};color:#fff;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:13px 30px;border-radius:6px;">Explore the boutique</a>
      </div>`,
  }),
});

/* ── Internal: SMTP smoke test ───────────────────────────────────── */
export const testEmail = (store) => ({
  subject: 'Gevariya Jewels — email automation test',
  html: layout({
    store,
    preheader: 'SMTP is wired correctly.',
    heading: 'Email automation works',
    body: `
      <p style="margin:0 0 14px;">If you can read this, the Gevariya Jewels backend can send mail through the configured transport.</p>
      <p style="margin:0;font-size:12px;color:#9a8d86;">Sent at ${new Date().toLocaleString('en-IN')}</p>`,
  }),
});
