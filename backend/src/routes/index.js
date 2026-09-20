import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import cartRoutes from './cart.routes.js';
import contactRoutes from './contact.routes.js';
import couponRoutes from './coupon.routes.js';
import customRequestRoutes from './customRequest.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import productRoutes from './product.routes.js';
import settingsRoutes from './settings.routes.js';
import wishlistRoutes from './wishlist.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'GEVARIYA JEWELS API',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/products',
      '/api/cart',
      '/api/wishlist',
      '/api/orders',
      '/api/coupons',
      '/api/payments',
      '/api/contact',
      '/api/newsletter',
      '/api/custom-requests',
      '/api/settings',
      '/api/admin',
    ],
  });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/payments', paymentRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/custom-requests', customRequestRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);

export default router;
