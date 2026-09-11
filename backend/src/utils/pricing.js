import { env } from '../config/env.js';

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Single source of truth for order maths. The client may show its own numbers,
 * but only what this function returns is ever stored or charged.
 *
 * `commerce` comes from the admin-editable Settings document; the .env values
 * are only the fallback used before settings exist.
 */
export const calculateTotals = (items, coupon = null, commerce = null) => {
  const freeShippingThreshold =
    commerce?.freeShippingThreshold ?? env.store.freeShippingThreshold;
  const shippingFee = commerce?.shippingFee ?? env.store.shippingFee;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    discount =
      coupon.type === 'PERCENT'
        ? (subtotal * coupon.value) / 100
        : Math.min(coupon.value, subtotal);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = round2(Math.max(0, Math.min(discount, subtotal)));

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = round2(Math.max(0, subtotal - discount + shipping));

  return {
    subtotal: round2(subtotal),
    discount,
    shipping: round2(shipping),
    total,
    currency: env.store.currency,
    freeShippingThreshold,
  };
};
