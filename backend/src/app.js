import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { optionalAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error.js';
import { maintenanceGate } from './middleware/maintenance.js';
import { UPLOAD_DIR } from './middleware/upload.js';
import { razorpayWebhook } from './controllers/paymentController.js';
import routes from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      // Product and upload images are served to a separate frontend origin.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin, curl and server-to-server requests have no Origin header.
        if (!origin) return callback(null, true);
        if (env.clientUrls.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    })
  );

  if (!env.isProd) app.use(morgan('dev'));

  // Razorpay signs the raw body, so this route is mounted before the JSON parser.
  app.post(
    '/api/payments/razorpay/webhook',
    express.raw({ type: 'application/json' }),
    razorpayWebhook
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 600,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please slow down.' },
    })
  );

  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

  app.get('/health', (_req, res) =>
    res.json({ success: true, status: 'ok', uptime: process.uptime(), env: env.nodeEnv })
  );

  // Identify staff first, so maintenance mode never locks the team out.
  app.use('/api', optionalAuth, maintenanceGate, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
