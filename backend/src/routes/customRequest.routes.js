import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createCustomRequest,
  getCustomRequest,
  getMyCustomRequests,
  listCustomRequests,
  updateCustomRequest,
} from '../controllers/customRequestController.js';
import { adminOnly, optionalAuth, protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false });

router.post(
  '/',
  limiter,
  optionalAuth,
  uploadImage.single('image'),
  [
    body('productName').trim().isLength({ min: 2, max: 60 }).withMessage('Product name is required'),
    body('productType')
      .isIn(['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Bangle', 'Pendant', 'Mangalsutra', 'Other'])
      .withMessage('Please select a jewellery type'),
    body('plating')
      .isIn(['14K Gold', '18K Gold', '9K Gold', '925 Silver'])
      .withMessage('Please choose a metal plating'),
    body('contactEmail').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email'),
    body('notes').optional().trim().isLength({ max: 400 }),
  ],
  validate,
  createCustomRequest
);

router.get('/my', protect, getMyCustomRequests);
router.get('/', protect, adminOnly, listCustomRequests);
router.get('/:reference', getCustomRequest);
router.put('/:id', protect, adminOnly, updateCustomRequest);

export default router;
