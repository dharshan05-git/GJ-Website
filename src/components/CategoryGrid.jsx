import React from 'react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowUpRight, Sparkles } from 'lucide-react';

/**
 * CategoryGrid — "OUR COLLECTIONS" with Cushion-Cut Gemstone Shape & Reversible Slow Rise Animation
 * Optimized for mobile touch devices and all screen sizes.
 */
export const CategoryGrid = () => {
  const { navigateToPage } = useShop();

  const collections = CATEGORIES.filter(c =>
    ['RINGS', 'NECKLACES', 'EARRINGS', 'BRACELETS', 'SETS'].includes(c.id)
  );

  const [sectionRef, isVisible] = useScrollAnimation(0.12, '0px 0px -60px 0px', false);

  return (
    <section
      ref={sectionRef}
      className="bg-[#E8D5CE] py-14 sm:py-24 border-b border-[#DBC5B8] relative overflow-hidden"
    >
      {/* Ambient luxury lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C6A46A]/20 rounded-full blur-3xl pointer-events-none" />

      {/* SVG clip definitions for Cushion-Cut Gemstone Shape */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
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

      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 relative z-10">

        {/* ── Header ── */}
        <div
          className={`mb-10 sm:mb-14 text-center sm:text-left collection-header-arise ${
            isVisible ? 'visible' : ''
          }`}
        >
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Sparkles size={13} className="text-[#7B3F42] animate-pulse" />
            <span className="text-[9.5px] sm:text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block">
              CURATED HAUTE JOAILLERIE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2B2B] uppercase tracking-wider font-light flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span>OUR</span>
            <span className="italic font-normal text-[#7B3F42]">COLLECTIONS</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#7B3F42] via-[#C6A46A] to-transparent mt-3 mx-auto sm:mx-0 transition-all duration-700" />
        </div>

        {/* ── 5-Column Cushion-Cut Grid (Responsive on Mobile) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-7 lg:gap-9">
          {collections.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => navigateToPage('shop', cat.id)}
              className={`collection-arise-up ${
                idx === 4 ? 'col-span-2 sm:col-span-1 max-w-[220px] sm:max-w-none mx-auto w-full' : ''
              } ${isVisible ? 'visible' : ''}`}
              style={{
                transitionDelay: isVisible ? `${0.12 * idx}s` : '0s',
              }}
            >
              {/* Inner wrapper handles hover lift independently from scroll animation */}
              <div className="group cursor-pointer flex flex-col items-center select-none transition-transform duration-500 hover:-translate-y-2 active:scale-98">

                {/* Square container — paddingBottom 100% maintains 1:1 ratio */}
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>

                  {/* Gold/burgundy halo glow ring */}
                  <div
                    className="absolute transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-108"
                    style={{
                      clipPath: 'url(#cushionCutRing)',
                      borderRadius: '28px',
                      background: 'linear-gradient(135deg, #C6A46A 0%, #7B3F42 50%, #C6A46A 100%)',
                      inset: '-5px',
                      zIndex: 0,
                      filter: 'drop-shadow(0 10px 20px rgba(123, 63, 66, 0.35))',
                    }}
                  />

                  {/* Image Stage — clipped to cushion-cut shape */}
                  <div
                    className="absolute inset-0 overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-2xl bg-[#FAF6F0]"
                    style={{
                      clipPath: 'url(#cushionCut)',
                      borderRadius: '24px',
                      zIndex: 1,
                    }}
                  >
                    {/* Continuous ambient gleam passing through */}
                    <div className="category-continuous-gleam" />

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

                    {/* Floating Micro-Badge on Hover ("EXPLORE ↗") */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                      <span className="bg-[#2E2B2B]/85 backdrop-blur-sm text-white text-[9px] font-sans font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-md flex items-center gap-1 border border-white/20">
                        <span>EXPLORE</span>
                        <ArrowUpRight size={11} className="text-[#C6A46A]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Title & Micro-Line Underline */}
                <div className="mt-3 sm:mt-4 flex flex-col items-center">
                  <h3 className="font-sans text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] text-[#2E2B2B] group-hover:text-[#7B3F42] uppercase text-center transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <span className="block mt-1 sm:mt-1.5 h-[1.5px] w-0 group-hover:w-10 bg-gradient-to-r from-[#7B3F42] to-[#C6A46A] transition-all duration-500 ease-out rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
