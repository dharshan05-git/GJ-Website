import mongoose from 'mongoose';

/** Private consultation bookings submitted from the Contact page. */
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferredDate: { type: Date },
    message: { type: String, trim: true, maxlength: 2000, default: '' },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'SCHEDULED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    adminNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
