# GEVARIYA JEWELS — Haute Joaillerie & Fine Luxury Jewelry E-Commerce

A luxury digital boutique and haute joaillerie e-commerce experience crafted for **GEVARIYA JEWELS**. Designed with high-fashion minimal aesthetics, cinematic video loading experience, complete bridal and gala jewelry sets showcase, responsive interactive drawers, exact brand typography, and pixel-perfect design system matching reference standards.

---

## 🌟 Key Highlights & Features

### 1. 🎨 Official Brand Logo & Identity
- **Official "GJ" Logo Integration**: Pixel-perfect scale and placement across the main navigation header and footer, exact match to brand reference standards.
- **Minimalist Luxury Palette**:
  - `Champagne Soft Canvas` — `#FAF6F0` / `#FFFFFF`
  - `Charcoal Black` — `#1A1615` / `#3D3533`
  - `Muted Rose Gold Accent` — `#A67B8A` / `#8B5E6C`
  - `Champagne Gold` — `#D4AF37`
  - `Border Separator` — `#EDE5DC`

### 2. 🎬 High-Definition Video Loading Experience
- **Watermark-Free Playback**: High-quality hardware-accelerated video preloader with automatic edge-cropping that seamlessly conceals watermarks without altering the original color grading or video resolution.
- **Auto-Transition**: Automatically reveals the boutique as soon as the video finishes, or upon a single click.

### 3. 💎 Signature Sets & Bridal Collections
- **Curated Ensembles**: Multi-piece jewelry sets (Chokers, Necklaces, Drop Earrings, Solitaire Rings, Bangles, and Maang Tikkas).
- **Dedicated Homepage Showcase**: The **THE SIGNATURE SETS** showcase section highlights bundle discounts, complimentary velvet presentation chests, and itemized piece badges.
- **Spherical Collection Grid**: Integrated into the circular **OUR COLLECTIONS** category grid.
- **Full Catalog Filter**: Filter by `SETS`, `RINGS`, `NECKLACES`, `EARRINGS`, and `BRACELETS` with instant sorting (Price Low/High, Top Rated, Featured).

### 4. 🛍️ Full E-Commerce Interactivity
- **Side Drawers**: Interactive sliding **Cart Drawer** with live order summary and free shipping tracker, plus a dedicated **Wishlist Drawer**.
- **Quick View Modal**: Inspect piece specifications, metal options (18K Yellow / Rose / White Gold), and ring sizes without leaving the page.
- **Ring Size Guide**: Interactive size conversion chart (US, Indian & Inside Diameter in mm).
- **Toast Notifications**: Floating feedback for cart additions, removals, and wishlist updates.

---

## 🛠️ Technology Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS tokens & [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Cormorant Garamond (Serif) & Plus Jakarta Sans / Inter

---

## 📁 Project Structure

```
WD 2/
├── public/
│   ├── loading-video.mp4        # High-definition loading intro video
│   └── whatsapp_image_logo.jpeg # Official GEVARIYA JEWELS brand logo
├── src/
│   ├── components/
│   │   ├── AnnouncementBar.jsx # Top gold & rose announcement banner
│   │   ├── BrandValues.jsx     # 4-column value proposition bar
│   │   ├── CartDrawer.jsx      # Slide-over shopping bag with totals
│   │   ├── CategoryGrid.jsx    # 5 Spherical collection categories (incl. SETS)
│   │   ├── CurtainLoader.jsx   # HD Video loading screen with watermark crop
│   │   ├── Footer.jsx          # Studio address, navigation, newsletter
│   │   ├── GevariyaLogo.jsx    # Official brand image logo component
│   │   ├── Hero.jsx            # Autoplay video + image split banner
│   │   ├── Navbar.jsx          # Sticky blur header with search & menus
│   │   ├── ProductCard.jsx     # Card with quick-actions & set badges
│   │   ├── QuickViewModal.jsx  # Detailed quick look modal
│   │   ├── SetsShowcase.jsx    # Dedicated Curated Sets homepage section
│   │   ├── SignatureProduct.jsx# Showcase for signature drop earrings
│   │   ├── SizeGuideModal.jsx  # Ring size measurement guide
│   │   ├── Testimonials.jsx    # Continuous infinite marquee reviews
│   │   ├── ValueProps.jsx      # Brand quality pillars
│   │   ├── WhyChooseUs.jsx     # Craftsmanship & certification highlights
│   │   └── WishlistDrawer.jsx  # Saved favorites drawer
│   ├── context/
│   │   └── ShopContext.jsx     # Global cart, wishlist, routing & loader state
│   ├── data/
│   │   └── products.js         # Catalog data with sets, categories & specs
│   ├── pages/
│   │   ├── About.jsx           # Atelier story, craftsmanship & heritage
│   │   ├── Contact.jsx         # Booking form, Mumbai studio location & FAQ
│   │   ├── Home.jsx            # Main landing page
│   │   ├── ProductPage.jsx     # Single product & set detail view with zoom
│   │   └── Shop.jsx            # Catalog listing with filter & sort
│   ├── styles/
│   │   └── index.css           # Luxury design system, animations & utilities
│   ├── App.jsx                 # Root component with router and modals
│   └── main.jsx                # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Backend API (`backend/`)

The storefront is wired to a Node.js + Express + MongoDB API that owns the
catalog, orders, payments, email automation and the admin surface.

### Run both sides

```bash
npm install                 # frontend
npm run backend:install     # backend deps

