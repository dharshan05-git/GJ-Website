import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setSizeGuideOpen
  } = useShop();

  if (!quickViewProduct) return null;

  const [selectedMetal, setSelectedMetal] = useState(quickViewProduct.metals[0]);
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || "7");
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden z-10 border border-[#E8DFD7] max-h-[90vh] flex flex-col md:flex-row">
        
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2C2623] hover:bg-[#7A2E3B] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left Image Showcase */}
        <div className="md:w-1/2 bg-[#FAF6F0] relative overflow-hidden flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E8DFD7]">
          <img 
            src={quickViewProduct.image} 
            alt={quickViewProduct.name}
            className="w-full max-h-[380px] object-cover rounded-xs shadow-md"
          />
        </div>

        {/* Right Info */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] tracking-widest text-[#7A2E3B] uppercase font-bold">
              {quickViewProduct.category}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2C2623] uppercase mt-1">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-[#7A2E3B]">
                ₹ {quickViewProduct.price.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#9E958F] line-through">
                  ₹ {quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#736B66] mt-3 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>

          {/* Metal Finish Selector */}
          <div>
            <label className="block text-xs font-bold text-[#2C2623] uppercase tracking-wider mb-2">
              Metal Option: <span className="font-normal text-[#7A2E3B]">{selectedMetal}</span>
            </label>
            <div className="flex gap-2">
              {quickViewProduct.metals.map((metal, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMetal(metal)}
                  className={`text-xs px-3 py-1.5 border rounded-xs font-medium transition-all ${
                    selectedMetal === metal 
                      ? 'border-[#7A2E3B] bg-[#7A2E3B] text-white shadow-xs' 
                      : 'border-[#E8DFD7] text-[#2C2623] hover:border-[#7A2E3B]'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          {/* Ring Size Picker */}
          {quickViewProduct.sizes && quickViewProduct.sizes[0] !== "Standard" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#2C2623] uppercase tracking-wider">
                  Ring Size (US):
                </label>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[11px] text-[#7A2E3B] underline font-semibold"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2">
                {quickViewProduct.sizes.map((sz, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-9 h-9 text-xs border rounded-xs font-semibold transition-all ${
                      selectedSize === sz 
                        ? 'border-[#7A2E3B] bg-[#7A2E3B] text-white' 
                        : 'border-[#E8DFD7] text-[#2C2623] hover:border-[#7A2E3B]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="pt-2 border-t border-[#E8DFD7] space-y-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  addToCart(quickViewProduct, selectedMetal, selectedSize, quantity);
                  setQuickViewProduct(null);
                }}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG</span>
              </button>

              <button 
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 border rounded-xs transition-colors ${
                  isWishlisted ? 'border-[#7A2E3B] text-[#7A2E3B] bg-[#FAF6F0]' : 'border-[#E8DFD7] text-[#736B66] hover:text-[#7A2E3B]'
                }`}
              >
                <Heart size={18} fill={isWishlisted ? '#7A2E3B' : 'none'} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#736B66] uppercase">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span>Certified 18K Solid Gold & Insured Delivery</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
