import React from 'react';
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
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Footer } from './components/Footer';
import { FlyToCart } from './components/FlyToCart';
import { CurtainLoader } from './components/CurtainLoader';

// Security Error Boundary to prevent stack trace leaks
class SecurityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Silently log or capture in secure telemetry without exposing client-side leaks
    console.warn('Gevariya Security Boundary: Protected route intercepted');
  }

  render() {
    if (this.state.hasError) {
      return <NotFound />;
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { activePage, toastMessage } = useShop();
  const [showLoader, setShowLoader] = React.useState(true);

  // List of valid routes
  const validPages = ['home', 'shop', 'about', 'product', 'contact', 'customise', 'warranty', 'lifetime', 'delivery', 'shipping', 'returns', 'return'];
  const isKnownRoute = validPages.includes(activePage);

  return (
    <SecurityErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white selection:bg-[#A67B8A] selection:text-white relative overflow-x-hidden">
        {/* Two-Curtain Pink Logo Loader with Subtle Silk Shine & Click-to-Skip */}
        {showLoader && <CurtainLoader onComplete={() => setShowLoader(false)} />}

        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* Main Navbar */}
        <Navbar />

        {/* Page View Router with 404 Security Fallback */}
        <main className="flex-1">
          {activePage === 'home' && <Home />}
          {activePage === 'shop' && <Shop />}
          {activePage === 'about' && <About />}
          {activePage === 'product' && <ProductPage />}
          {activePage === 'contact' && <Contact />}
          {activePage === 'customise' && <Customise />}
          {(activePage === 'warranty' || activePage === 'lifetime') && <Warranty />}
          {(activePage === 'delivery' || activePage === 'shipping') && <Delivery />}
          {(activePage === 'returns' || activePage === 'return') && <Returns />}
          {!isKnownRoute && <NotFound />}
        </main>

        {/* Global Shopping Drawers & Modals */}
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
        <SizeGuideModal />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[2000] bg-[#1A1615] text-white text-xs font-semibold px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xl border border-[#A67B8A]/40 flex items-center justify-center sm:justify-start gap-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#A67B8A] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Fly-to-Cart global animation overlay */}
        <FlyToCart />

        {/* Footer */}
        <Footer />
      </div>
    </SecurityErrorBoundary>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
