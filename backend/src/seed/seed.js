/**
 * Seeds MongoDB from the frontend catalog so both sides stay in sync.
 *
 *   npm run seed            # upsert products + coupons + admin account
 *   npm run seed:destroy    # wipe products, coupons, orders and carts
 *
 * Products are keyed by their slug, so re-running only updates existing rows.
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { User } from '../models/User.js';

// Single source of truth: the same file the React app renders from.
const { PRODUCTS } = await import('../../../src/data/products.js');

const COUPONS = [
  {
    code: 'GEVARIYA10',
    description: '10% off your first handcrafted order',
    type: 'PERCENT',
    value: 10,
    minSubtotal: 0,
    isActive: true,
  },
  {
    code: 'SKYRA10',
    description: 'Legacy 10% welcome code',
    type: 'PERCENT',
    value: 10,
    minSubtotal: 0,
    isActive: true,
  },
  {
    code: 'BRIDAL500',
    description: '₹500 off bridal sets above ₹5,000',
    type: 'FLAT',
    value: 500,
    minSubtotal: 5000,
    isActive: true,
  },
];

const toProductDoc = (product) => ({
  _id: product.id,
  name: product.name,
  category: product.category,
  subCategory: product.subCategory || '',
  gender: product.gender || 'WOMEN',
  price: product.price,
  originalPrice: product.originalPrice || 0,
  rating: product.rating || 0,
  reviewsCount: product.reviewsCount || 0,
  badge: product.badge || '',
  isBestSeller: Boolean(product.isBestSeller),
  isNew: Boolean(product.isNew),
  isActive: true,
  image: product.image || product.images?.[0] || '',
  hoverImage: product.hoverImage || '',
  images: product.images || [],
  description: product.description || '',
  metals: product.metals || [],
  sizes: product.sizes || [],
  details: product.details || [],
  piecesIncluded: product.piecesIncluded || [],
});

const seed = async () => {
  const operations = PRODUCTS.map((product) => {
    const doc = toProductDoc(product);
    return {
      updateOne: {
        filter: { _id: doc._id },
        // `stock` is left alone on re-seed so live inventory is not reset.
        update: { $set: doc, $setOnInsert: { stock: 25 } },
        upsert: true,
      },
    };
  });

  const result = await Product.bulkWrite(operations);
  console.log(`✅ Products: ${result.upsertedCount} added, ${result.modifiedCount} updated (${PRODUCTS.length} in catalog)`);

  for (const coupon of COUPONS) {
    await Coupon.updateOne({ code: coupon.code }, { $setOnInsert: coupon }, { upsert: true });
  }
  console.log(`✅ Coupons: ${COUPONS.map((c) => c.code).join(', ')}`);

  // The owner account: full permissions, and the only tier that can create staff.
  const existingAdmin = await User.findOne({ email: env.admin.email.toLowerCase() });
  if (existingAdmin) {
    if (existingAdmin.role !== 'superadmin') {
      existingAdmin.role = 'superadmin';
      await existingAdmin.save();
    }
    console.log(`ℹ️  Owner account already exists: ${existingAdmin.email}`);
  } else {
    await User.create({
      name: env.admin.name,
      email: env.admin.email,
      password: env.admin.password,
      role: 'superadmin',
    });
    console.log(`✅ Owner account created: ${env.admin.email} (password from ADMIN_PASSWORD in .env)`);
  }

  const settings = await Settings.get();
  console.log(
    `✅ Store settings ready (maintenance ${settings.maintenance.enabled ? 'ON' : 'OFF'}, announcement ${settings.announcement.enabled ? 'ON' : 'OFF'})`
  );
};

const destroy = async () => {
  await Promise.all([
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    Order.deleteMany({}),
    User.updateMany({}, { $set: { cart: [], wishlist: [] } }),
  ]);
  console.log('🗑️  Products, coupons and orders removed; carts and wishlists cleared.');
};

const run = async () => {
  await connectDB();
  try {
    if (process.argv.includes('--destroy')) await destroy();
    else await seed();
  } finally {
    await disconnectDB();
  }
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
