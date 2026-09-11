/**
 * End-to-end smoke test against an in-memory MongoDB.
 * No local mongod, no .env and no network needed:
 *
 *   npm run test:smoke
 *
 * Covers the whole storefront journey (catalog → cart → coupon → order →
 * payment config) plus the admin panel surface (availability switch,
 * maintenance mode, announcement, staff tiers, email automation).
 */
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'smoke-test-secret-key-not-for-production';

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri('gevariya_test'));

const { createApp } = await import('../app.js');
const { Product } = await import('../models/Product.js');
const { Coupon } = await import('../models/Coupon.js');
const { User } = await import('../models/User.js');
const { EmailLog } = await import('../models/EmailLog.js');

const app = createApp();
const api = request(app);

let passed = 0;
let failed = 0;

const test = async (name, fn) => {
  try {
    await fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ✗ ${name}\n      ${error.message}`);
  }
};

const section = (title) => console.log(`\n${title}`);

/* ── Fixtures ─────────────────────────────────────────────────── */
await Product.create([
  {
    _id: 'test-halo-pendant',
    name: 'Halo Diamond Pendant',
    category: 'NECKLACES',
    subCategory: 'PENDANTS',
    price: 1950,
    originalPrice: 2500,
    rating: 4.9,
    stock: 10,
    metals: ['18K Yellow Gold'],
    sizes: ['16-18 Inch Adjustable'],
    image: 'https://example.com/pendant.jpg',
  },
  {
    _id: 'test-bridal-set',
    name: 'Grand Bridal Suite',
    category: 'SETS',
    price: 5850,
    stock: 3,
    piecesIncluded: ['Choker', 'Earrings', 'Ring'],
    image: 'https://example.com/set.jpg',
  },
]);

await Coupon.create({ code: 'GEVARIYA10', type: 'PERCENT', value: 10, description: '10% off' });

const owner = await User.create({
  name: 'Owner',
  email: 'owner@gevariyajewels.com',
  password: 'Owner@12345',
  role: 'superadmin',
});

const shippingAddress = {
  fullName: 'Aarav Shah',
  email: 'aarav@example.com',
  phone: '9876543210',
  line1: '12 Turner Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400050',
};

let ownerToken = '';
let customerToken = '';
let orderNumber = '';
let staffId = '';

/* ── Catalog ──────────────────────────────────────────────────── */
section('Catalog');

await test('GET /api/products lists the catalog', async () => {
  const res = await api.get('/api/products').expect(200);
  assert.equal(res.body.data.products.length, 2);
  assert.equal(res.body.data.pagination.total, 2);
});

await test('filters by category and search', async () => {
  const byCategory = await api.get('/api/products?category=SETS').expect(200);
  assert.equal(byCategory.body.data.products.length, 1);

  const bySearch = await api.get('/api/products?search=halo').expect(200);
  assert.equal(bySearch.body.data.products[0].id, 'test-halo-pendant');
});

await test('sorts by price', async () => {
  const res = await api.get('/api/products?sort=price-asc').expect(200);
  assert.equal(res.body.data.products[0].price, 1950);
});

await test('GET /api/products/:id returns the piece and related items', async () => {
  const res = await api.get('/api/products/test-halo-pendant').expect(200);
  assert.equal(res.body.data.product.name, 'Halo Diamond Pendant');
  assert.ok(Array.isArray(res.body.data.related));
});

await test('unknown product is a 404', async () => {
  await api.get('/api/products/does-not-exist').expect(404);
});

/* ── Auth ─────────────────────────────────────────────────────── */
section('Auth & accounts');

await test('registers a customer and returns a token', async () => {
  const res = await api
    .post('/api/auth/register')
    .send({ name: 'Aarav Shah', email: 'aarav@example.com', password: 'Secret123', phone: '9876543210' })
    .expect(201);

  customerToken = res.body.data.token;
  assert.equal(res.body.data.user.role, 'user');
  assert.equal(res.body.data.user.isStaff, false);
});

await test('rejects a weak password', async () => {
  const res = await api
    .post('/api/auth/register')
    .send({ name: 'Weak', email: 'weak@example.com', password: 'short' })
    .expect(400);
  assert.equal(res.body.success, false);
});

await test('rejects a duplicate email', async () => {
  await api
    .post('/api/auth/register')
    .send({ name: 'Aarav', email: 'aarav@example.com', password: 'Secret123' })
    .expect(409);
});

await test('signs the owner in', async () => {
  const res = await api
    .post('/api/auth/login')
    .send({ email: 'owner@gevariyajewels.com', password: 'Owner@12345' })
    .expect(200);

  ownerToken = res.body.data.token;
  assert.equal(res.body.data.user.role, 'superadmin');
  assert.ok(res.body.data.user.permissions.includes('settings:write'));
});

await test('rejects a wrong password', async () => {
  await api
    .post('/api/auth/login')
    .send({ email: 'owner@gevariyajewels.com', password: 'wrong' })
    .expect(401);
});

await test('GET /api/auth/me needs a token', async () => {
  await api.get('/api/auth/me').expect(401);
  await api.get('/api/auth/me').set('Authorization', `Bearer ${customerToken}`).expect(200);
});

/* ── Cart & wishlist ──────────────────────────────────────────── */
section('Cart & wishlist');

await test('adds to the cart at the server price', async () => {
  const res = await api
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ productId: 'test-halo-pendant', metal: '18K Yellow Gold', size: '16-18 Inch Adjustable', quantity: 2 })
    .expect(201);

  assert.equal(res.body.data.cart.count, 2);
  assert.equal(res.body.data.cart.subtotal, 3900);
  assert.equal(res.body.data.cart.shipping, 0); // above the free shipping threshold
});

await test('a tampered client price is ignored', async () => {
  const res = await api
    .post('/api/cart/items')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ productId: 'test-bridal-set', price: 1, quantity: 1 })
    .expect(201);

  const item = res.body.data.cart.items.find((i) => i.product === 'test-bridal-set');
  assert.equal(item.price, 5850);
});

await test('toggles the wishlist', async () => {
  const added = await api
    .post('/api/wishlist/test-halo-pendant')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(200);
  assert.equal(added.body.data.added, true);

  const removed = await api
    .post('/api/wishlist/test-halo-pendant')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(200);
  assert.equal(removed.body.data.added, false);
});

/* ── Coupons & orders ─────────────────────────────────────────── */
section('Coupons & orders');

await test('validates a promo code', async () => {
  const res = await api.post('/api/coupons/validate').send({ code: 'GEVARIYA10', subtotal: 3900 }).expect(200);
  assert.equal(res.body.data.discount, 390);
});

await test('rejects an unknown promo code', async () => {
  await api.post('/api/coupons/validate').send({ code: 'NOPE', subtotal: 1000 }).expect(400);
});

await test('quotes an order without creating one', async () => {
  const res = await api
    .post('/api/orders/quote')
    .send({ items: [{ productId: 'test-halo-pendant', quantity: 2 }], couponCode: 'GEVARIYA10' })
    .expect(200);

  assert.equal(res.body.data.subtotal, 3900);
  assert.equal(res.body.data.discount, 390);
  assert.equal(res.body.data.total, 3510);
});

await test('places a guest order and prices it server-side', async () => {
  const res = await api
    .post('/api/orders')
    .send({
      items: [{ productId: 'test-halo-pendant', quantity: 2, price: 1 }],
      shippingAddress,
      couponCode: 'GEVARIYA10',
      paymentMethod: 'COD',
    })
    .expect(201);

  orderNumber = res.body.data.order.orderNumber;
  assert.equal(res.body.data.order.total, 3510);
  assert.equal(res.body.data.order.status, 'CONFIRMED');
  assert.ok(orderNumber.startsWith('GJ-'));
});

await test('reserves stock', async () => {
  const product = await Product.findById('test-halo-pendant');
  assert.equal(product.stock, 8);
});

await test('rejects an order with a missing address', async () => {
  const res = await api
    .post('/api/orders')
    .send({ items: [{ productId: 'test-halo-pendant', quantity: 1 }], shippingAddress: { fullName: 'X' } })
    .expect(400);
  assert.ok(res.body.errors.length > 0);
});

await test('rejects an order above available stock', async () => {
  await api
    .post('/api/orders')
    .send({ items: [{ productId: 'test-bridal-set', quantity: 99 }], shippingAddress })
    .expect(400);
});

await test('a guest can track an order with the checkout email', async () => {
  await api.get(`/api/orders/${orderNumber}`).expect(403);
  await api.get(`/api/orders/${orderNumber}?email=aarav@example.com`).expect(200);
});

await test('records the customer in the directory', async () => {
  const res = await api
    .get('/api/admin/customers')
    .set('Authorization', `Bearer ${ownerToken}`)
    .expect(200);

  const customer = res.body.data.customers.find((c) => c.email === 'aarav@example.com');
  assert.equal(customer.ordersCount, 1);
  assert.equal(customer.totalSpent, 3510);
  assert.equal(customer.addresses[0].city, 'Mumbai');
});

/* ── Forms ────────────────────────────────────────────────────── */
section('Forms');

await test('accepts a consultation booking', async () => {
  await api
    .post('/api/contact')
    .send({ name: 'Ishita', email: 'ishita@example.com', phone: '9812345678', message: 'Bridal set enquiry' })
    .expect(201);
});

await test('rejects an invalid consultation email', async () => {
  await api.post('/api/contact').send({ name: 'Ishita', email: 'nope', phone: '9812345678' }).expect(400);
});

await test('subscribes to the newsletter and is idempotent', async () => {
  await api.post('/api/newsletter/subscribe').send({ email: 'circle@example.com' }).expect(201);
  const again = await api.post('/api/newsletter/subscribe').send({ email: 'circle@example.com' }).expect(200);
  assert.match(again.body.message, /already/i);
});

await test('accepts a bespoke request', async () => {
  const res = await api
    .post('/api/custom-requests')
    .field('productName', 'Royal Emerald Crown Ring')
    .field('productType', 'Ring')
    .field('plating', '18K Gold')
    .field('ringSize', '7 (46.68 mm)')
    .field('contactEmail', 'aarav@example.com')
    .expect(201);

  assert.ok(res.body.data.request.reference.startsWith('GJC-'));
});

/* ── Admin panel ──────────────────────────────────────────────── */
section('Admin panel');

await test('blocks staff routes without a token', async () => {
  await api.get('/api/admin/stats').expect(401);
});

await test('blocks staff routes for a customer', async () => {
  await api.get('/api/admin/stats').set('Authorization', `Bearer ${customerToken}`).expect(403);
});

await test('returns dashboard stats', async () => {
  const res = await api.get('/api/admin/stats').set('Authorization', `Bearer ${ownerToken}`).expect(200);
  assert.equal(res.body.data.orders, 1);
  assert.equal(res.body.data.revenue, 3510);
  assert.equal(res.body.data.newEnquiries, 1);
});

await test('the enable/disable switch takes a product off sale', async () => {
  await api
    .patch('/api/admin/products/test-bridal-set/availability')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ isAvailable: false, note: 'SOLD OUT — RESTOCKING' })
    .expect(200);

  const listed = await api.get('/api/products').expect(200);
  const set = listed.body.data.products.find((p) => p.id === 'test-bridal-set');
  assert.equal(set.isAvailable, false, 'disabled product stays visible in the catalog');
  assert.equal(set.availabilityLabel, 'SOLD OUT — RESTOCKING');
  assert.equal(set.isPurchasable, false);

  const blocked = await api
    .post('/api/orders')
    .send({ items: [{ productId: 'test-bridal-set', quantity: 1 }], shippingAddress })
    .expect(400);
  assert.match(blocked.body.message, /unavailable/i);
});

await test('re-enabling puts it back on sale', async () => {
  await api
    .patch('/api/admin/products/test-bridal-set/availability')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ isAvailable: true, note: '' })
    .expect(200);

  const res = await api.get('/api/products/test-bridal-set').expect(200);
  assert.equal(res.body.data.product.isPurchasable, true);
});

await test('updates an order status and keeps history', async () => {
  const list = await api.get('/api/admin/orders').set('Authorization', `Bearer ${ownerToken}`).expect(200);
  const id = list.body.data.orders[0]._id;

  const res = await api
    .put(`/api/admin/orders/${id}/status`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ status: 'SHIPPED', note: 'Dispatched via Blue Dart', notifyCustomer: false })
    .expect(200);

  assert.equal(res.body.data.order.status, 'SHIPPED');
  assert.ok(res.body.data.order.statusHistory.some((entry) => entry.status === 'SHIPPED'));
});

/* ── Staff tiers ──────────────────────────────────────────────── */
section('Staff tiers & permissions');

await test('the owner can add a manager', async () => {
  const res = await api
    .post('/api/admin/staff')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ name: 'Store Manager', email: 'manager@gevariyajewels.com', password: 'Manager@123', role: 'manager' })
    .expect(201);

  staffId = res.body.data.user.id;
  assert.ok(res.body.data.user.permissions.includes('products:write'));
  assert.ok(!res.body.data.user.permissions.includes('settings:write'));
});

await test('a manager cannot toggle maintenance mode', async () => {
  const login = await api
    .post('/api/auth/login')
    .send({ email: 'manager@gevariyajewels.com', password: 'Manager@123' })
    .expect(200);

  await api
    .post('/api/admin/settings/maintenance')
    .set('Authorization', `Bearer ${login.body.data.token}`)
    .send({ enabled: true })
    .expect(403);
});

await test('granting one extra permission is enough', async () => {
  await api
    .put(`/api/admin/staff/${staffId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ extraPermissions: ['maintenance:toggle'] })
    .expect(200);

  const login = await api
    .post('/api/auth/login')
    .send({ email: 'manager@gevariyajewels.com', password: 'Manager@123' })
    .expect(200);

  await api
    .post('/api/admin/settings/maintenance')
    .set('Authorization', `Bearer ${login.body.data.token}`)
    .send({ enabled: false })
    .expect(200);
});