cp .env.example .env                  # VITE_API_URL for the frontend
cp backend/.env.example backend/.env  # MONGO_URI + JWT_SECRET

npm run backend:seed        # 57 products, coupons, owner account, settings
npm run backend:dev         # API  -> http://localhost:5000/api
npm run dev                 # site -> http://localhost:5173
```

No MongoDB installed? `npm run backend:memory` runs the API against a throwaway
in-memory database, already seeded. The storefront also falls back to the bundled
catalog in `src/data/products.js` whenever the API is unreachable, so the site
never renders empty.

### What the backend powers

| Feature | Where |
| --- | --- |
| Live catalog, filters, sorting | `ShopContext` → `GET /api/products` |
| Checkout with COD or Razorpay | `CheckoutModal.jsx` → `POST /api/orders` |
| Promo codes validated server-side | `CartDrawer.jsx` → `POST /api/coupons/validate` |
| Consultation bookings | `Contact.jsx` → `POST /api/contact` |
| Newsletter | `Footer.jsx` → `POST /api/newsletter/subscribe` |
| Bespoke requests with photo upload | `Customise.jsx` → `POST /api/custom-requests` |
| Product enable/disable switch | renders as *Unavailable* on the card, blocked at checkout |
| Maintenance mode | `src/pages/Maintenance.jsx` replaces the whole site |
| Editable announcement bar | `AnnouncementBar.jsx` reads `GET /api/settings/public` |
| Order confirmation emails | HTML invoice sent automatically on every order |

Full endpoint reference, staff permission tiers and email setup:
[`backend/README.md`](backend/README.md).

---

## 🔐 Admin panel (`/admin`)

Sign in at **`/admin`** with a staff account — the owner account is created by
`npm run backend:seed` from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.
There is also a discreet **Staff** link in the footer.

| Section | What it does |
| --- | --- |
| Dashboard | Revenue, orders to action, stock warnings, recent orders |
| Products | Search the catalog, edit price/stock/badge, and the **enable/disable switch** |
| Orders | Filter, open, change status (emails the customer), resend the invoice |
| Customers | Every buyer including guests — lifetime value, addresses, order history |
| Custom Orders | Bespoke briefs with the reference photo; set status and quote a price |
| Enquiries | Consultation bookings, and the newsletter list with CSV export |
| Email Automation | Transport status, daily counts, send a test, full delivery log |
| Store Settings | **Maintenance mode**, the **announcement bar**, shipping rules, contact details |
| Staff & Access | *(owner only)* add members, set their tier, grant extra permissions |

Tabs are hidden when the signed-in member lacks the permission, and the backend
checks it again on every request.

**Maintenance mode** swaps the whole storefront for the construction page while
staff keep browsing normally — the API decides who sees what, so nothing has to
be duplicated in the frontend.

### Routing note for deployment

The app now uses real URLs (`/shop/rings`, `/product/:id`, `/admin`), so the host
must serve `index.html` for unknown paths or every link except `/` will 404.
`public/_redirects` covers Netlify; on Vercel add a rewrite to `/index.html`, and
on nginx use `try_files $uri /index.html;`.

---

## 💎 License & Credits
© 2026 **GEVARIYA JEWELS**. All Rights Reserved. Handcrafted fine jewelry atelier.
