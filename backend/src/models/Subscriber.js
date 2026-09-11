import mongoose from 'mongoose';

/** Newsletter list — "Join the Gevariya Circle" footer form. */
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    source: { type: String, trim: true, default: 'footer' },
    isSubscribed: { type: Boolean, default: true },
    unsubscribedAt: Date,
  },
  { timestamps: true }
);

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
