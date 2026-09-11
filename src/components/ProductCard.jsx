import React, { useRef, useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * ProductCard — Exactly matching Reference Image 1:
 * Clean square image, burgundy/gold badge top-left, white circular wishlist top-right,
 * elegant serif title and burgundy bold price below.
 */
export const ProductCard = ({ product }) => {
  const {
    navigateToProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    triggerFlyToCart,
  } = useShop();

  const imgRef = useRef(null);
  const isWishlisted = isInWishlist(product.id);
  const [popHeart, setPopHeart] = useState(false);

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
    setTimeout(() => addToCart(product), 80);
  };

  const isGoldBadge = product.badge === 'SIGNATURE' || product.badge === 'LUXURY' || product.badge === 'BESTSELLER';

  // Driven by the admin panel's enable/disable switch and the live stock count.
  const isUnavailable = product.isAvailable === false || product.stock === 0;
  const unavailableLabel = product.availabilityLabel || (product.isAvailable === false ? 'UNAVAILABLE' : 'OUT OF STOCK');

  return (
    <div className="product-card-lift luxury-card-interactive group flex flex-col transition-all duration-300 select-none">

      {/* ── Image Stage ── */}
      <div
        ref={imgRef}
        className={`relative overflow-hidden bg-[#F5F1EA] aspect-square cursor-pointer rounded-xs ${isUnavailable ? 'opacity-70' : ''}`}
        onClick={() => navigateToProduct(product)}
      >
        {/* Top-Right: Circular White Wishlist Button — matching Image 1 */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
            isWishlisted ? 'text-[#7B3F42]' : 'text-[#2E2B2B] hover:text-[#7B3F42]'
          } ${popHeart ? 'animate-heart-pop' : ''}`}
          aria-label="Wishlist"
        >
          <Heart size={13} fill={isWishlisted ? '#7B3F42' : 'none'} strokeWidth={1.6} />
        </button>

        {/* Main Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Hover image swap for desktop */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block"
            loading="lazy"
          />
        )}

        {/* Top-Left Badge — matching Image 1 */}
        {product.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-xs ${
              isGoldBadge
                ? 'bg-[#C6A46A] text-[#2E2B2B] rounded-full px-2.5'
                : 'bg-[#622329] text-white rounded-none'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Sold-out / disabled veil */}
        {isUnavailable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55 backdrop-blur-[1px] pointer-events-none">
            <span className="bg-[#2E2B2B] text-white text-[9px] sm:text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 shadow-sm">
              {unavailableLabel}
            </span>
          </div>
        )}

        {/* Desktop Hover Quick Actions / Mobile Tap Bar */}
        <div className="absolute inset-x-0 bottom-0 flex gap-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-y-2 sm:group-hover:translate-y-0">
          <button
            onClick={e => { e.stopPropagation(); setQuickViewProduct(product); }}
            className="flex-1 bg-white/95 hover:bg-white text-[#2E2B2B] hover:text-[#7B3F42] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase py-2 flex items-center justify-center gap-1 transition-colors border-t border-[#D8CFC3] shadow-xs active:bg-[#F5F1EA]"
          >
            <Eye size={12} /> <span className="hidden xs:inline">QUICK VIEW</span><span className="xs:hidden">VIEW</span>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isUnavailable}
            className={`w-10 flex items-center justify-center transition-colors shadow-xs ${
              isUnavailable
                ? 'bg-[#B6ADA6] text-white cursor-not-allowed'
                : 'bg-[#7B3F42] hover:bg-[#623033] text-white active:scale-95'
            }`}
            title={isUnavailable ? unavailableLabel : 'Add to Cart'}
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>

      {/* ── Info Area below Image — matching Image 1 ── */}
      <div
        className="pt-2.5 sm:pt-3 pb-1 flex flex-col cursor-pointer"
        onClick={() => navigateToProduct(product)}
      >
        {/* Title in Elegant Serif Font */}
        <h3 className="font-serif text-[12.5px] sm:text-[14px] text-[#2E2B2B] group-hover:text-[#7B3F42] font-normal tracking-normal transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Price directly below Title in bold burgundy */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-sans text-[12px] sm:text-[13px] font-bold text-[#7B3F42]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-[10px] text-[#8A726A] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
