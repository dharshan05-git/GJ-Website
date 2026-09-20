import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendWelcome } from '../services/emailService.js';
import { signToken } from '../utils/token.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone = '' } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    success: true,
    message: 'Welcome to Gevariya Jewels',
    data: { user: user.toPublic(), token: signToken(user) },
  });

  sendWelcome(user).catch(() => {});
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) throw ApiError.forbidden('This account has been disabled');

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Signed in successfully',
    data: { user: user.toPublic(), token: signToken(user) },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toPublic() } });
});

// PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  await req.user.save();

  res.json({ success: true, message: 'Profile updated', data: { user: req.user.toPublic() } });
});

// PUT /api/auth/me/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated', data: { token: signToken(user) } });
});

// POST /api/auth/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const address = req.body;
  if (address.isDefault) req.user.addresses.forEach((a) => { a.isDefault = false; });
  if (req.user.addresses.length === 0) address.isDefault = true;

  req.user.addresses.push(address);
  await req.user.save();

  res.status(201).json({ success: true, data: { addresses: req.user.addresses } });
});

// DELETE /api/auth/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) throw ApiError.notFound('Address not found');

  address.deleteOne();
  await req.user.save();

  res.json({ success: true, data: { addresses: req.user.addresses } });
});
