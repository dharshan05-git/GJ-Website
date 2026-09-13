import React, { useState } from 'react';
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GevariyaLogo } from './GevariyaLogo';
import * as api from '../services/api';

export const Footer = () => {
  const { navigateToPage, setSizeGuideOpen, showToast } = useShop();

  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const result = await api.subscribeNewsletter(email);
      showToast(result?.message || 'Welcome to the Gevariya Circle');
      setEmail('');
    } catch (error) {
      showToast(error.message || 'Could not subscribe, please try again');
    } finally {
      setSubscribing(false);
    }
  };

  const customerCareLinks = [
    { label: 'Book Private Consultation', action: () => navigateToPage('contact') },
    { label: 'Ring Size & Fitting Guide', action: () => setSizeGuideOpen(true) },
    { label: 'Insured Shipping & Delivery', action: () => navigateToPage('delivery') },
    { label: 'Returns & Exchange Policy', action: () => navigateToPage('returns') },
    { label: '90-Day Colour Warranty & Lifetime Care', action: () => navigateToPage('warranty') },
  ];

  return (
    <footer className="bg-[#E8D5CE] text-[#2E2B2B] pt-16 pb-8 border-t border-[#DBC5B8]">
      <div className="container mx-auto px-4 sm:px-8">

        {/* Newsletter */}
        <div className="bg-white border border-[#D8CFC3] p-6 sm:p-8 mb-10 sm:mb-16 text-center max-w-3xl mx-auto shadow-sm">
          <div className="inline-flex items-center gap-2 text-[#7B3F42] text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles size={13} className="text-[#C6A46A]" />
            <span>JOIN THE GEVARIYA CIRCLE</span>
          </div>
          <h3 className="font-serif text-xl sm:text-3xl text-[#2E2B2B] font-light">
            Receive Exclusive Previews &amp; Private Offers
          </h3>
          <p className="text-xs text-[#5C4038] mt-2 mb-6">
            Subscribe to our weekly curated newsletter. Enjoy 10% off your first handcrafted order.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 bg-[#F5F1EA] border border-[#D8CFC3] px-4 py-3 text-xs text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42]"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-[#7B3F42] hover:bg-[#623033] disabled:bg-[#B6ADA6] disabled:cursor-not-allowed text-white text-xs font-bold tracking-widest uppercase px-6 py-3 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>{subscribing ? 'SUBSCRIBING…' : 'SUBSCRIBE'}</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-[#DBC5B8]">

          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="block sm:hidden">
              <GevariyaLogo size="md" />
            </div>
            <div className="hidden sm:block">
              <GevariyaLogo size="lg" />
            </div>
            <p className="text-xs text-[#5C4038] leading-relaxed">
              Every piece is handcrafted by master artisans using 100% certified 925 sterling silver with premium gold plating for lasting beauty.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#7B3F42] uppercase">NAVIGATION</h4>
            <ul className="space-y-2 text-xs text-[#5C4038]">
              {[
                ['home', 'Home'],
                ['shop', 'Shop All Collections'],
                ['customise', 'Customise & Bespoke'],
                ['about', 'Our Story & Journey'],
              ].map(([pg, lbl]) => (
                <li key={pg}>
                  <button onClick={() => navigateToPage(pg)} className="hover:text-[#7B3F42] transition-colors text-left">{lbl}</button>
                </li>
              ))}
              <li>
                <button onClick={() => navigateToPage('shop', 'SETS')} className="text-[#7B3F42] hover:text-[#623033] transition-colors font-semibold text-left">
                  Curated Sets &amp; Bridal Suites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#7B3F42] uppercase">CUSTOMER CARE</h4>
            <ul className="space-y-2 text-xs text-[#5C4038]">
              {customerCareLinks.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={item.action}
                    className="hover:text-[#7B3F42] transition-colors text-left cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Studio */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#7B3F42] uppercase">VISIT OUR STUDIO</h4>
            <div className="space-y-2.5 text-xs text-[#5C4038]">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#7B3F42] shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex, Bandra East, Mumbai, 400051</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#7B3F42] shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#7B3F42] shrink-0" />
                <span>hello@gevariyajewels.com</span>
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3 text-[#5C4038]">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full border border-[#DBC5B8] bg-white flex items-center justify-center hover:text-[#7B3F42] hover:border-[#7B3F42] transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5C4038]">
          <p>© 2026 GEVARIYA JEWELS. All Rights Reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <button onClick={() => navigateToPage('returns')} className="hover:text-[#7B3F42] transition-colors">Return Policy</button>
            <button onClick={() => navigateToPage('delivery')} className="hover:text-[#7B3F42] transition-colors">Shipping Terms</button>
            <button onClick={() => navigateToPage('warranty')} className="hover:text-[#7B3F42] transition-colors">90-Day Warranty</button>
            <a href="/admin" className="text-[#8A726A] hover:text-[#7B3F42] transition-colors">Staff</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
