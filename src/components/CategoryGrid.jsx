import React, { useState, useRef } from 'react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * CategoryGrid — "OUR COLLECTIONS" / "SHINE YOUR WAY"
 * Features:
 * - Cushion-Cut Gemstone Shape with luxury halo glow & shimmer.
 * - Mobile (<sm): 3 categories per slide (Slide 1: RINGS, PENDANTS, EARRINGS; Slide 2: STUDS, BRACELETS, SETS)
 *   with smooth touch swipe, pagination dots, and arrow controls.
 * - Desktop/Tablet (>=sm): Full 6-column curated showcase.
 */
export const CategoryGrid = () => {
  const { navigateToPage } = useShop();

  const collections = CATEGORIES.filter(c => c.id !== 'ALL');
  // 3 per slide for mobile view
  const mobileSlide1 = collections.slice(0, 3); // Rings, Pendants, Earrings
  const mobileSlide2 = collections.slice(3, 6); // Studs, Bracelets, Sets

  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const [sectionRef, isVisible] = useScrollAnimation(0.12, '0px 0px -60px 0px', false);

  const minSwipeDistance = 35;

  const handleTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance && activeSlide < 1) {
      setActiveSlide(1);
    } else if (distance < -minSwipeDistance && activeSlide > 0) {
      setActiveSlide(0);
    }
  };

  const renderCategoryCard = (cat) => (
    <div
      key={cat.id}
      onClick={() => navigateToPage('shop', cat.id)}
      className="group cursor-pointer flex flex-col items-center select-none w-full transition-transform duration-500 hover:-translate-y-2 active:scale-95"
    >
      {/* Square container — maintains 1:1 ratio for Cushion-Cut Shape */}
      <div className="relative w-full aspect-square">

        {/* Gold/burgundy halo glow ring on hover */}
        <div
          className="absolute transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
          style={{
            clipPath: 'url(#cushionCutRing)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #C6A46A 0%, #7B3F42 50%, #C6A46A 100%)',
            inset: '-4px',
            zIndex: 0,
            filter: 'drop-shadow(0 8px 16px rgba(123, 63, 66, 0.3))',
          }}
        />

        {/* Image Stage — clipped to cushion-cut shape */}
        <div
          className="absolute inset-0 overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-2xl bg-[#FAF6F0]"
          style={{
            clipPath: 'url(#cushionCut)',
            borderRadius: '20px',
            zIndex: 1,
          }}
        >
          {/* Diagonal shimmer sweep on hover */}
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.2) 100%)',
            }}
          />

          {/* High quality image with smooth slow zoom on hover */}
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-112"
            loading="lazy"
          />

          {/* Floating Micro-Badge on Desktop Hover */}
          <div className="hidden sm:flex absolute inset-0 z-30 items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <span className="bg-[#2E2B2B]/85 backdrop-blur-xs text-white text-[9px] font-sans font-bold tracking-[0.2em] uppercase px-2.5 py-1 shadow-md flex items-center gap-1 border border-white/20">
              <span>EXPLORE</span>
              <ArrowUpRight size={10} className="text-[#C6A46A]" />
            </span>
          </div>
        </div>
      </div>

      {/* Category Title & Micro-Line Underline */}
      <div className="mt-2.5 sm:mt-3.5 flex flex-col items-center text-center">
        <h3 className="font-sans text-[10.5px] sm:text-[11px] lg:text-[11.5px] font-bold tracking-[0.18em] text-[#2E2B2B] group-hover:text-[#7B3F42] uppercase transition-colors duration-300">
          {cat.name}
        </h3>
        <span className="block mt-1 sm:mt-1.5 h-[1.5px] w-0 group-hover:w-8 bg-gradient-to-r from-[#7B3F42] to-[#C6A46A] transition-all duration-500 ease-out rounded-full" />
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAF7F2] py-10 sm:py-16 lg:py-20 border-b border-[#D8CFC3] relative overflow-hidden"
    >
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C6A46A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#7B3F42]/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG clip definitions for Cushion-Cut Gemstone Shape */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="cushionCut" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.22,0
              L 0.78,0
              Q 1,0  1,0.22
              L 1,0.78
              Q 1,1  0.78,1
              L 0.22,1
              Q 0,1  0,0.78
              L 0,0.22
              Q 0,0  0.22,0
              Z
            " />
          </clipPath>
          <clipPath id="cushionCutRing" clipPathUnits="objectBoundingBox">
            <path d="
              M 0.22,0
              L 0.78,0
              Q 1,0  1,0.22
              L 1,0.78
              Q 1,1  0.78,1
              L 0.22,1
              Q 0,1  0,0.78
              L 0,0.22
              Q 0,0  0.22,0
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-[1320px] mx-auto px-3.5 sm:px-8 lg:px-10 relative z-10">

        {/* ── Section Header ── */}
        <div
          className={`text-center max-w-xl mx-auto mb-7 sm:mb-12 reveal-up ${
            isVisible ? 'visible' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Sparkles size={12} className="text-[#7B3F42]" />
            <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.28em] text-[#7B3F42] uppercase">
              SHINE YOUR WAY
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#7B3F42] uppercase tracking-[0.08em] font-light">
            OUR COLLECTIONS
          </h2>
          <div className="w-12 h-[1.5px] bg-[#7B3F42] mx-auto mt-2" />
        </div>

        {/* ── MOBILE VIEW: 3-Item Paginated Slider with Cushion-Cut Shape ── */}
        <div className="block sm:hidden">
          <div
            className="overflow-hidden relative px-1 py-1"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {/* Slide 1: 3 Items (RINGS, PENDANTS, EARRINGS) */}
              <div className="w-full shrink-0 grid grid-cols-3 gap-2.5 px-0.5">
                {mobileSlide1.map((cat) => renderCategoryCard(cat))}
              </div>

              {/* Slide 2: Next 3 Items (STUDS, BRACELETS, SETS) */}
              <div className="w-full shrink-0 grid grid-cols-3 gap-2.5 px-0.5">
                {mobileSlide2.map((cat) => renderCategoryCard(cat))}
              </div>
            </div>
          </div>

          {/* Navigation Controls: Chevrons & Pagination Dots */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveSlide(0)}
              disabled={activeSlide === 0}
              aria-label="Previous categories"
              className={`p-1 rounded-full transition-all ${
                activeSlide === 0
                  ? 'text-[#D8CFC3] cursor-not-allowed opacity-40'
                  : 'text-[#7B3F42] hover:bg-[#7B3F42]/10 active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlide(0)}
                aria-label="Slide 1"
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === 0
                    ? 'w-5 h-2 bg-[#7B3F42]'
                    : 'w-2 h-2 bg-[#D8CFC3] hover:bg-[#7B3F42]/50'
                }`}
              />
              <button
                onClick={() => setActiveSlide(1)}
                aria-label="Slide 2"
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === 1
                    ? 'w-5 h-2 bg-[#7B3F42]'
                    : 'w-2 h-2 bg-[#D8CFC3] hover:bg-[#7B3F42]/50'
                }`}
              />
            </div>

            <button
              onClick={() => setActiveSlide(1)}
              disabled={activeSlide === 1}
              aria-label="Next categories"
              className={`p-1 rounded-full transition-all ${
                activeSlide === 1
                  ? 'text-[#D8CFC3] cursor-not-allowed opacity-40'
                  : 'text-[#7B3F42] hover:bg-[#7B3F42]/10 active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── DESKTOP & TABLET VIEW: 6-Column Cushion-Cut Showcase ── */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {collections.map((cat, idx) => (
            <div
              key={cat.id}
              className={`reveal-up ${isVisible ? 'visible' : ''}`}
              style={{
                transitionDelay: isVisible ? `${0.08 * idx}s` : '0s',
              }}
            >
              {renderCategoryCard(cat)}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
