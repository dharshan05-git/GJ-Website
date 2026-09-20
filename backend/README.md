# GEVARIYA JEWELS — Backend API

Node.js + Express + MongoDB REST API for the Gevariya Jewels storefront: catalog,
accounts, cart, orders, Razorpay payments, email automation and a full admin
surface (staff tiers, product on/off switch, maintenance mode, announcements).

The React app in `../src` talks to it through `../src/services/api.js`.

---

## Quick start

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI + JWT_SECRET
npm run seed              # 57 products, coupons, owner account, default settings
npm run dev               # http://localhost:5000/api
```

Then, in the repo root, run the frontend:

```bash
npm install
npm run dev               # http://localhost:5173
```

### No MongoDB installed?

```bash
npm run dev:memory
```

Boots the API against a throwaway in-memory MongoDB, seeded with the whole
catalog. Nothing persists — every restart starts fresh. Good for trying things
out; use `npm run dev` with a real database for actual work.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | API with auto-restart on file changes |
| `npm start` | Production start |
| `npm run dev:memory` | API + throwaway in-memory MongoDB, pre-seeded |
| `npm run seed` | Upsert catalog, coupons, owner account, settings |
| `npm run seed:destroy` | Wipe products, coupons and orders |
| `npm run test:smoke` | 49-check end-to-end test, no database needed |

---

## Environment

Everything lives in `backend/.env` — see `.env.example`. The essentials:

| Variable | Notes |
| --- | --- |
| `MONGO_URI` | Local `mongodb://127.0.0.1:27017/gevariya_jewels` or an Atlas SRV string |
| `JWT_SECRET` | Long random string. The server refuses to boot in production with the default |
| `CLIENT_URL` | Comma-separated allowed origins for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The owner (`superadmin`) account created by `npm run seed` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Leave blank to run COD-only |
| `SMTP_*` | Leave blank in dev — emails go to an Ethereal preview inbox |

`.env` is gitignored. Never commit real keys.

---

## Data model

| Collection | Holds |
| --- | --- |
| `products` | Catalog. `_id` is the slug the frontend already used (`classic-solitaire-pendant`) |
| `users` | Customers and staff. Password hashed with bcrypt, cart and wishlist per account |
| `customers` | Customer directory keyed by email — guests included, with lifetime value |
| `orders` | Immutable line items priced by the server, status history, payment record |
| `customrequests` | Bespoke ("Customise") briefs with the uploaded reference photo |
| `contacts` | Private-consultation bookings |
| `subscribers` | Newsletter list |
| `coupons` | Promo codes and their rules |
| `settings` | Singleton: maintenance mode, announcement, store info, commerce rules, email toggles |
| `emaillogs` | Every automated email, with its preview link and delivery status |

---

## API reference

Base URL: `http://localhost:5000/api`

Responses are always `{ success, message?, data? }`. Errors add `errors[]` for
field-level validation problems. Authentication is a bearer token:
`Authorization: Bearer <token>`.

### Storefront settings — `/settings`

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/settings/public` | Maintenance state, announcement, store info, shipping rules. The React app calls this on boot |

While maintenance mode is on, every other public route answers **503** with
`{ maintenance: true, data: { title, body, announcement } }`. Staff tokens and
allow-listed IPs pass through as normal.

### Products — `/products`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/products` | — | `category`, `subCategory`, `gender`, `search`, `minPrice`, `maxPrice`, `badge`, `bestSeller`, `isNew`, `available`, `sort`, `page`, `limit` |
| GET | `/products/categories` | — | Counts and starting price per category |
| GET | `/products/:id` | — | Single product plus 4 related pieces |
| POST | `/products` | admin | Create |
| PUT | `/products/:id` | admin | Update |
| PATCH | `/products/:id/availability` | admin | The on/off switch |
| DELETE | `/products/:id` | admin | Archive (soft delete, so old orders stay readable) |

`sort`: `featured` (default), `newest`, `price-asc`, `price-desc`, `rating`, `name`.

Each product carries `isPurchasable` and `availabilityLabel` so the storefront
can render a disabled piece as *Unavailable* rather than hiding it.

