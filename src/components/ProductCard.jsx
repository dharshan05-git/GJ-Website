import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product }) => {
  const { 
    navigateToProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useShop();

  const isWishlisted = isInWishlist(product.id);

  // Badge styling matching Skyra screenshot
  const getBadgeStyle = (badge) => {
    if (badge === 'SIGNATURE') return { bg: '#D4AF37', text: '#1A1615' }; // Gold
    if (badge === 'HOT') return { bg: '#7A2E3B', text: '#FFFFFF' }; // Burgundy
    if (badge === 'NEW') return { bg: '#2C2623', text: '#FFFFFF' }; // Dark
    return { bg: '#7A2E3B', text: '#FFFFFF' };
  };

  const badgeObj = product.badge ? getBadgeStyle(product.badge) : null;

  return (
    <div className="group bg-white border border-[#E8DFD7] flex flex-col transition-all duration-300 hover:shadow-lg">
      
      {/* Cover Image Container */}
      <div className="relative overflow-hidden bg-[#FAF6F0]" style={{ aspectRatio: '1 / 1' }}>
        
        {/* Skyra Style Top Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span 
              className="text-[10px] font-bold tracking-widest px-2.5 py-0.5 uppercase shadow-xs"
              style={{ backgroundColor: badgeObj.bg, color: badgeObj.text }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-all ${
            isWishlisted ? 'text-[#7A2E3B]' : 'text-[#736B66] hover:text-[#7A2E3B]'
          } shadow-xs`}
          aria-label="Toggle Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#7A2E3B' : 'none'} />
        </button>

        {/* Single Cover Image */}
        <img 
          src={product.image} 
          alt={product.name}
          onClick={() => navigateToProduct(product)}
          className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => setQuickViewProduct(product)}
            className="w-full bg-white/90 hover:bg-white text-[#2C2623] text-[11px] font-bold py-2 flex items-center justify-center gap-1.5 uppercase tracking-wider transition-colors shadow-sm"
          >
            <Eye size={13} /> QUICK VIEW
          </button>
        </div>

      </div>

      {/* Cover Page & Price Info Only (matching Skyra screenshot) */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left bg-white border-t border-[#E8DFD7]/40">
        <div>
          <h3 
            onClick={() => navigateToProduct(product)}
            className="font-serif text-base font-medium tracking-wide text-[#2C2623] hover:text-[#7A2E3B] cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>
          
          <div className="mt-1 font-sans text-sm font-bold text-[#7A2E3B]">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Add to bag button */}
        <button 
          onClick={() => addToCart(product)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 font-semibold uppercase tracking-widest text-[11px] py-2 bg-[#FAF6F0] hover:bg-[#7A2E3B] text-[#7A2E3B] hover:text-white border border-[#E8DFD7] hover:border-[#7A2E3B] transition-all duration-300"
        >
          <ShoppingBag size={13} /> ADD TO BAG
        </button>
      </div>

    </div>
  );
};
