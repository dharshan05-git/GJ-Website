import React from 'react';
import { Diamond, Award, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const About = () => {
  const { navigateToPage } = useShop();

  return (
    <div className="bg-[#FAF6F0] min-h-screen">
      
      {/* 1. Hero Craftsman Banner matching View 3 photo model */}
      <section className="relative h-[420px] bg-black overflow-hidden border-b border-[#E8DFD7]">
        <img 
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1600&q=85" 
          alt="Artisan Hands Crafting Jewelry"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615] via-[#1A1615]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            <Sparkles size={14} />
            <span>ESTABLISHED 2026 • MUMBAI</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide uppercase">
            OUR HERITAGE
          </h1>
          <p className="text-sm font-light text-[#E8DFD7] max-w-lg mt-3">
            Handcrafted with precision, devotion, and timeless luxury.
          </p>
        </div>
      </section>

      {/* 2. Story Section matching View 3 photo model */}
      <section className="py-20 border-b border-[#E8DFD7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-[0.25em] text-[#7A2E3B] uppercase">
                OUR STORY
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2623] leading-tight">
                ROOTED IN CRAFTSMANSHIP. <br />
                <span className="italic text-[#7A2E3B] font-normal">INSPIRED BY ELEGANCE.</span>
              </h2>

              <p className="text-sm text-[#736B66] leading-relaxed">
                At Gevariya Jewels, every piece is meticulously handcrafted by skilled artisans using the finest materials. We believe in creating jewelry that transcends time and becomes a part of your story.
              </p>

              <p className="text-sm text-[#736B66] leading-relaxed">
                From selecting raw conflict-free rough diamonds to precision 18k solid gold casting and hand-polishing, our heritage workshop in Mumbai honors centuries of Indian jewelry craftsmanship combined with modern contemporary geometry.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => navigateToPage('contact')}
                  className="btn-primary"
                >
                  <span>BOOK A PRIVATE CONSULTATION</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Artisan Image matching Photo model */}
            <div className="lg:col-span-6">
              <div className="relative rounded-xs overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80" 
                  alt="Fine Diamond Necklace Design Tools"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
                    DESIGN ARCHIVE
                  </span>
                  <h3 className="font-serif text-xl font-light text-white mt-1">
                    Custom Solitaire & Pave Casting Process
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Bottom Trust Metrics matching View 3 photo model */}
      <section className="py-16 bg-[#F3EAE1] border-b border-[#E8DFD7]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center">
              <Diamond size={28} className="text-[#7A2E3B] mb-2" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2C2623]">ETHICAL SOURCING</h4>
              <p className="text-xs text-[#736B66] mt-1">100% Kimberley process certified</p>
            </div>

            <div className="flex flex-col items-center">
              <Award size={28} className="text-[#7A2E3B] mb-2" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2C2623]">EXCEPTIONAL QUALITY</h4>
              <p className="text-xs text-[#736B66] mt-1">VVS1 Clarity & EF Color grade</p>
            </div>

            <div className="flex flex-col items-center">
              <Clock size={28} className="text-[#7A2E3B] mb-2" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2C2623]">TIMELESS DESIGN</h4>
              <p className="text-xs text-[#736B66] mt-1">Classic aesthetics for every era</p>
            </div>

            <div className="flex flex-col items-center">
              <ShieldCheck size={28} className="text-[#7A2E3B] mb-2" />
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2C2623]">LIFETIME WARRANTY</h4>
              <p className="text-xs text-[#736B66] mt-1">Complimentary annual maintenance</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
