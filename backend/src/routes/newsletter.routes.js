import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  listSubscribers,
  subscribe,
  unsubscribe,
} from '../controllers/newsletterController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const emailRule = [body('email').isEmail().withMessage('A valid email is required').normalizeEmail()];

router.post('/subscribe', limiter, emailRule, validate, subscribe);
router.post('/unsubscribe', limiter, emailRule, validate, unsubscribe);
router.get('/', protect, adminOnly, listSubscribers);

export default router;
