import React, { useState } from 'react';
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowRight, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GevariyaLogo } from './GevariyaLogo';
import * as api from '../services/api';

export const Footer = () => {
  const { navigateToPage, setSizeGuideOpen, showToast, setTrackOrderOpen } = useShop();

  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      const result = await api.subscribeNewsletter(email);
      showToast(result?.message || 'Welcome to the Gevariya Circle ✨');
      setEmail('');
    } catch (error) {
      showToast(error.message || 'Could not subscribe, please try again');
    } finally {
      setSubscribing(false);
    }
  };

  const navLinks = [
    ['home',       'Home'],
    ['shop',       'Shop All'],
    ['customise',  'Customise'],
    ['about',      'Our Story'],
  ];

  const careLinks = [
    { label: 'Track My Order',              action: () => setTrackOrderOpen(true) },
    { label: 'Book Private Consultation',   action: () => navigateToPage('contact') },
    { label: 'Ring Size & Fitting Guide',   action: () => setSizeGuideOpen(true) },
    { label: 'Shipping & Delivery',         action: () => navigateToPage('delivery') },
    { label: 'Returns & Exchange',          action: () => navigateToPage('returns') },
    { label: '90-Day Colour Warranty',      action: () => navigateToPage('warranty') },
  ];

  return (
    <footer
      style={{
        background: '#E8D5CE',
        borderRadius: '32px 32px 0 0',
        borderTop: '1px solid #DBC5B8',
        color: '#2E2B2B',
      }}
      className="pt-14 pb-10"
    >
      <div className="container mx-auto px-5 sm:px-10 max-w-6xl">

        {/* ── Newsletter Banner ── */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #D8CFC3',
            borderRadius: '20px',
          }}
          className="p-6 sm:p-10 mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-[#7B3F42] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <Sparkles size={12} />
            <span>JOIN THE GEVARIYA CIRCLE</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#2E2B2B] font-light mb-1">
            Exclusive Previews &amp; Private Offers
          </h3>
          <p className="text-xs text-[#5C4038] mt-1 mb-6">
            Subscribe and enjoy <strong className="text-[#7B3F42]">10% off</strong> your first handcrafted order.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ borderRadius: '12px' }}
              className="flex-1 bg-[#F5F1EA] border border-[#D8CFC3] px-4 py-3 text-xs text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42] transition-colors"
            />
            <button
              type="submit"
              disabled={subscribing}
              style={{ borderRadius: '12px' }}
              className="bg-[#7B3F42] hover:bg-[#623033] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold tracking-widest uppercase px-6 py-3 flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>{subscribing ? 'JOINING…' : 'JOIN NOW'}</span>
              <ArrowRight size={12} />
            </button>
          </form>
        </div>

        {/* ── 4-Column Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#DBC5B8]">

          {/* Col 1: Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="opacity-90">
              <GevariyaLogo size="lg" isDarkBackground />
            </div>
            <p className="text-xs text-[#5C4038] leading-relaxed max-w-[220px]">
              Handcrafted by master artisans using 100% certified 925 sterling silver with premium gold plating.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2.5 pt-1">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{ borderRadius: '50%', border: '1px solid #DBC5B8' }}
                  className="w-8 h-8 flex items-center justify-center text-[#5C4038] hover:text-[#7B3F42] hover:border-[#7B3F42] transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigate */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.18em] text-[#7B3F42] uppercase">Navigate</h4>
            <ul className="space-y-2.5">
              {navLinks.map(([pg, lbl]) => (
                <li key={pg}>
                  <button
                    onClick={() => navigateToPage(pg)}
                    className="text-xs text-[#5C4038] hover:text-[#7B3F42] transition-colors text-left"
                  >
                    {lbl}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateToPage('shop', 'SETS')}
                  className="text-xs text-[#7B3F42] hover:text-[#623033] transition-colors font-semibold text-left"
                >
                  Curated Sets ✦
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.18em] text-[#7B3F42] uppercase">Customer Care</h4>
            <ul className="space-y-2.5">
              {careLinks.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={item.action}
                    className="text-xs text-[#5C4038] hover:text-[#7B3F42] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Office */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.18em] text-[#7B3F42] uppercase">Office</h4>
            <div className="space-y-3 text-xs text-[#5C4038]">
              <p className="flex items-start gap-2">
                <MapPin size={13} className="text-[#7B3F42] shrink-0 mt-0.5" />
                <span>810 KBC-1 , Yogi Chowk , Chikuwadi , Nana Varachha , Surat- 395010</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#7B3F42] shrink-0" />
                <span>+91 70416 77500</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#7B3F42] shrink-0" />
                <span>gevariya@gevariyajewels.in</span>
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5C4038] gap-3">
          <p className="flex items-center gap-1.5">
            Made with <Heart size={11} className="text-[#7B3F42]" fill="currentColor" /> in Mumbai
            &nbsp;·&nbsp; © 2026 GEVARIYA JEWELS
          </p>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <button onClick={() => navigateToPage('returns')}  className="hover:text-[#7B3F42] transition-colors">Returns</button>
            <button onClick={() => navigateToPage('delivery')} className="hover:text-[#7B3F42] transition-colors">Shipping</button>
            <button onClick={() => navigateToPage('warranty')} className="hover:text-[#7B3F42] transition-colors">Warranty</button>
            <a href="/admin" className="hover:text-[#7B3F42] transition-colors">Admin</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
