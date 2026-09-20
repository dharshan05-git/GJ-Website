import { Router } from 'express';
import { body } from 'express-validator';
import {
  createRazorpayOrder,
  getPaymentConfig,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/config', getPaymentConfig);

router.post(
  '/razorpay/order',
  optionalAuth,
  [body('orderNumber').trim().notEmpty().withMessage('orderNumber is required')],
  validate,
  createRazorpayOrder
);

router.post(
  '/razorpay/verify',
  optionalAuth,
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty(),
  ],
  validate,
  verifyRazorpayPayment
);

export default router;
