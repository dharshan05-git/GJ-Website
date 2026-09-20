# PHASE 0 — RECON: Architecture Map
# Gevariya Jewels — Pre-Production Security Audit
_Audit date: 2026-09-18 | Auditor: read-only static analysis_

## 1. Directory Tree (depth 3)

```
/ (repo root)
├── .env                    ← frontend env (VITE_API_URL only)
├── .env.example
├── .gitignore
├── index.html
├── vite.config.js
├── dist/                   ← production build COMMITTED TO REPO
├── src/                    ← React frontend
│   ├── App.jsx             ← router + admin mount point
│   ├── context/ShopContext.jsx
│   ├── data/products.js    ← 63 KB static fallback catalog
│   ├── pages/admin/        ← 11 admin pages
│   └── services/api.js     ← JWT stored in localStorage
└── backend/
    ├── .en                 ← REAL CREDENTIALS, NOT GITIGNORED (mis-named)
    ├── .env                ← real credentials (gitignored OK)
    ├── .env.example        ← REAL keys committed (rzp_test + re_ + Atlas URI)
    ├── server.js
    └── src/
        ├── app.js          ← Express factory
        ├── config/env.js   ← all env reads + dangerous fallback defaults
        ├── config/roles.js ← RBAC definitions
        ├── controllers/    ← 13 controllers
        ├── middleware/     ← auth / error / maintenance / upload / validate
        ├── models/         ← 10 Mongoose models
        ├── routes/         ← 13 route files
        ├── services/emailService.js
        └── utils/          ← ApiError / asyncHandler / pricing / token
```

## 2. Complete API Inventory

AUTH MIDDLEWARE KEY:
  protect        = requires valid Bearer JWT; blocks if user.isActive=false
  optionalAuth   = attaches user if token present, never blocks
  adminOnly      = role === 'superadmin' (must follow protect)
  superAdminOnly = same
  requirePerm(P) = user.can(P) RBAC check
  —              = no auth

### Webhook (raw body, before JSON parser — app.js:41)
POST /api/payments/razorpay/webhook | — | HMAC-SHA256 sig OR silently accepted if RAZORPAY_WEBHOOK_SECRET unset | YES Order

### Auth (/api/auth)
POST   /api/auth/register              | authLimiter(20/15m) | — | expr-validator name/email/pass | YES User
POST   /api/auth/login                 | authLimiter(20/15m) | — | expr-validator email/pass | NO (lastLoginAt)
GET    /api/auth/me                    | protect | any | — | NO
PUT    /api/auth/me                    | protect | any | name optional | YES User
PUT    /api/auth/me/password           | protect | any | currentPass/newPass | YES User
POST   /api/auth/addresses             | protect | any | line1/city/state/postal | YES User.addresses
DELETE /api/auth/addresses/:addressId  | protect | any | — | YES User.addresses

### Products (/api/products)
GET    /api/products                   | — | — | query params | NO
GET    /api/products/categories        | — | — | — | NO
GET    /api/products/:id               | — | — | — | NO
POST   /api/products                   | protect+adminOnly | superadmin | name/category/price | YES Product
PUT    /api/products/:id               | protect+adminOnly | superadmin | NONE | YES Product
PATCH  /api/products/:id/availability  | protect+adminOnly | superadmin | — | YES Product
DELETE /api/products/:id               | protect+adminOnly | superadmin | — | YES Product.isActive

### Cart (/api/cart) — all protect
GET    /api/cart                       | protect | any | — | NO
POST   /api/cart/items                 | protect | any | productId, qty>=1 | YES User.cart
PUT    /api/cart/items/:itemId         | protect | any | qty>=0 | YES User.cart
DELETE /api/cart/items/:itemId         | protect | any | — | YES User.cart
DELETE /api/cart                       | protect | any | — | YES User.cart
POST   /api/cart/merge                 | protect | any | — | YES User.cart

### Wishlist (/api/wishlist) — all protect
GET    /api/wishlist                   | protect | any | — | NO
POST   /api/wishlist/:productId        | protect | any | — | YES User.wishlist
DELETE /api/wishlist/:productId        | protect | any | — | YES User.wishlist

### Orders (/api/orders)
POST   /api/orders/quote               | optionalAuth | — | items array | NO
POST   /api/orders                     | optionalAuth | — | items/address/paymentMethod | YES Order+Product.stock+Coupon.usedCount
GET    /api/orders/my                  | protect | any | — | NO
GET    /api/orders/:orderNumber        | optionalAuth | — | ?email query ownership check | NO
PUT    /api/orders/:orderNumber/cancel | protect | any (owner or role=admin check in controller) | — | YES Order+Product.stock

### Coupons (/api/coupons)
POST   /api/coupons/validate           | — | — | code/subtotal | NO
GET    /api/coupons                    | protect+adminOnly | superadmin | — | NO
POST   /api/coupons                    | protect+adminOnly | superadmin | code/value | YES Coupon (FULL req.body MASS ASSIGNMENT)
PUT    /api/coupons/:id                | protect+adminOnly | superadmin | — | YES Coupon (full req.body)
DELETE /api/coupons/:id                | protect+adminOnly | superadmin | — | YES Coupon

