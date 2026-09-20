import { Router } from 'express';
import { body } from 'express-validator';
import {
  addToCart,
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post(
  '/items',
  [
    body('productId').trim().notEmpty().withMessage('productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  addToCart
);
router.put(
  '/items/:itemId',
  [body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more')],
  validate,
  updateCartItem
);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearCart);
router.post('/merge', mergeCart);

export default router;
