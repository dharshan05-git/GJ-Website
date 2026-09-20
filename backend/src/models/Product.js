import mongoose from 'mongoose';

/**
 * `_id` is the human readable slug the frontend catalog already uses
 * (e.g. "classic-solitaire-pendant"), so existing product links keep working.
 */
const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, uppercase: true, trim: true, index: true },
    subCategory: { type: String, uppercase: true, trim: true, default: '' },
    gender: { type: String, uppercase: true, trim: true, default: 'WOMEN' },

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: 0 },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewsCount: { type: Number, min: 0, default: 0 },

    badge: { type: String, trim: true, default: '' },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },

    /** Archived products disappear from the store completely (admin delete). */
    isActive: { type: Boolean, default: true },
    /**
     * The admin panel's enable/disable switch. A disabled product stays visible
     * in the catalog but renders as "Unavailable" and cannot be bought.
     */
    isAvailable: { type: Boolean, default: true },
    availabilityNote: { type: String, trim: true, default: '' },

    image: { type: String, default: '' },
    hoverImage: { type: String, default: '' },
    images: [String],

    description: { type: String, default: '' },
    metals: [String],
    sizes: [String],
    details: [String],
    piecesIncluded: [String],

    stock: { type: Number, min: 0, default: 25 },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true, // `isNew` is intentional — the frontend uses it
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ name: 'text', description: 'text', subCategory: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ isBestSeller: -1, rating: -1 });

productSchema.virtual('inStock').get(function inStock() {
  return this.stock > 0;
});

/** What the storefront shows: the switch OR the stock count can take a piece off sale. */
productSchema.virtual('isPurchasable').get(function isPurchasable() {
  return this.isActive && this.isAvailable && this.stock > 0;
});

productSchema.virtual('availabilityLabel').get(function availabilityLabel() {
  if (!this.isAvailable) return this.availabilityNote || 'UNAVAILABLE';
  if (this.stock <= 0) return 'OUT OF STOCK';
  return 'IN STOCK';
});

productSchema.virtual('discountPercent').get(function discountPercent() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

export const Product = mongoose.model('Product', productSchema);
