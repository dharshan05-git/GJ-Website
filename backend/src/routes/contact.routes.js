import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createContact,
  listContacts,
  updateContact,
} from '../controllers/contactController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.post(
  '/',
  formLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Please enter your name'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('phone').trim().isLength({ min: 6, max: 20 }).withMessage('A valid phone number is required'),
    body('preferredDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid date'),
    body('message').optional().trim().isLength({ max: 2000 }),
  ],
  validate,
  createContact
);

router.get('/', protect, adminOnly, listContacts);
router.put('/:id', protect, adminOnly, updateContact);

export default router;
