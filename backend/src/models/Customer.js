import mongoose from 'mongoose';

/**
 * Customer directory keyed by email. Every order — guest or signed in — upserts
 * a record here, so the admin panel has one place with full customer details
 * and lifetime value even when the buyer never made an account.
 */
const customerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    addresses: [
      {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'India' },
        lastUsedAt: Date,
      },
    ],

    ordersCount: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    lastOrderAt: Date,
    firstOrderAt: Date,

    acceptsMarketing: { type: Boolean, default: false },
    tags: [String],
    adminNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

customerSchema.virtual('averageOrderValue').get(function averageOrderValue() {
  return this.ordersCount ? Math.round((this.totalSpent / this.ordersCount) * 100) / 100 : 0;
});

customerSchema.set('toJSON', { virtuals: true });

/** Called after every successful order. */
customerSchema.statics.recordOrder = async function recordOrder(order) {
  const address = order.shippingAddress;

  const customer = await this.findOneAndUpdate(
    { email: address.email.toLowerCase() },
    {
      $set: {
        name: address.fullName,
        phone: address.phone,
        lastOrderAt: order.createdAt || new Date(),
        ...(order.user ? { user: order.user } : {}),
      },
      $setOnInsert: { firstOrderAt: order.createdAt || new Date() },
      $inc: { ordersCount: 1, totalSpent: order.total },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const alreadyKnown = customer.addresses.some(
    (a) => a.line1 === address.line1 && a.postalCode === address.postalCode
  );

  if (alreadyKnown) {
    customer.addresses.forEach((a) => {
      if (a.line1 === address.line1 && a.postalCode === address.postalCode) a.lastUsedAt = new Date();
    });
  } else {
    customer.addresses.push({
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      lastUsedAt: new Date(),
    });
  }

  await customer.save();
  return customer;
};

export const Customer = mongoose.model('Customer', customerSchema);
