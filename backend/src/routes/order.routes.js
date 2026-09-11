import { Router } from 'express';
import { body } from 'express-validator';
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrder,
  quoteOrder,
} from '../controllers/orderController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addressRules = [
  body('items').isArray({ min: 1 }).withMessage('Your bag is empty'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.email').isEmail().withMessage('A valid email is required'),
  body('shippingAddress.phone').trim().isLength({ min: 6 }).withMessage('A valid phone number is required'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('PIN code is required'),
  body('paymentMethod').optional().isIn(['COD', 'RAZORPAY']).withMessage('Unsupported payment method'),
];

router.post('/quote', optionalAuth, quoteOrder);
router.post('/', optionalAuth, addressRules, validate, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:orderNumber', optionalAuth, getOrder);
router.put('/:orderNumber/cancel', protect, cancelOrder);

export default router;