await test('an unknown permission is rejected', async () => {
  await api
    .put(`/api/admin/staff/${staffId}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ extraPermissions: ['everything:always'] })
    .expect(400);
});

/* ── Maintenance mode & announcement ──────────────────────────── */
section('Maintenance mode & announcement');

await test('publishes public settings for the storefront', async () => {
  const res = await api.get('/api/settings/public').expect(200);
  assert.equal(res.body.data.maintenance.enabled, false);
  assert.equal(typeof res.body.data.announcement.text, 'string');
});

await test('the announcement is editable without a deploy', async () => {
  await api
    .put('/api/admin/settings/announcement')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ enabled: true, text: 'DIWALI PREVIEW — 20% OFF BRIDAL SETS', tone: 'OFFER' })
    .expect(200);

  const res = await api.get('/api/settings/public').expect(200);
  assert.equal(res.body.data.announcement.text, 'DIWALI PREVIEW — 20% OFF BRIDAL SETS');
});

await test('maintenance mode closes the storefront with 503', async () => {
  await api
    .post('/api/admin/settings/maintenance')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ enabled: true, title: 'Website Under Construction', message: 'Please wait for a while.' })
    .expect(200);

  const res = await api.get('/api/products').expect(503);
  assert.equal(res.body.maintenance, true);
  assert.equal(res.body.data.title, 'Website Under Construction');

  // The page itself still loads its copy.
  await api.get('/api/settings/public').expect(200);
});

await test('staff keep working during maintenance', async () => {
  await api.get('/api/admin/stats').set('Authorization', `Bearer ${ownerToken}`).expect(200);
  await api.get('/api/products').set('Authorization', `Bearer ${ownerToken}`).expect(200);
});

await test('switching it off reopens the storefront', async () => {
  await api
    .post('/api/admin/settings/maintenance')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ enabled: false })
    .expect(200);

  await api.get('/api/products').expect(200);
});

/* ── Email automation ─────────────────────────────────────────── */
section('Email automation');

await test('logs the order confirmation and the admin alert', async () => {
  // Emails are dispatched after the response; give them a moment.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const logs = await EmailLog.find({ relatedOrder: orderNumber });
  const types = logs.map((log) => log.type);
  assert.ok(types.includes('ORDER_CONFIRMATION'), 'customer confirmation queued');
  assert.ok(types.includes('ADMIN_ORDER_ALERT'), 'admin alert queued');
});

await test('exposes transport status to the panel', async () => {
  const res = await api.get('/api/admin/emails/status').set('Authorization', `Bearer ${ownerToken}`).expect(200);
  assert.ok(['SMTP', 'ETHEREAL_PREVIEW', 'DISABLED'].includes(res.body.data.mode));
});

await test('lists email logs', async () => {
  const res = await api.get('/api/admin/emails/logs').set('Authorization', `Bearer ${ownerToken}`).expect(200);
  assert.ok(res.body.data.logs.length > 0);
});

/* ── Payments ─────────────────────────────────────────────────── */
section('Payments');

await test('reports Razorpay configuration', async () => {
  const res = await api.get('/api/payments/config').expect(200);
  assert.equal(res.body.data.razorpayEnabled, false); // no keys in the test env
});

await test('refuses a Razorpay order without keys', async () => {
  const res = await api.post('/api/payments/razorpay/order').send({ orderNumber }).expect(400);
  assert.match(res.body.message, /not configured/i);
});

/* ── Misc ─────────────────────────────────────────────────────── */
section('Misc');

await test('health check responds', async () => {
  const res = await api.get('/health').expect(200);
  assert.equal(res.body.status, 'ok');
});

await test('unknown route is a 404', async () => {
  await api.get('/api/not-a-route').expect(404);
});

/* ── Teardown ─────────────────────────────────────────────────── */
console.log(`\n${'─'.repeat(52)}`);
console.log(`${passed} passed, ${failed} failed`);

await mongoose.disconnect();
await mongo.stop();
process.exit(failed === 0 ? 0 : 1);
