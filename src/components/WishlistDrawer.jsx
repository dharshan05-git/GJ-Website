import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer = () => {
  const { 
    wishlist, 
    wishlistOpen, 
    setWishlistOpen, 
    toggleWishlist, 
    addToCart,
    navigateToProduct
  } = useShop();

  return (
    <>
      <div 
        className={`drawer-backdrop ${wishlistOpen ? 'active' : ''}`} 
        onClick={() => setWishlistOpen(false)} 
      />

      <div className={`cart-drawer ${wishlistOpen ? 'open' : ''}`}>
        
        <div className="p-5 border-b border-[#E8DFD7] flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-[#7A2E3B]" fill="#7A2E3B" />
            <h3 className="font-serif text-xl font-bold text-[#2C2623]">
              YOUR WISHLIST ({wishlist.length})
            </h3>
          </div>
          <button 
            onClick={() => setWishlistOpen(false)}
            className="text-[#736B66] hover:text-[#2C2623] p-1"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#9E958F]">
                <Heart size={32} />
              </div>
              <p className="font-serif text-xl text-[#2C2623]">No saved jewelry yet</p>
              <p className="text-xs text-[#736B66]">Click the heart icon on any product to save items for later.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-[#FAF6F0] rounded-xs border border-[#E8DFD7] items-center">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xs cursor-pointer"
                  onClick={() => {
                    navigateToProduct(item);
                    setWishlistOpen(false);
                  }}
                />
                <div className="flex-1">
                  <h4 
                    onClick={() => {
                      navigateToProduct(item);
                      setWishlistOpen(false);
                    }}
                    className="font-serif text-sm font-semibold text-[#2C2623] cursor-pointer hover:text-[#7A2E3B]"
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-[#7A2E3B] mt-0.5">
                    ₹ {item.price.toLocaleString('en-IN')}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                      className="bg-[#7A2E3B] text-white text-[10px] font-bold px-3 py-1 rounded-xs uppercase tracking-wider flex items-center gap-1"
                    >
                      <ShoppingBag size={11} /> Move to Bag
                    </button>
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="text-[#9E958F] hover:text-[#7A2E3B] p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};