### Auth — `/auth`

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/auth/me` | user |
| PUT | `/auth/me` | user |
| PUT | `/auth/me/password` | user |
| POST | `/auth/addresses` | user |
| DELETE | `/auth/addresses/:addressId` | user |

Login and register are rate limited to 20 attempts per 15 minutes per IP.

### Cart & wishlist — `/cart`, `/wishlist` (signed in)

`GET /cart` · `POST /cart/items` · `PUT /cart/items/:itemId` ·
`DELETE /cart/items/:itemId` · `DELETE /cart` · `POST /cart/merge`
(folds a guest's local bag into the account bag at sign-in).

`GET /wishlist` · `POST /wishlist/:productId` (toggle) · `DELETE /wishlist/:productId`.

Prices always come from the database — a client-supplied `price` is ignored.

### Orders — `/orders`

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/orders/quote` | optional | Server-priced preview; no order is created |
| POST | `/orders` | optional | Place an order (guest or signed in) |
| GET | `/orders/my` | user | Order history |
| GET | `/orders/:orderNumber` | optional | Owner/admin directly; guests add `?email=` used at checkout |
| PUT | `/orders/:orderNumber/cancel` | user | Restores the reserved stock |

```jsonc
// POST /orders
{
  "items": [
    { "productId": "halo-diamond-necklace", "metal": "18K Yellow Gold", "size": "16-18 Inch Adjustable", "quantity": 1 },
    { "customRequest": "GJC-MTX1A2-B3C" }        // bespoke piece, quoted by the atelier
  ],
  "shippingAddress": {
    "fullName": "Aarav Shah", "email": "aarav@example.com", "phone": "9876543210",
    "line1": "12 Turner Road", "line2": "", "city": "Mumbai",
    "state": "Maharashtra", "postalCode": "400050", "country": "India"
  },
  "couponCode": "GEVARIYA10",
  "paymentMethod": "COD",                          // or "RAZORPAY"
  "notes": ""
}
```

Placing an order reserves stock, records the customer, emails the buyer their
invoice and alerts the store — all server side.

### Coupons — `/coupons`

`POST /coupons/validate` (public, `{ code, subtotal }`) and admin CRUD.
Seeded codes: `GEVARIYA10`, `SKYRA10` (10%), `BRIDAL500` (₹500 off above ₹5,000).

### Payments — `/payments`

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/payments/config` | Whether Razorpay is configured, plus the publishable key |
| POST | `/payments/razorpay/order` | `{ orderNumber }` — the amount comes from the stored order |
| POST | `/payments/razorpay/verify` | HMAC signature check, compared in constant time |
| POST | `/payments/razorpay/webhook` | Optional; needs `RAZORPAY_WEBHOOK_SECRET` |

### Forms

`POST /contact` (consultation booking) · `POST /newsletter/subscribe` ·
`POST /newsletter/unsubscribe` · `POST /custom-requests` (multipart, field
`image`, ≤5MB) · `GET /custom-requests/:reference` · `GET /custom-requests/my`.

---

## Admin API — `/admin` (staff only)

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/admin/stats` | any staff |
| GET | `/admin/products` | `products:read` |
| PATCH | `/admin/products/:id/availability` | `products:write` |
| GET | `/admin/orders` | `orders:read` |
| PUT | `/admin/orders/:id/status` | `orders:write` |
| POST | `/admin/orders/:orderNumber/resend-email` | `emails:send` |
| GET | `/admin/customers` | `customers:read` |
| GET | `/admin/customers/:email` | `customers:read` |
| PUT | `/admin/customers/:email` | `customers:write` |
| GET | `/admin/users` | `users:manage` |
| PUT | `/admin/users/:id/status` | `users:manage` |
| GET · POST | `/admin/staff` | owner only |
| PUT | `/admin/staff/:id` | owner only |
| GET | `/admin/emails/logs` | `emails:read` |
| GET | `/admin/emails/status` | `emails:read` |
| POST | `/admin/emails/test` | `emails:send` |
| GET · PUT | `/admin/settings` | `settings:read` / `settings:write` |
| POST | `/admin/settings/maintenance` | `maintenance:toggle` |
| PUT | `/admin/settings/announcement` | `settings:write` |

Also admin-readable: `GET /contact`, `PUT /contact/:id`, `GET /newsletter`,
`GET /custom-requests`, `PUT /custom-requests/:id`, `GET /coupons` + CRUD.

### Staff tiers

Roles, weakest first: **staff → manager → admin → superadmin**.

| Tier | Can do |
| --- | --- |
| `staff` | Read the catalog, work orders, read customers and enquiries |
| `manager` | Everything above plus edit products, coupons, marketing; read settings |
| `admin` | Everything above plus delete products, edit settings, toggle maintenance |
| `superadmin` | Everything, and the only tier that can create or re-tier staff |

Beyond the tiers, any account can be given **extra** permissions or have one
**denied** — that is how one admin gets a little more access than the others
without inventing a new role:

```http
PUT /api/admin/staff/:id
{ "role": "manager", "extraPermissions": ["maintenance:toggle"] }
```

