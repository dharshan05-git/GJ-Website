import React, { useRef, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const SignatureProduct = () => {
  const {
    navigateToProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    triggerFlyToCart,
  } = useShop();

  const imgRef = useRef(null);
  const [imgColRef, imgColVisible] = useScrollAnimation(0.1);
  const [panelRef, panelVisible] = useScrollAnimation(0.1);
  const [popHeart, setPopHeart] = useState(false);

  // Single signature product
  const product = PRODUCTS.find(p => p.badge === 'SIGNATURE' && p.category === 'EARRINGS') ||
                  PRODUCTS.find(p => p.badge === 'SIGNATURE') ||
                  PRODUCTS[0];

  const [selectedMetal, setSelectedMetal] = useState(product?.metals?.[0] || '925 Sterling Silver');
  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (!product) return null;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setPopHeart(true);
    toggleWishlist(product);
    setTimeout(() => setPopHeart(false), 450);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (imgRef.current && product.image) {
      const fromRect = imgRef.current.getBoundingClientRect();
      triggerFlyToCart({ image: product.image, fromRect });
    }
    setTimeout(() => addToCart({ ...product, selectedMetal }), 80);
  };

  return (
    <section className="border-b border-[#D8CFC3] overflow-hidden bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

        {/* Left: Full-bleed Product Image */}
        <div
          ref={imgColRef}
          className={`reveal-left ${imgColVisible ? 'visible' : ''}`}
        >
          <div
            ref={imgRef}
            onClick={() => navigateToProduct(product)}
            className="relative overflow-hidden bg-[#F5F1EA] cursor-pointer group min-h-[420px] lg:min-h-[520px] h-full"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out absolute inset-0"
            />
            {product.hoverImage && (
              <img
                src={product.hoverImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}

            {/* SIGNATURE Gleaming Badge */}
            {product.badge === 'SIGNATURE' && (
              <div className="absolute top-4 left-4 z-10">
                <span className="badge-gleam bg-gradient-to-r from-[#7B3F42] via-[#C6A46A] to-[#7B3F42] text-white text-[9px] font-bold tracking-[0.22em] uppercase px-3.5 py-1.5 shadow-md border border-white/20 flex items-center gap-1.5">
                  <Sparkles size={10} className="text-[#F5E8D0] animate-spin-slow" />
                  <span>SIGNATURE</span>
                </span>
              </div>
            )}

            {/* Wishlist with pop animation */}
            <button
              onClick={handleWishlistClick}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md z-10 transition-all duration-300 hover:scale-115 active:scale-90 ${
                isWishlisted ? 'text-[#7B3F42]' : 'text-[#8A726A] hover:text-[#7B3F42]'
              } ${popHeart ? 'animate-heart-pop' : ''}`}
              aria-label="Wishlist"
            >
              <Heart size={16} fill={isWishlisted ? '#7B3F42' : 'none'} strokeWidth={1.8} />
            </button>

            {/* Hover Quick View */}
            <div className="absolute inset-x-0 bottom-0 flex opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                className="flex-1 bg-white/95 hover:bg-white text-[#2E2B2B] hover:text-[#7B3F42] text-[10px] font-bold tracking-wider uppercase py-3 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Eye size={12} className="transition-transform duration-200 group-hover:scale-110" />
                <span>QUICK VIEW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Wine-colored info panel */}
        <div
          ref={panelRef}
          className={`bg-[#7B3F42] flex flex-col justify-center px-6 sm:px-14 lg:px-16 pt-8 sm:pt-12 pb-10 sm:pb-16 reveal-right ${panelVisible ? 'visible' : ''}`}
        >

          {/* Label */}
          <p className={`text-[9.5px] sm:text-[10px] font-bold tracking-[0.28em] text-[#C6A46A] uppercase mb-3 sm:mb-4 reveal-up delay-100 ${panelVisible ? 'visible' : ''} flex items-center gap-2`}>
            <span className="w-5 h-px bg-[#C6A46A]" />
            <span>OUR SIGNATURE PIECE</span>
          </p>

          {/* Product Name */}
          <h2 className={`font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-light leading-tight mb-3 sm:mb-4 reveal-up delay-200 ${panelVisible ? 'visible' : ''}`}>
            {product.name}
          </h2>

          {/* Italic tagline */}
          <p className={`font-serif italic text-[#C6A46A] text-base sm:text-xl mb-4 sm:mb-5 leading-snug reveal-up delay-300 ${panelVisible ? 'visible' : ''}`}>
            Where every curve tells a story.
          </p>

          {/* Description */}
          {product.description && (
            <p className={`text-xs sm:text-sm text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md reveal-up delay-400 ${panelVisible ? 'visible' : ''}`}>
              {product.description}
            </p>
          )}

          {/* ADD TO BAG button with Luxury Shimmer */}
          <div className={`reveal-up delay-500 ${panelVisible ? 'visible' : ''}`}>
            <button
              onClick={handleAddToCart}
              className="luxury-shimmer-btn group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-[#7B3F42] hover:text-[#623033] text-[11px] font-bold tracking-[0.25em] uppercase px-9 py-4 hover:bg-[#FAF6F0] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <ShoppingBag size={14} className="transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
              <span>ADD TO BAG</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
