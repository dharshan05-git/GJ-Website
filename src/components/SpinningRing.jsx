import React from 'react';

/**
 * SpinningRing component renders a 3D animated luxury jewelry ring
 * with metallic gold gradient pathing, sparkling solitaire diamond facet accents,
 * and realistic rotation animations.
 */
export const SpinningRing = ({ position = 'top-right', className = '' }) => {
  const isTopRight = position === 'top-right';

  return (
    <div 
      className={`spinning-ring-wrapper ${isTopRight ? 'spinning-ring-top-right' : 'spinning-ring-bottom-left'} ${className}`}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full filter drop-shadow-2xl"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <defs>
          {/* Gold Metallic Gradient */}
          <linearGradient id={`goldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="60%" stopColor="#AA7C11" />
            <stop offset="90%" stopColor="#F4E5B8" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Diamond Shimmer Gradient */}
          <radialGradient id={`diamondGlow-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#E0F7FA" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#B2EBF2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
          
          {/* Inner Ring Specular Shadow */}
          <radialGradient id={`ringShadow-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#3E240B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7A2E3B" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* Ambient Ring Glow Halo */}
        <circle 
          cx="100" 
          cy="100" 
          r="72" 
          fill="none" 
          stroke={`url(#goldGrad-${position})`} 
          strokeWidth="3" 
          opacity="0.3" 
        />

        {/* Main 3D Solid Gold Ring Body */}
        <circle 
          cx="100" 
          cy="108" 
          r="58" 
          fill="none" 
          stroke={`url(#goldGrad-${position})`} 
          strokeWidth="14"
          strokeDasharray="360"
          strokeLinecap="round"
        />

        {/* Inner Ring Bevel Shadow */}
        <circle 
          cx="100" 
          cy="108" 
          r="51" 
          fill="none" 
          stroke={`url(#ringShadow-${position})`} 
          strokeWidth="3"
        />

        {/* Micro-pave Diamond Accents on Band */}
        <g opacity="0.9">
          {[20, 50, 80, 110, 140, 220, 250, 280, 310, 340].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 100 + 58 * Math.cos(rad);
            const y = 108 + 58 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#FFFFFF"
                style={{
                  animation: `diamondShine 3s infinite ease-in-out ${i * 0.2}s`
                }}
              />
            );
          })}
        </g>

        {/* Solitaire Diamond Crown Setting Mount (Prongs) */}
        <g transform="translate(100, 44)">
          {/* Prongs */}
          <path d="M-12 8 L-8 -10 L-5 -10 L-9 8 Z" fill={`url(#goldGrad-${position})`} />
          <path d="M12 8 L8 -10 L5 -10 L9 8 Z" fill={`url(#goldGrad-${position})`} />
          <path d="M-4 8 L-2 -12 L2 -12 L4 8 Z" fill={`url(#goldGrad-${position})`} />
          
          {/* Solitaire Diamond Gemstone Facets */}
          <polygon points="0,-22 14,-10 0,-2 -14,-10" fill="#FFFFFF" opacity="0.95" />
          <polygon points="0,-22 14,-10 8,8 -8,8 -14,-10" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
          <polygon points="-14,-10 0,-2 8,8" fill="#E2F5FC" opacity="0.7" />
          <polygon points="14,-10 0,-2 -8,8" fill="#B3E5FC" opacity="0.8" />
          <polygon points="0,-22 0,-2 0,8" fill="#FFFFFF" opacity="0.9" />

          {/* Diamond Sparkle Flare */}
          <circle cx="0" cy="-12" r="18" fill={`url(#diamondGlow-${position})`} />
          <path 
            d="M0 -22 L2 -14 L10 -12 L2 -10 L0 -2 L-2 -10 L-10 -12 L-2 -14 Z" 
            fill="#FFFFFF" 
            style={{ animation: 'diamondShine 2s infinite ease-in-out' }}
          />
        </g>
      </svg>
    </div>
  );
};
