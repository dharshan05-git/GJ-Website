import { Subscriber } from '../models/Subscriber.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/newsletter/subscribe
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email).toLowerCase().trim();
  const source = req.body.source || 'footer';

  const existing = await Subscriber.findOne({ email });

  if (existing?.isSubscribed) {
    return res.json({ success: true, message: 'You are already on the Gevariya Circle list' });
  }

  if (existing) {
    existing.isSubscribed = true;
    existing.unsubscribedAt = undefined;
    await existing.save();
  } else {
    await Subscriber.create({ email, source });
  }

  res.status(201).json({
    success: true,
    message: 'Welcome to the Gevariya Circle — enjoy 10% off your first order with GEVARIYA10',
  });
});

// POST /api/newsletter/unsubscribe
export const unsubscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email).toLowerCase().trim();

  await Subscriber.findOneAndUpdate(
    { email },
    { isSubscribed: false, unsubscribedAt: new Date() }
  );

  res.json({ success: true, message: 'You have been unsubscribed' });
});

// GET /api/newsletter  (admin)
export const listSubscribers = asyncHandler(async (_req, res) => {
  const subscribers = await Subscriber.find({ isSubscribed: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: { subscribers, total: subscribers.length } });
});