### Payments (/api/payments)
GET    /api/payments/config            | — | — | — | NO
POST   /api/payments/razorpay/order    | optionalAuth | — | orderNumber | YES Order.payment.razorpayOrderId
POST   /api/payments/razorpay/verify   | optionalAuth | — | 3 razorpay fields | YES Order.paymentStatus+status

### Contact (/api/contact)
POST   /api/contact                    | formLimiter(10/hr) | — | name/email/phone | YES Contact
GET    /api/contact                    | protect+adminOnly | superadmin | — | NO
PUT    /api/contact/:id                | protect+adminOnly | superadmin | — | YES Contact

### Newsletter (/api/newsletter)
POST   /api/newsletter/subscribe       | limiter(20/hr) | — | email | YES Subscriber
POST   /api/newsletter/unsubscribe     | limiter(20/hr) | — | email | YES Subscriber
GET    /api/newsletter                 | protect+adminOnly | superadmin | — | NO

### Custom Requests (/api/custom-requests)
POST   /api/custom-requests            | limiter(15/hr) + optionalAuth | — | productName/type/plating + multer | YES CustomRequest
GET    /api/custom-requests/my         | protect | any | — | NO
GET    /api/custom-requests            | protect+adminOnly | superadmin | — | NO
GET    /api/custom-requests/:reference | — | — | NONE | NO  ← unauthenticated reference lookup
PUT    /api/custom-requests/:id        | protect+adminOnly | superadmin | — | YES CustomRequest

### Settings (/api/settings) — PUBLIC
GET    /api/settings                   | — | — | — | NO
GET    /api/settings/public            | — | — | — | NO

### Admin (/api/admin) — all protect+adminOnly (superadmin) minimum
GET    /api/admin/stats                | protect+adminOnly | superadmin | — (NO permission check) | NO
GET    /api/admin/products             | +requirePerm(products:read)  | — | NO
PATCH  /api/admin/products/:id/avail.  | +requirePerm(products:write) | — | YES
GET    /api/admin/orders               | +requirePerm(orders:read)    | — | NO
PUT    /api/admin/orders/:id/status    | +requirePerm(orders:write)   | — | YES
POST   /api/admin/orders/:n/resend-em. | +requirePerm(emails:send)    | — | NO
GET    /api/admin/customers            | +requirePerm(customers:read) | — | NO
GET    /api/admin/customers/:email     | +requirePerm(customers:read) | — | NO
PUT    /api/admin/customers/:email     | +requirePerm(customers:write)| — | YES
GET    /api/admin/users                | +requirePerm(users:manage)   | — | NO
PUT    /api/admin/users/:id/status     | +requirePerm(users:manage)   | — | YES
GET    /api/admin/staff                | superAdminOnly | — | NO
POST   /api/admin/staff                | superAdminOnly | — | YES User
PUT    /api/admin/staff/:id            | superAdminOnly | — | YES User
GET    /api/admin/emails/logs          | +requirePerm(emails:read)    | — | NO
GET    /api/admin/emails/status        | +requirePerm(emails:read)    | — | NO
POST   /api/admin/emails/test          | +requirePerm(emails:send)    | — | NO
GET    /api/admin/settings             | +requirePerm(settings:read)  | — | NO
PUT    /api/admin/settings             | +requirePerm(settings:write) | — | YES
POST   /api/admin/settings/maintenance | +requirePerm(maintenance:toggle) | YES
PUT    /api/admin/settings/announcement| +requirePerm(settings:write) | — | YES

