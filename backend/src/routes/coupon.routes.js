import { Router } from 'express';
import { body } from 'express-validator';
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/validate',
  [
    body('code').trim().notEmpty().withMessage('Promo code is required'),
    body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal is required'),
  ],
  validate,
  validateCoupon
);

router.get('/', protect, adminOnly, listCoupons);
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('value').isFloat({ min: 0 }).withMessage('Value is required'),
  ],
  validate,
  createCoupon
);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
