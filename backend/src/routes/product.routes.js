import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  setAvailability,
  updateProduct,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  createProduct
);

router.put('/:id', protect, adminOnly, updateProduct);
router.patch('/:id/availability', protect, adminOnly, setAvailability);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
