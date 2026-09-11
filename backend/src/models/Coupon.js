import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['PERCENT', 'FLAT'], default: 'PERCENT' },
    value: { type: Number, required: true, min: 0 },
    minSubtotal: { type: Number, min: 0, default: 0 },
    maxDiscount: { type: Number, min: 0, default: 0 },
    usageLimit: { type: Number, min: 0, default: 0 },
    usedCount: { type: Number, min: 0, default: 0 },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/** Returns null when the coupon can be applied, otherwise the reason it cannot. */
couponSchema.methods.reasonInvalidFor = function reasonInvalidFor(subtotal) {
  if (!this.isActive) return 'This code is no longer active';
  if (this.expiresAt && this.expiresAt < new Date()) return 'This code has expired';
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return 'This code has reached its usage limit';
  if (subtotal < this.minSubtotal) {
    return `This code needs a minimum bag value of ₹${this.minSubtotal.toLocaleString('en-IN')}`;
  }
  return null;
};

export const Coupon = mongoose.model('Coupon', couponSchema);
