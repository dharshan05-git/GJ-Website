import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const num = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: num(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',

  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gevariya_jewels',

  jwtSecret: process.env.JWT_SECRET || 'gevariya_dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),

  admin: {
    name: process.env.ADMIN_NAME || 'Gevariya Admin',
    email: process.env.ADMIN_EMAIL || 'admin@gevariyajewels.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    get enabled() {
      return Boolean(this.keyId && this.keySecret);
    },
  },

  store: {
    freeShippingThreshold: num(process.env.FREE_SHIPPING_THRESHOLD, 1500),
    shippingFee: num(process.env.SHIPPING_FEE, 0),
    currency: 'INR',
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: num(process.env.SMTP_PORT, 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'GEVARIYA JEWELS <no-reply@gevariyajewels.com>',
    adminAlert: process.env.ADMIN_ALERT_EMAIL || '',
    /** With no SMTP host, dev falls back to an Ethereal preview inbox. */
    get configured() {
      return Boolean(this.host && this.user && this.pass);
    },
  },

  /** Where the storefront lives — used for links inside emails. */
  siteUrl: process.env.SITE_URL || 'http://localhost:5173',
};

if (env.isProd && env.jwtSecret === 'gevariya_dev_secret_change_me') {
  throw new Error('JWT_SECRET must be set to a strong value in production.');
}
