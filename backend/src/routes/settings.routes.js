import { Router } from 'express';
import { getPublicSettings } from '../controllers/settingsController.js';

const router = Router();

/**
 * Public storefront configuration. The React app calls this on boot to decide
 * whether to render the maintenance page and what the announcement bar says.
 * Admin writes live under /api/admin/settings.
 */
router.get('/', getPublicSettings);
router.get('/public', getPublicSettings);

export default router;
