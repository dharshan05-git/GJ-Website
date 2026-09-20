import mongoose from 'mongoose';

/** Every automated email, so the admin panel can show delivery history. */
const emailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        'ORDER_CONFIRMATION',
        'ORDER_STATUS',
        'ADMIN_ORDER_ALERT',
        'CONTACT_ACK',
        'CUSTOM_REQUEST_ACK',
        'WELCOME',
        'TEST',
        'OTHER',
      ],
      default: 'OTHER',
      index: true,
    },
    status: { type: String, enum: ['SENT', 'FAILED', 'SKIPPED'], default: 'SENT', index: true },
    provider: { type: String, default: '' },
    messageId: { type: String, default: '' },
    /** Ethereal dev transport returns a browsable preview link. */
    previewUrl: { type: String, default: '' },
    error: { type: String, default: '' },
    relatedOrder: { type: String, default: '' },
  },
  { timestamps: true }
);

emailLogSchema.index({ createdAt: -1 });

export const EmailLog = mongoose.model('EmailLog', emailLogSchema);
