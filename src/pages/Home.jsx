import React from 'react';
import { Hero } from '../components/Hero';
import { BrandValues } from '../components/BrandValues';
import { CategoryGrid } from '../components/CategoryGrid';
import { SignatureProduct } from '../components/SignatureProduct';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Testimonials } from '../components/Testimonials';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Home = () => {
  const { navigateToPage } = useShop();
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const [headingRef, headingVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">

      {/* 1. Hero Slider */}
      <Hero />

      {/* 2. Brand Values 4-column bar */}
      <BrandValues />

      {/* 3. Our Collections Grid */}
      <CategoryGrid />

      {/* 4. Best Sellers — Styled exactly matching Reference Image 1 */}
      <section className="bg-[#FAF7F2] py-14 sm:py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-10">

          {/* Heading — Clean Burgundy Serif "BEST SELLERS" */}
          <div
            ref={headingRef}
            className={`text-center max-w-xl mx-auto mb-8 sm:mb-12 reveal-up ${headingVisible ? 'visible' : ''}`}
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#7B3F42] uppercase tracking-[0.08em] font-light">
              BEST SELLERS
            </h2>
          </div>

          {/* 2-Column Mobile Grid / 4-Column Desktop Grid */}
          <div
            ref={gridRef}
            className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 stagger-children ${gridVisible ? 'visible' : ''}`}
          >
            {bestSellers.map(product => (
              <div
                key={product.id}
                className={`reveal-up ${gridVisible ? 'visible' : ''}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div
            ref={ctaRef}
            className={`mt-10 sm:mt-12 text-center reveal-up ${ctaVisible ? 'visible' : ''}`}
          >
            <button
              onClick={() => navigateToPage('shop', 'ALL')}
              className="luxury-shimmer-btn group inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-widest text-white bg-[#7B3F42] hover:bg-[#623033] px-8 py-3.5 sm:px-9 sm:py-4 text-[11px] sm:text-xs transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 rounded-xs"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Signature Craftsmanship */}
      <SignatureProduct />

      {/* 6. Why Choose Us — Styled exactly matching Reference Image 2 */}
      <WhyChooseUs />

      {/* 7. Testimonials / Reviews */}
      <Testimonials />

    </div>
  );
};
