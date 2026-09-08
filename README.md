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

## 💎 License & Credits
© 2026 **GEVARIYA JEWELS**. All Rights Reserved. Handcrafted fine jewelry atelier.
