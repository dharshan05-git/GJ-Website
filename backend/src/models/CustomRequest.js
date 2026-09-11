import mongoose from 'mongoose';

/**
 * Bespoke ("Customise Your Creation") requests. Price is always quoted by the
 * atelier afterwards, so the request itself carries no client supplied amount.
 */
const customRequestSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    productName: { type: String, required: true, trim: true, maxlength: 60 },
    productType: {
      type: String,
      required: true,
      enum: ['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Bangle', 'Pendant', 'Mangalsutra', 'Other'],
    },
    metal: { type: String, default: '925 Sterling Silver' },
    plating: {
      type: String,
      required: true,
      enum: ['14K Gold', '18K Gold', '9K Gold', '925 Silver'],
    },
    ringSize: { type: String, default: '' },
    bangleSize: { type: String, default: '' },
    notes: { type: String, trim: true, maxlength: 400, default: '' },

    referenceImage: { type: String, default: '' },

    contactName: { type: String, trim: true, default: '' },
    contactEmail: { type: String, lowercase: true, trim: true, default: '' },
    contactPhone: { type: String, trim: true, default: '' },

    quotedPrice: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ['NEW', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED'],
      default: 'NEW',
      index: true,
    },
    adminNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

customRequestSchema.pre('validate', function assignReference(next) {
  if (!this.reference) {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    this.reference = `GJC-${stamp}-${random}`;
  }
  next();
});

export const CustomRequest = mongoose.model('CustomRequest', customRequestSchema);
