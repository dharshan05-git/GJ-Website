import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { ProductPage } from './pages/ProductPage';
import { Contact } from './pages/Contact';
import { Customise } from './pages/Customise';
import { Warranty } from './pages/Warranty';
import { Delivery } from './pages/Delivery';
import { Returns } from './pages/Returns';
import { NotFound } from './pages/NotFound';
import { Maintenance } from './pages/Maintenance';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Footer } from './components/Footer';
import { FlyToCart } from './components/FlyToCart';
import { CurtainLoader } from './components/CurtainLoader';
import { AdminApp } from './pages/admin/AdminApp';

/** Catches render errors instead of showing the visitor a blank screen. */
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // Replace with a real reporting endpoint when one exists.
    console.error('Gevariya app error:', error, errorInfo?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-4 text-center">
          <div className="max-w-md bg-white border border-[#D8CFC3] rounded-2xl px-8 py-10 shadow-sm">
            <h1 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide">
              Something went wrong
            </h1>
            <p className="text-xs text-[#5C4038] mt-3 leading-relaxed">
              Our apologies — this page could not be displayed. Please reload, or write to
              hello@gevariyajewels.com if it keeps happening.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#7B3F42] hover:bg-[#623033] text-white text-xs font-bold uppercase tracking-[0.2em] px-7 py-3 rounded-lg transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Chrome shared by every storefront page: bars, drawers, toast, footer. */
const StorefrontLayout = ({ children }) => {
  const { toastMessage, maintenance } = useShop();
  const [showLoader, setShowLoader] = React.useState(true);

  // Maintenance mode, flipped from the admin panel, replaces the whole store.
  // It deliberately does not cover /admin — staff still need a way in.
  if (maintenance) return <Maintenance />;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#A67B8A] selection:text-white relative overflow-x-hidden">
      {showLoader && <CurtainLoader onComplete={() => setShowLoader(false)} />}

      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">{children}</main>

      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
      <QuickViewModal />
      <SizeGuideModal />

      {toastMessage && (
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[2000] bg-[#1A1615] text-white text-xs font-semibold px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xl border border-[#A67B8A]/40 flex items-center justify-center sm:justify-start gap-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#A67B8A] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      <FlyToCart />
      <Footer />
    </div>
  );
};

const storefront = (element) => <StorefrontLayout>{element}</StorefrontLayout>;

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ShopProvider>
          <Routes>
            {/* Staff area — no storefront chrome, and reachable during maintenance. */}
            <Route path="/admin/*" element={<AdminApp />} />

            {/* Storefront */}
            <Route path="/" element={storefront(<Home />)} />
            <Route path="/shop" element={storefront(<Shop />)} />
            <Route path="/shop/:category" element={storefront(<Shop />)} />
            <Route path="/product/:id" element={storefront(<ProductPage />)} />
            <Route path="/about" element={storefront(<About />)} />
            <Route path="/contact" element={storefront(<Contact />)} />
            <Route path="/customise" element={storefront(<Customise />)} />
            <Route path="/warranty" element={storefront(<Warranty />)} />
            <Route path="/delivery" element={storefront(<Delivery />)} />
            <Route path="/returns" element={storefront(<Returns />)} />

            {/* Legacy aliases kept so older links still resolve */}
            <Route path="/lifetime" element={<Navigate to="/warranty" replace />} />
            <Route path="/shipping" element={<Navigate to="/delivery" replace />} />
            <Route path="/return" element={<Navigate to="/returns" replace />} />

            <Route path="*" element={storefront(<NotFound />)} />
          </Routes>
        </ShopProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