Effective access = role defaults + `extraPermissions` − `deniedPermissions`.
`GET /api/admin/staff` returns the full permission vocabulary for building the
UI. `GET /api/auth/me` returns the signed-in user's own `permissions` array, so
the panel can hide what they cannot use.

### The product on/off switch

```http
PATCH /api/admin/products/royal-imperial-choker-pendant/availability
{ "isAvailable": false, "note": "TEMPORARILY UNAVAILABLE" }
```

The moment it flips: the piece keeps its place in the catalog but renders greyed
out with your note as the label, the add-to-cart button is disabled, and both
`POST /cart/items` and `POST /orders` reject it. Setting `stock` to 0 has the
same effect with an automatic *OUT OF STOCK* label. Turning it back on needs no
deploy.

### Maintenance mode & announcements

```http
POST /api/admin/settings/maintenance
{ "enabled": true,
  "title": "Website Under Construction",
  "message": "Please wait for a while.",
  "expectedBackAt": "2026-09-20T18:30:00.000Z",
  "allowedIps": ["203.0.113.7"] }
```

The storefront swaps itself for `src/pages/Maintenance.jsx`, which shows the
title, the message and the current announcement. Staff and allow-listed IPs keep
browsing the live site.

```http
PUT /api/admin/settings/announcement
{ "enabled": true,
  "text": "DIWALI PREVIEW — BRIDAL SETS AT 20% OFF",
  "link": "https://…", "linkLabel": "Shop the preview",
  "tone": "LAUNCH",
  "startsAt": "2026-10-15T00:00:00.000Z", "endsAt": "2026-10-25T00:00:00.000Z" }
```

An announcement with dates goes live and expires on its own. When one is
enabled it replaces the rotating defaults in the site's top bar.

---

## Email automation

`src/services/emailService.js` with templates in `src/templates/emailTemplates.js`.

**Development** — leave `SMTP_HOST` blank. Every email goes to an Ethereal test
inbox and its preview link is printed in the console and stored in the email log,
so you can see exactly what the customer would have received without sending
anything real.

**Production** — set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`MAIL_FROM`.

Sent automatically: order confirmation (HTML invoice), new-order alert to the
store, order status updates, consultation acknowledgement, bespoke request
acknowledgement, welcome email. Each one can be switched off individually in
settings, and `email.dailyLimit` (default 800) caps the daily volume.

### Choosing a provider for 500–1,000 emails/day

| Provider | Free tier | Notes |
| --- | --- | --- |
| **Brevo** (ex-Sendinblue) | 300/day free | Simple SMTP, Indian-friendly billing. Paid plans start around 20k emails/month |
| **Amazon SES** | ~$0.10 per 1,000 | Cheapest at volume, but needs domain verification and a sandbox-exit request |
| **Zoho ZeptoMail** | pay-as-you-go, very cheap | Good fit if the client's mail is already on Zoho |
| **Resend** | 3,000/month free | Nicest developer experience; no Indian entity |
| **Gmail / Workspace SMTP** | ~500/day (2,000 on Workspace) | Works with an App Password, but not built for bulk — deliverability suffers and the account can be throttled |

**About using the client's own email account:** point the app at a transactional
provider that sends *as* that domain (SPF + DKIM records on
`gevariyajewels.com`) rather than logging into the mailbox itself. Set
`MAIL_FROM="GEVARIYA JEWELS <no-reply@gevariyajewels.com>"` and the customer
still sees the client's address, while replies land in the real inbox — with no
password shared, no daily cap from the mail provider, and no risk of the account
being locked for bulk sending. All that is needed is DNS access for the domain.

---

## Security

- Passwords hashed with bcrypt (12 rounds) and never selected by default
- JWT bearer tokens; the server refuses to start in production with the default secret
- Every price, discount, shipping fee and total is computed server-side from the
  database — the client's numbers are only ever a display hint
- Razorpay signatures verified with a constant-time comparison
- `helmet`, CORS pinned to `CLIENT_URL`, 600 req/15 min globally, tighter limits
  on auth and public forms
- `express-validator` on every write route
- Uploads restricted to images, 5MB, with generated filenames
- Stack traces never leave the server in production

---

## Testing

```bash
npm run test:smoke
```

Spins up an in-memory MongoDB and walks the whole system — catalog filters and
sorting, register/login, cart price-tampering, wishlist, coupons, guest checkout,
stock reservation, order tracking, the customer directory, forms, admin stats,
the availability switch, order status, staff tiers and permissions, maintenance
mode, announcements, email automation and payment config. 49 checks, no external
services required.
