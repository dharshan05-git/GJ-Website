import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { CategoryGrid } from '../components/CategoryGrid';
import { SignatureProduct } from '../components/SignatureProduct';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Testimonials } from '../components/Testimonials';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Truck, Star, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';

export const Home = () => {
  const { navigateToPage } = useShop();
  const bestSellers = PRODUCTS.slice(0, 4);

  return (
    <div className="bg-[#FAF6F0]">

      {/* 1. HERO — 1 Image + 1 Video, Left/Right Arrows, Auto 5s / 10s */}
      <Hero />

      {/* 2. TRUST PERKS BAR BELOW HERO */}
      <section className="bg-[#FAF6F0] border-t border-b border-[#E8DFD7] py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex items-center justify-center gap-3">
            <Truck size={22} className="text-[#7A2E3B] shrink-0" />
            <div className="text-left">
              <h4 className="font-sans text-xs font-bold tracking-wider text-[#2C2623] uppercase">Free Shipping</h4>
              <p className="text-[11px] text-[#736B66]">Above ₹1,500</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Star size={22} className="text-[#7A2E3B] shrink-0" />
            <div className="text-left">
              <h4 className="font-sans text-xs font-bold tracking-wider text-[#2C2623] uppercase">18K Solid Gold</h4>
              <p className="text-[11px] text-[#736B66]">Authentic & Hallmarked</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <RotateCcw size={22} className="text-[#7A2E3B] shrink-0" />
            <div className="text-left">
              <h4 className="font-sans text-xs font-bold tracking-wider text-[#2C2623] uppercase">Easy Returns</h4>
              <p className="text-[11px] text-[#736B66]">15 Days Hassle Free</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <ShieldCheck size={22} className="text-[#7A2E3B] shrink-0" />
            <div className="text-left">
              <h4 className="font-sans text-xs font-bold tracking-wider text-[#2C2623] uppercase">Lifetime Shine</h4>
              <p className="text-[11px] text-[#736B66]">Polish & Care Guarantee</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORIES — Spherical Icons */}
      <CategoryGrid />

      {/* 4. GEVARIYA'S BEST */}
      <section className="bg-[#FAF6F0] py-14 border-b border-[#E8DFD7]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#7A2E3B] uppercase">
              EXCLUSIVELY CURATED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2623] uppercase mt-1 tracking-wider">
              GEVARIYA'S BEST
            </h2>
            <div className="w-14 h-0.5 bg-[#7A2E3B] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={() => navigateToPage('shop', 'ALL')}
              className="inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-widest text-white bg-[#7A2E3B] hover:bg-[#5F222D] px-8 py-3.5 text-xs rounded-xs transition-colors shadow-sm"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* 5. SIGNATURE PRODUCT SHOWCASE (DIAMOND DROP EARRINGS) */}
      <SignatureProduct />

      {/* 6. WHY CHOOSE GEVARIYA (SIMPLE & SHORT) */}
      <WhyChooseUs />

      {/* 7. LEFT TO RIGHT MOVING TESTIMONIALS (PAUSES ON HOVER) */}
      <Testimonials />

    </div>
  );
};
