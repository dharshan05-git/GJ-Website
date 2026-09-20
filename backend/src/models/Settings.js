import mongoose from 'mongoose';

/**
 * Singleton store configuration, editable from the admin panel without a deploy.
 * Always read through `Settings.get()`.
 */
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'store', unique: true, immutable: true },

    // ── Maintenance mode ────────────────────────────────────────────
    maintenance: {
      enabled: { type: Boolean, default: false },
      title: { type: String, trim: true, default: 'Website Under Construction' },
      message: {
        type: String,
        trim: true,
        default: 'Please wait for a while. Our atelier is polishing something beautiful.',
      },
      /** Visitors from these IPs bypass maintenance mode (e.g. the office). */
      allowedIps: [String],
      startedAt: Date,
      expectedBackAt: Date,
    },

    // ── Announcement (top bar + maintenance page) ───────────────────
    announcement: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        trim: true,
        default: 'COMPLIMENTARY INSURED SHIPPING ON ORDERS ABOVE ₹1,500',
      },
      link: { type: String, trim: true, default: '' },
      linkLabel: { type: String, trim: true, default: '' },
      tone: { type: String, enum: ['INFO', 'OFFER', 'LAUNCH', 'ALERT'], default: 'INFO' },
      startsAt: Date,
      endsAt: Date,
    },

    // ── Storefront copy / contact ───────────────────────────────────
    store: {
      name: { type: String, default: 'GEVARIYA JEWELS' },
      supportEmail: { type: String, default: 'hello@gevariyajewels.com' },
      supportPhone: { type: String, default: '+91 98765 43210' },
      address: {
        type: String,
        default: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
      },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },

    // ── Commerce rules ──────────────────────────────────────────────
    commerce: {
      freeShippingThreshold: { type: Number, default: 1500, min: 0 },
      shippingFee: { type: Number, default: 0, min: 0 },
      codEnabled: { type: Boolean, default: true },
      onlinePaymentEnabled: { type: Boolean, default: true },
      lowStockThreshold: { type: Number, default: 5, min: 0 },
    },

    // ── Email automation ────────────────────────────────────────────
    email: {
      orderConfirmationEnabled: { type: Boolean, default: true },
      adminNotificationEnabled: { type: Boolean, default: true },
      contactAckEnabled: { type: Boolean, default: true },
      customRequestAckEnabled: { type: Boolean, default: true },
      welcomeEmailEnabled: { type: Boolean, default: true },
      /** Where "new order" alerts go; falls back to the support email. */
      adminRecipients: [String],
      /** Safety valve so a misconfigured loop cannot burn the daily quota. */
      dailyLimit: { type: Number, default: 800, min: 0 },
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

/** Reads the singleton, creating it with defaults on first call. */
settingsSchema.statics.get = async function get() {
  const existing = await this.findOne({ key: 'store' });
  if (existing) return existing;
  return this.create({ key: 'store' });
};

export const Settings = mongoose.model('Settings', settingsSchema);
