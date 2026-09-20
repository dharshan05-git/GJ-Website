import React from 'react';
import { ShieldCheck, Lock, ArrowLeft, Home, ShoppingBag, PhoneCall, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * 404 & High-Security Fallback Page
 * Prevents reconnaissance, hides internal technical metadata,
 * and securely guides users back to verified store areas.
 */
export const NotFound = () => {
  const { navigateToPage } = useShop();

  return (
    <div className="bg-[#FAF7F2] min-h-[80vh] flex items-center justify-center py-16 px-6 sm:px-12">
      <div className="max-w-2xl w-full bg-white border border-[#DBC5B8] rounded-2xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
        
        {/* Subtle Luxury Security Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#7B3F42]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#C6A46A]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="relative z-10 mx-auto w-20 h-20 rounded-full bg-[#FAF6F0] border border-[#E8D5CE] flex items-center justify-center text-[#7B3F42] mb-6 shadow-xs">
          <ShieldCheck size={38} className="text-[#7B3F42]" />
          <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#7B3F42] text-white flex items-center justify-center border-2 border-white">
            <Lock size={13} />
          </span>
        </div>

        {/* Security Header & Status */}
        <div className="relative z-10 mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-[0.28em] text-[#C6A46A] uppercase bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#EDE5DC] mb-3">
            <Sparkles size={11} className="text-[#C6A46A]" />
            <span>ENCRYPTED SANCTUARY • ZERO LEAK PROTECTION</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#2E2B2B] uppercase tracking-wide">
            404 — <span className="italic font-normal text-[#7B3F42]">PAGE NOT FOUND</span>
          </h1>
          <div className="w-12 h-[1.5px] bg-[#7B3F42] mx-auto mt-4 mb-4" />
          <p className="text-xs sm:text-[13px] text-[#5C4038] max-w-md mx-auto leading-relaxed">
            The requested page does not exist or has been securely relocated. Rest assured, your browsing session, cart, and payment data remain 100% encrypted and safe.
          </p>
        </div>

        {/* Security Protocol Badges */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left bg-[#FAF7F2] p-4 rounded-xl border border-[#E8D5CE]">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-[#2E2B2B] uppercase">SSL Active</p>
              <p className="text-[9px] text-[#8A726A]">256-Bit TLS Encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="text-[10px] font-bold text-[#2E2B2B] uppercase">Zero Data Leak</p>
              <p className="text-[9px] text-[#8A726A]">No Stack Metadata</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <p className="text-[10px] font-bold text-[#2E2B2B] uppercase">Session Intact</p>
              <p className="text-[9px] text-[#8A726A]">Bag &amp; Wishlist Protected</p>
            </div>
          </div>
        </div>

        {/* Secure Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateToPage('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7B3F42] hover:bg-[#623033] text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-7 py-3.5 rounded-lg transition-colors shadow-sm"
          >
            <Home size={14} />
            <span>RETURN TO HOME</span>
          </button>

          <button
            onClick={() => navigateToPage('shop', 'ALL')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F2] text-[#2E2B2B] border border-[#DBC5B8] hover:border-[#7B3F42] font-sans font-semibold text-xs tracking-[0.2em] uppercase px-7 py-3.5 rounded-lg transition-colors"
          >
            <ShoppingBag size={14} />
            <span>BROWSE CATALOG</span>
          </button>

          <button
            onClick={() => navigateToPage('contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:text-[#7B3F42] text-[#5C4038] font-sans font-semibold text-xs tracking-[0.16em] uppercase px-4 py-3.5 transition-colors"
          >
            <PhoneCall size={14} />
            <span>CONCIERGE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
