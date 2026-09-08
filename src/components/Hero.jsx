import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';

/**
 * Hero — Mobile Optimized & Touch Swipe Enabled
 * Full-viewport image with high-contrast editorial text overlay.
 */

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=90',
    tag: 'New Collection',
    titleLine1: 'TIMELESS',
    titleLine2: 'ELEGANCE,',
    titleLine3: 'CRAFTED FOR YOU',
    subtitle: 'Handcrafted fine jewelry designed to be cherished for generations.',
    cta: 'EXPLORE COLLECTION',
    ctaCategory: 'ALL',
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90',
    tag: 'Signature Pieces',
    titleLine1: 'RADIANT',
    titleLine2: 'BRILLIANCE,',
    titleLine3: 'MADE TO ENDURE',
    subtitle: '925 Sterling Silver with premium gold plating — crafted to endure.',
    cta: 'SHOP NECKLACES',
    ctaCategory: 'NECKLACES',
  },
  {
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2000&q=90',
    tag: 'Bridal Suites',
    titleLine1: 'CURATED',
    titleLine2: 'SUITES,',
    titleLine3: 'FOR BRIDAL MOMENTS',
    subtitle: "Complete bespoke ensembles tailored for life's grandest celebrations.",
    cta: 'VIEW BRIDAL SETS',
    ctaCategory: 'SETS',
  },
];

export const Hero = () => {
  const { navigateToPage } = useShop();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(t);
  }, [current]);

  const handleNextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(p => (p + 1) % SLIDES.length);
      setAnimating(false);
    }, 450);
  };

  const handlePrevSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length);
      setAnimating(false);
    }, 450);
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      handlePrevSlide();
    } else if (deltaX < -45) {
      handleNextSlide();
    }
    touchStartX.current = null;
  };

  const slide = SLIDES[current];

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-[#FAF7F4] select-none"
      style={{ minHeight: '520px', height: '80vh', maxHeight: '740px' }}
    >
      {/* Background slides */}
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: current === idx ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={s.image}
            alt={s.titleLine1}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Warm editorial gradient — adaptive for mobile and desktop */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(to right, rgba(255,252,250,0.96) 0%, rgba(255,252,250,0.92) 55%, rgba(255,252,250,0.65) 80%, rgba(255,252,250,0.2) 100%)',
        }}
      />

      {/* Left editorial text */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-14 w-full">
          <div
            className={`max-w-[420px] transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            {/* Tag */}
            <span className="hero-tag-animate text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.28em] text-[#9B6668] uppercase mb-2 sm:mb-3 block">
              {slide.tag}
            </span>

            {/* Main heading */}
            <h1
              className="hero-title-animate font-serif text-[#2E2B2B] uppercase leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(1.85rem, 5.5vw, 3.2rem)', fontWeight: 400 }}
            >
              <span>{slide.titleLine1}</span>
              <br />
              <span className="italic font-light text-[#7B3F42]">{slide.titleLine2}</span>
              <br />
              <span>{slide.titleLine3}</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub-animate text-xs sm:text-[13px] font-sans text-[#5C4038] mt-3.5 sm:mt-5 leading-relaxed max-w-[320px]">
              {slide.subtitle}
            </p>

            {/* CTA with Shimmer & Animated Arrow */}
            <button
              onClick={() => navigateToPage('shop', slide.ctaCategory)}
              className="hero-cta-animate luxury-shimmer-btn group mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 font-sans font-semibold text-[11px] tracking-[0.22em] text-white uppercase bg-[#7B3F42] hover:bg-[#623033] py-3.5 px-7 sm:py-4 sm:px-9 rounded-xs transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
            >
              <span>{slide.cta}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide dots with luxury animated width */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 flex justify-center items-center gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ease-out cursor-pointer ${
              current === i
                ? 'w-7 sm:w-8 h-1.5 bg-[#7B3F42] shadow-xs'
                : 'w-2 h-1.5 bg-[#7B3F42]/30 hover:bg-[#7B3F42]/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
