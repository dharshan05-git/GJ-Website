import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ALL_PERMISSIONS, ROLES, STAFF_ROLES, permissionsForRole } from '../config/roles.js';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: 'Home' },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true, required: true },
    country: { type: String, trim: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: String, ref: 'Product', required: true },
    name: String,
    image: String,
    price: { type: Number, required: true, min: 0 },
    metal: { type: String, default: '' },
    size: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true, default: '' },
    role: { type: String, enum: ROLES, default: 'user' },
    /** Grants on top of the role — "a little more access than the basic admin". */
    extraPermissions: [{ type: String, enum: ALL_PERMISSIONS }],
    /** Revokes something the role would otherwise allow. */
    deniedPermissions: [{ type: String, enum: ALL_PERMISSIONS }],

    addresses: [addressSchema],
    cart: [cartItemSchema],
    wishlist: [{ type: String, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** Role defaults + per-account grants − per-account denials. */
userSchema.methods.effectivePermissions = function effectivePermissions() {
  const granted = new Set([...permissionsForRole(this.role), ...(this.extraPermissions || [])]);
  (this.deniedPermissions || []).forEach((permission) => granted.delete(permission));
  return [...granted];
};

userSchema.methods.can = function can(permission) {
  return this.effectivePermissions().includes(permission);
};

userSchema.methods.isStaff = function isStaff() {
  return STAFF_ROLES.includes(this.role);
};

/** Shape sent to the client — never includes the password hash. */
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    isStaff: this.isStaff(),
    permissions: this.effectivePermissions(),
    addresses: this.addresses,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
