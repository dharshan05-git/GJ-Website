import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer = () => {
  const { navigateToPage } = useShop();

  return (
    <footer className="bg-[#1A1615] text-[#FAF6F0] pt-16 pb-8 border-t border-[#332B27]">
      <div className="container">
        
        {/* Newsletter Banner */}
        <div className="bg-[#26201E] border border-[#3E3532] p-8 rounded-xs mb-16 text-center max-w-3xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles size={14} />
            <span>JOIN THE GEVARIYA CIRCLE</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
            Receive Exclusive Previews & Private Offers
          </h3>
          <p className="text-xs text-[#9E958F] mt-2 mb-6">
            Subscribe to our weekly curated newsletter. Enjoy 10% off your first handcrafted order.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Gevariya Jewels newsletter!'); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              required
              className="flex-1 bg-[#1A1615] border border-[#3E3532] px-4 py-3 text-xs text-white placeholder-[#736B66] outline-none rounded-xs focus:border-[#D4AF37]"
            />
            <button 
              type="submit"
              className="bg-[#7A2E3B] hover:bg-[#5F222D] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Main 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#332B27]">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#7A2E3B] text-white font-serif text-sm font-bold">
                GJ
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-white">
                GEVARIYA JEWELS
              </span>
            </div>
            <p className="text-xs text-[#9E958F] leading-relaxed">
              Every piece of Gevariya Jewels is handcrafted by master artisans using 100% certified 18k solid gold and ethically sourced conflict-free diamonds.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold tracking-widest text-[#D4AF37] uppercase">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs text-[#9E958F]">
              <li>
                <button onClick={() => navigateToPage('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateToPage('shop', 'ALL')} className="hover:text-white transition-colors">
                  Shop All Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigateToPage('shop', 'RINGS')} className="hover:text-white transition-colors">
                  Solitaire Rings
                </button>
              </li>
              <li>
                <button onClick={() => navigateToPage('shop', 'NECKLACES')} className="hover:text-white transition-colors">
                  Diamond Necklaces
                </button>
              </li>
              <li>
                <button onClick={() => navigateToPage('about')} className="hover:text-white transition-colors">
                  Our Story & Craftsmanship
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold tracking-widest text-[#D4AF37] uppercase">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-[#9E958F]">
              <li>
                <button onClick={() => navigateToPage('contact')} className="hover:text-white transition-colors">
                  Book Private Consultation
                </button>
              </li>
              <li><span>Ring Size & Fitting Guide</span></li>
              <li><span>Insured Shipping & Delivery</span></li>
              <li><span>Returns & Exchange Policy</span></li>
              <li><span>Lifetime Warranty & Care</span></li>
            </ul>
          </div>

          {/* Col 4: Studio Location matching Photo model */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold tracking-widest text-[#D4AF37] uppercase">
              VISIT OUR STUDIO
            </h4>
            <div className="space-y-2.5 text-xs text-[#9E958F]">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex, Bandra East, Mumbai, 400051</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[#D4AF37] shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-[#D4AF37] shrink-0" />
                <span>hello@gevariyajewels.com</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3 text-[#9E958F]">
              <a href="#instagram" className="w-8 h-8 rounded-full border border-[#332B27] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                <Instagram size={15} />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full border border-[#332B27] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                <Facebook size={15} />
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-full border border-[#332B27] flex items-center justify-center hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                <Twitter size={15} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#736B66]">
          <p>© 2026 GEVARIYA JEWELS. All Rights Reserved. Inspired by Skyra Jewels Design.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>BIS Hallmarking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
