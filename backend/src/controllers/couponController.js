import { Coupon } from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/coupons/validate — Body: { code, subtotal }
export const validateCoupon = asyncHandler(async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  const subtotal = Number(req.body.subtotal) || 0;

  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw ApiError.badRequest('Invalid promo code');

  const reason = coupon.reasonInvalidFor(subtotal);
  if (reason) throw ApiError.badRequest(reason);

  let discount =
    coupon.type === 'PERCENT' ? (subtotal * coupon.value) / 100 : Math.min(coupon.value, subtotal);
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.round(discount * 100) / 100;

  res.json({
    success: true,
    message: `Promo code ${coupon.code} applied`,
    data: {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discount,
    },
  });
});

// GET /api/coupons  (admin)
export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { coupons } });
});

// POST /api/coupons  (admin)
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, message: 'Coupon created', data: { coupon } });
});

// PUT /api/coupons/:id  (admin)
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) throw ApiError.notFound('Coupon not found');

  res.json({ success: true, message: 'Coupon updated', data: { coupon } });
});

// DELETE /api/coupons/:id  (admin)
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');

  res.json({ success: true, message: 'Coupon deleted' });
});
