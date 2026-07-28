import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { ProductPage } from './pages/ProductPage';
import { Contact } from './pages/Contact';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { Footer } from './components/Footer';

const AppContent = () => {
  const { activePage, toastMessage } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] selection:bg-[#7A2E3B] selection:text-white">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navbar */}
      <Navbar />

      {/* Page View Router */}
      <main className="flex-1">
        {activePage === 'home' && <Home />}
        {activePage === 'shop' && <Shop />}
        {activePage === 'about' && <About />}
        {activePage === 'product' && <ProductPage />}
        {activePage === 'contact' && <Contact />}
      </main>

      {/* Global Shopping Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <SizeGuideModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[2000] bg-[#1A1615] text-[#FAF6F0] text-xs font-semibold px-5 py-3 rounded-xs shadow-2xl border border-[#D4AF37] animate-bounce flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
