/**
 * Runs the API against a throwaway in-memory MongoDB, seeded with the full
 * catalog, the coupons and an owner account:
 *
 *   npm run dev:memory
 *
 * Handy for trying the site without installing MongoDB. Nothing is persisted —
 * every restart begins from the seed. Use `npm run dev` for the real database.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { env } from '../config/env.js';
import { Coupon } from '../models/Coupon.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { User } from '../models/User.js';

const { PRODUCTS } = await import('../../../src/data/products.js');

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri('gevariya_dev'));

await Product.insertMany(
  PRODUCTS.map((product) => ({
    ...product,
    _id: product.id,
    stock: 25,
    isActive: true,
    isAvailable: true,
  }))
);

await Coupon.create([
  { code: 'GEVARIYA10', description: '10% off your first order', type: 'PERCENT', value: 10 },
  { code: 'SKYRA10', description: 'Legacy 10% welcome code', type: 'PERCENT', value: 10 },
  { code: 'BRIDAL500', description: '₹500 off bridal sets above ₹5,000', type: 'FLAT', value: 500, minSubtotal: 5000 },
]);

await User.create({
  name: env.admin.name,
  email: env.admin.email,
  password: env.admin.password,
  role: 'superadmin',
});

await Settings.get();

createApp().listen(env.port, () => {
  console.log(`\n💎 GEVARIYA JEWELS API (in-memory MongoDB) on http://localhost:${env.port}/api`);
  console.log(`   ${PRODUCTS.length} products seeded • owner: ${env.admin.email} / ${env.admin.password}`);
  console.log('   Data resets on every restart.\n');
});

const shutdown = async () => {
  await mongoose.disconnect();
  await mongo.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
