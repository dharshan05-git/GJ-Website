import React, { useState, useEffect } from 'react';
import { GevariyaLogo } from './GevariyaLogo';
import { Sparkles } from 'lucide-react';

/**
 * 4K Ultra-HD Luxury Silk Curtain Loader
 * 
 * Features:
 * - Razor-sharp 4K geometric precision pure vector SVG logo rendering
 * - Soft, elegant matte-silk texture with reduced subtle shine
 * - Crisp subpixel anti-aliasing with luxury metallic drop-shadow
 * - Ultra-clean wide 3D S-curve billowing wavy silk curtains in brand pink (#C47D8F)
 * - Smooth majestic zoom without raster-downsampling blur
 * - Minimal "CLICK TO ENTER" hint & instant click-to-skip
 */
export const CurtainLoader = ({ onComplete }) => {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Step 1: Curtains wave softly, then gracefully part to reveal the logo (0.5s)
    const openTimer = setTimeout(() => {
      setCurtainOpen(true);
    }, 500);

    // Step 2: Auto-dismiss after 5.2 seconds
    const finishTimer = setTimeout(() => {
      handleDismiss();
    }, 5200);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleDismiss = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[99999] cursor-pointer select-none overflow-hidden bg-[#FAF7F2] flex items-center justify-center transition-opacity duration-600 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      title="Click to enter"
    >
      {/* ── Center Stage: Ambient Glow & 4K Ultra-HD SVG Logo (Scaled for Mobile & Desktop) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-[90vw]">
        {/* Soft Luxury Aura Glow */}
        <div className="absolute w-[320px] sm:w-[540px] h-[320px] sm:h-[540px] bg-[#C47D8F]/15 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

        {/* 4K Razor-Sharp Majestic Zooming Logo (Set back on mobile for optimal framing) */}
        <div
          className="relative flex items-center justify-center select-none max-w-[220px] sm:max-w-[300px] md:max-w-[340px]"
          style={{
            animation: 'curtainLogoZoom4K 5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            filter: 'drop-shadow(0 10px 24px rgba(123, 63, 66, 0.14)) drop-shadow(0 2px 4px rgba(198, 164, 106, 0.16))',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Mobile size: 170px, Desktop: 250px */}
          <div className="block sm:hidden">
            <GevariyaLogo size={170} />
          </div>
          <div className="hidden sm:block">
            <GevariyaLogo size={250} />
          </div>
        </div>

        {/* Clean "CLICK TO ENTER" hint */}
        <div className="mt-8 sm:mt-12 flex items-center gap-2 text-[#7B3F42]/80 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.26em] uppercase animate-pulse">
          <Sparkles size={11} className="text-[#C6A46A]" />
          <span>CLICK TO ENTER</span>
        </div>
      </div>

      {/* ── Left Curtain (Clean & Very Wavy Billowing Silk) ── */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[52%] z-20 transition-all duration-[2200ms] ease-[cubic-bezier(0.7,0,0.15,1)]"
        style={{
          transformOrigin: 'left top',
          transform: curtainOpen ? 'scaleX(0.08) translateX(-30%)' : 'scaleX(1) translateX(0%)',
          willChange: 'transform',
        }}
      >
        <div className="relative w-full h-full overflow-hidden shadow-[25px_0_50px_rgba(46,20,28,0.35)]">
          {/* Layer 1: Clean, Wide, Ultra-Smooth 3D Wave Folds */}
          <div
            className="absolute inset-0 animate-clean-wave-left"
            style={{
              background: `
                repeating-linear-gradient(
                  to right,
                  #9B4F61 0px,
                  #B8697C 30px,
                  #C47D8F 70px,
                  #E5A3B3 115px,
                  #F7CBD6 145px,
                  #E5A3B3 175px,
                  #C47D8F 220px,
                  #B8697C 260px,
                  #9B4F61 290px
                )
              `,
              backgroundSize: '290px 100%',
            }}
          />

          {/* Layer 2: Soft Natural Vertical Drape Light Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.14) 0%,
                  rgba(255, 255, 255, 0.08) 18%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.06) 78%,
                  rgba(0, 0, 0, 0.18) 100%
                )
              `,
            }}
          />

          {/* Layer 3: Dynamic Soft Silk Sheen Wave with subtle, reduced matte shine */}
          <div
            className="absolute inset-0 pointer-events-none animate-satin-gleam"
            style={{
              background: `
                linear-gradient(
                  115deg,
                  rgba(255, 255, 255, 0.12) 0%,
                  transparent 35%,
                  rgba(255, 255, 255, 0.08) 65%,
                  transparent 100%
                )
              `,
            }}
          />

          {/* Clean Gold Seam Edge Trim */}
          <div className="absolute top-0 bottom-0 right-0 w-[2.5px] bg-gradient-to-b from-[#FFF5EA] via-[#C6A46A] to-[#FFF5EA] opacity-85 shadow-sm" />
        </div>
      </div>

      {/* ── Right Curtain (Clean & Very Wavy Billowing Silk) ── */}
      <div
        className="absolute top-0 bottom-0 right-0 w-[52%] z-20 transition-all duration-[2200ms] ease-[cubic-bezier(0.7,0,0.15,1)]"
        style={{
          transformOrigin: 'right top',
          transform: curtainOpen ? 'scaleX(0.08) translateX(30%)' : 'scaleX(1) translateX(0%)',
          willChange: 'transform',
        }}
      >
        <div className="relative w-full h-full overflow-hidden shadow-[-25px_0_50px_rgba(46,20,28,0.35)]">
          {/* Layer 1: Clean, Wide, Ultra-Smooth 3D Wave Folds */}
          <div
            className="absolute inset-0 animate-clean-wave-right"
            style={{
              background: `
                repeating-linear-gradient(
                  to left,
                  #9B4F61 0px,
                  #B8697C 30px,
                  #C47D8F 70px,
                  #E5A3B3 115px,
                  #F7CBD6 145px,
                  #E5A3B3 175px,
                  #C47D8F 220px,
                  #B8697C 260px,
                  #9B4F61 290px
                )
              `,
              backgroundSize: '290px 100%',
            }}
          />

          {/* Layer 2: Soft Natural Vertical Drape Light Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.14) 0%,
                  rgba(255, 255, 255, 0.08) 18%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.06) 78%,
                  rgba(0, 0, 0, 0.18) 100%
                )
              `,
            }}
          />

          {/* Layer 3: Dynamic Soft Silk Sheen Wave with subtle, reduced matte shine */}
          <div
            className="absolute inset-0 pointer-events-none animate-satin-gleam"
            style={{
              background: `
                linear-gradient(
                  245deg,
                  rgba(255, 255, 255, 0.12) 0%,
                  transparent 35%,
                  rgba(255, 255, 255, 0.08) 65%,
                  transparent 100%
                )
              `,
            }}
          />

          {/* Clean Gold Seam Edge Trim */}
          <div className="absolute top-0 bottom-0 left-0 w-[2.5px] bg-gradient-to-b from-[#FFF5EA] via-[#C6A46A] to-[#FFF5EA] opacity-85 shadow-sm" />
        </div>
      </div>

      {/* Embedded Styles for Clean Fluid Wave Animation & 4K Logo Zoom */}
      <style>{`
        @keyframes cleanWaveLeft {
          0%, 100% {
            background-position: 0px 0;
            transform: scaleY(1);
          }
          50% {
            background-position: 45px 0;
            transform: scaleY(1.015);
          }
        }
        @keyframes cleanWaveRight {
          0%, 100% {
            background-position: 0px 0;
            transform: scaleY(1);
          }
          50% {
            background-position: -45px 0;
            transform: scaleY(1.015);
          }
        }
        @keyframes satinGleam {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.24; transform: scale(1.015); }
        }

        .animate-clean-wave-left {
          animation: cleanWaveLeft 6s ease-in-out infinite;
          will-change: background-position, transform;
        }
        .animate-clean-wave-right {
          animation: cleanWaveRight 6.2s ease-in-out infinite;
          will-change: background-position, transform;
        }
        .animate-satin-gleam {
          animation: satinGleam 5s ease-in-out infinite;
        }

        /* 4K Ultra-Sharp Zoom without Blur Downsampling */
        @keyframes curtainLogoZoom4K {
          0% {
            transform: scale(0.86);
            opacity: 0.15;
          }
          18% {
            opacity: 1;
          }
          85% {
            transform: scale(1.18);
            opacity: 1;
          }
          100% {
            transform: scale(1.24);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