### Health / Static
GET    /health                         | — | — | returns {uptime, env: NODE_ENV} | NO
GET    /uploads/*                      | — | — | static file serve, 7d cache | NO

## 3. Mongoose Models Summary

### User (User.js)
Fields: _id(ObjId), name(req), email(unique,req), password(select:false,bcrypt-12),
        phone, role(enum user/staff/manager/admin/superadmin default user),
        extraPermissions[], deniedPermissions[], addresses[], cart[], wishlist[],
        isActive(bool), lastLoginAt
Indexes: email unique

### Order (Order.js)
Fields: orderNumber(unique), user(ObjId nullable), isGuest, items[],
        shippingAddress(embedded), couponCode, subtotal, discount, shipping,
        total, currency, paymentMethod(COD/RAZORPAY), paymentStatus(PENDING/PAID/FAILED/REFUNDED),
        payment.razorpayOrderId, payment.razorpayPaymentId(NO UNIQUE INDEX), payment.razorpaySignature,
        payment.paidAt, status(enum, index), statusHistory[]
Indexes: orderNumber unique, status index

### Product (Product.js)
Fields: _id(String slug, PK), name, category(index), price, stock(min 0, default 25),
        isActive, isAvailable, image, description, metals[], sizes[]
Indexes: text(name,description,subCategory), price, isBestSeller+rating

### Coupon (Coupon.js)
Fields: code(unique), type(PERCENT/FLAT), value, minSubtotal, maxDiscount(0=no cap),
        usageLimit(0=unlimited), usedCount, expiresAt, isActive
Indexes: code unique

### Customer (Customer.js) — keyed by email, upserted on every order
Fields: email(unique), name, phone, user(ObjId ref), addresses[], ordersCount,
        totalSpent, lastOrderAt, firstOrderAt, acceptsMarketing, tags[], adminNote
Indexes: email unique+index

### Settings (Settings.js) — singleton (key='store')
Sections: maintenance, announcement, store, commerce, email
Indexes: key unique+immutable

### Other models: Contact, CustomRequest(reference unique), EmailLog(createdAt index),
                  Subscriber(email unique)

## 4. Middleware Chain (app.js registration order)

1.  trust proxy = 1
2.  helmet (crossOriginResourcePolicy: cross-origin)
3.  cors (whitelist origin fn, credentials: true) — no-origin requests PASS THROUGH
4.  morgan dev (dev only)
5.  POST /api/payments/razorpay/webhook → express.raw → razorpayWebhook
    (RAW BODY BEFORE JSON PARSER — correct for Razorpay signature)
6.  express.json limit 1mb
7.  express.urlencoded limit 1mb
8.  rateLimit global: 600 req / 15 min (windowMs=15*60*1000, max=600)
9.  static /uploads (7d maxAge)
10. GET /health
11. /api → optionalAuth → maintenanceGate → routes
    (routes have their own per-endpoint limiters for auth/contact/newsletter/custom-requests)
12. notFound handler
13. errorHandler

NOT PRESENT: express-mongo-sanitize, hpp, request timeout, response-time

## 5. Third-Party Integrations

| Service      | Purpose               | Credential source                              |
|-------------|----------------------|------------------------------------------------|
| MongoDB Atlas| Primary DB            | env.mongoUri ← MONGO_URI                       |
| Razorpay     | Payments              | env.razorpay.keyId/keySecret ← RAZORPAY_KEY_* |
|              | Webhook               | process.env.RAZORPAY_WEBHOOK_SECRET (direct)  |
| Resend       | Transactional email   | env.mail.resendApiKey ← RESEND_API_KEY         |
| nodemailer   | SMTP fallback         | env.mail.host/user/pass ← SMTP_*              |
| Ethereal     | Dev email preview     | auto-created when no transport configured      |

Razorpay KEY_ID (publishable) exposed client-side via GET /api/payments/config — by design, correct.
Razorpay KEY_SECRET stays server-only — correct.

## 6. Frontend API Base URL

api.js:16  const BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:5000/api')
- Configured by VITE_API_URL (baked into bundle at build time, not a runtime secret)
- Fallback: localhost:5000 (dev only)
- JWT stored in localStorage (key: gj_token) — XSS blast radius = full account takeover

## 7. Notable Files in Git / Repo

| File | Status | Issue |
|------|--------|-------|
| backend/.env.example | Committed, HEAD | Contains real Razorpay test keys + Resend API key |
| backend/.en | Committed, NOT gitignored | Real MongoDB Atlas URI with credentials |
| dist/ | Committed | Built JS with VITE_API_URL baked in |
| backend/.env | Gitignored | OK — real runtime secrets |

## 8. Preliminary Observations for Later Phases

1. backend/.env.example has REAL Razorpay test key (rzp_test_TcFGUBtYGa81ot) and Resend key (re_4XTDFWW4_...) in current HEAD and ALL git history
2. backend/.en is a real credential file NOT covered by .gitignore (contains MongoDB Atlas URI)
3. RAZORPAY_WEBHOOK_SECRET read via process.env directly (not env.js); if unset, webhook is accepted silently
4. No express-mongo-sanitize — operator injection possible
5. payment.razorpayPaymentId has NO unique index — duplicate capture risk
6. Stock decrement is NOT atomic: resolveItems reads stock THEN $inc (race on last unit)
7. JWT in localStorage — XSS = full account takeover
8. Global rate limit 600/15min is high; payment/order endpoints have no per-IP limit
9. CORS allows requests with no Origin header (curl/server-to-server) without restriction
10. GET /api/custom-requests/:reference — public, unauthenticated reference lookup
11. Coupon.create(req.body) — full mass assignment (couponController.js:42)
12. env.js:32 ADMIN_PASSWORD fallback = 'Admin@12345' hardcoded
13. env.js:21 JWT_SECRET fallback weak string (only throws in prod)
14. getOrder (orderController.js:171) isAdmin check uses role==='admin' not 'superadmin' — inconsistent
15. adminOnly checks superadmin, meaning staff/manager/admin roles cannot access /api/admin at all; permission system for lower staff roles applies only to storefront product/coupon/contact routes
