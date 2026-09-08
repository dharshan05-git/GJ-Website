import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ShieldCheck, Gem } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setSizeGuideOpen,
    triggerFlyToCart,
  } = useShop();

  const imgRef = React.useRef(null);

  if (!quickViewProduct) return null;

  const [selectedPlating, setSelectedPlating] = useState(quickViewProduct.plating?.[0] || '18K White Gold');
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || "7");
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (imgRef.current && quickViewProduct.image) {
      const fromRect = imgRef.current.getBoundingClientRect();
      triggerFlyToCart({ image: quickViewProduct.image, fromRect });
    }
    setTimeout(() => {
      addToCart(quickViewProduct, selectedPlating, selectedSize, quantity);
      setQuickViewProduct(null);
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden z-10 border border-[#E8DFD7] max-h-[88vh] sm:max-h-[90vh] flex flex-col md:flex-row animate-fadeIn">
        
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1A1615] hover:bg-[#7B3F42] hover:text-white transition-colors shadow-xs"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Left Image Showcase */}
        <div ref={imgRef} className="md:w-1/2 bg-[#FAF6F0] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#EDE5DC] shrink-0">
          <img 
            src={quickViewProduct.image} 
            alt={quickViewProduct.name}
            className="w-full max-h-[200px] sm:max-h-[380px] object-cover rounded-lg shadow-sm"
          />
        </div>

        {/* Right Info */}
        <div className="md:w-1/2 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-3.5 sm:space-y-4">
          <div>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-[#7B3F42] uppercase font-bold">
              {quickViewProduct.category}
            </span>
            <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#1A1615] uppercase mt-0.5">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
              <span className="text-lg sm:text-xl font-bold text-[#7B3F42]">
                ₹ {quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs sm:text-sm text-[#9E958F] line-through">
                  ₹ {quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {quickViewProduct.piecesIncluded && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {quickViewProduct.piecesIncluded.map((piece, idx) => (
                  <span key={idx} className="text-[9.5px] font-semibold text-[#7B3F42] bg-[#FAF6F0] px-2 py-0.5 rounded-xs border border-[#EDE5DC]">
                    ✦ {piece}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[11px] sm:text-xs text-[#7A7270] mt-2 sm:mt-3 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>

          {/* Metal (Fixed) */}
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-[#1A1615] uppercase tracking-wider mb-1">
              Metal
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-[#FAF6F0] border border-[#EDE5DC] rounded-xs">
              <Gem size={13} className="text-[#7B3F42]" />
              <span className="text-xs font-semibold text-[#1A1615]">925 Sterling Silver</span>
            </div>
          </div>

          {/* Plating Selector */}
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-[#1A1615] uppercase tracking-wider mb-1.5">
              Plating: <span className="font-normal text-[#7B3F42]">{selectedPlating}</span>
            </label>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {(quickViewProduct.plating || ['18K White Gold', '18K Rose Gold', '18K Gold']).map((plating, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPlating(plating)}
                  className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded-xs font-medium transition-all ${
                    selectedPlating === plating 
                      ? 'border-[#7B3F42] bg-[#7B3F42] text-white shadow-xs' 
                      : 'border-[#EDE5DC] text-[#1A1615] hover:border-[#7B3F42]'
                  }`}
                >
                  {plating}
                </button>
              ))}
            </div>
          </div>

          {/* Ring Size Picker */}
          {quickViewProduct.sizes && quickViewProduct.sizes[0] !== "Standard" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-[#1A1615] uppercase tracking-wider">
                  Ring Size (US):
                </label>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[10px] sm:text-[11px] text-[#7B3F42] underline font-semibold"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {quickViewProduct.sizes.map((sz, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 text-xs border rounded-xs font-semibold transition-all ${
                      selectedSize === sz 
                        ? 'border-[#7B3F42] bg-[#7B3F42] text-white' 
                        : 'border-[#EDE5DC] text-[#1A1615] hover:border-[#7B3F42]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="pt-2 border-t border-[#EDE5DC] space-y-2.5">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#7B3F42] hover:bg-[#623033] text-white py-2.5 sm:py-3 rounded-xs flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <ShoppingBag size={15} />
                <span>ADD TO BAG</span>
              </button>

              <button 
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-2.5 sm:p-3 border rounded-xs transition-colors shrink-0 ${
                  isWishlisted ? 'border-[#7B3F42] text-[#7B3F42] bg-[#FAF6F0]' : 'border-[#EDE5DC] text-[#7A7270] hover:text-[#7B3F42]'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? '#7B3F42' : 'none'} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9.5px] sm:text-[10px] text-[#736B66] uppercase">
              <ShieldCheck size={13} className="text-[#C6A46A]" />
              <span>Certified 925 Silver &amp; Insured Delivery</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
