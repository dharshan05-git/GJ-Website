import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import * as api from '../services/api';

export const CartDrawer = () => {
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateCartQty,
    navigateToPage,
    setCheckoutOpen,
    settings
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [promoError, setPromoError] = useState('');

  // The backend owns the coupon rules, so the drawer asks it rather than
  // hard-coding which codes are valid.
  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    try {
      const result = await api.validateCoupon(code, cartTotal);
      setDiscount(result.discount);
      setPromoApplied(true);
    } catch (error) {
      setDiscount(0);
      setPromoApplied(false);
      setPromoError(error.message);
    }
  };

  const freeShippingThreshold = settings?.commerce?.freeShippingThreshold ?? 1500;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  const finalTotal = Math.max(0, cartTotal - discount);

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`drawer-backdrop ${cartOpen ? 'active' : ''}`} 
        onClick={() => setCartOpen(false)} 
      />

      {/* Slide-out Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-[#EDE5DC] flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#8B5E6C]" />
            <h3 className="font-serif text-xl font-bold text-[#1A1615]">
              YOUR SHOPPING BAG ({cartCount})
            </h3>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="text-[#7A7270] hover:text-[#1A1615] p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Tracker */}
        <div className="bg-[#FAF6F0] px-5 py-3 border-b border-[#EDE5DC] text-xs">
          {cartTotal >= freeShippingThreshold ? (
            <p className="text-[#8B5E6C] font-semibold flex items-center gap-1.5">
              <Truck size={15} /> YOU QUALIFY FOR FREE INSURED SHIPPING!
            </p>
          ) : (
            <p className="text-[#7A7270]">
              Add <span className="font-bold text-[#8B5E6C]">₹{(freeShippingThreshold - cartTotal).toLocaleString('en-IN')}</span> more for FREE insured delivery!
            </p>
          )}
          <div className="w-full h-1.5 bg-[#EDE5DC] rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#A67B8A] transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#A67B8A]">
                <ShoppingBag size={32} />
              </div>
              <p className="font-serif text-xl text-[#1A1615]">Your bag is currently empty</p>
              <button 
                onClick={() => {
                  setCartOpen(false);
                  navigateToPage('shop');
                }}
                className="btn-primary"
              >
                EXPLORE COLLECTIONS
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-[#FAF6F0] rounded-xs border border-[#EDE5DC]">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xs border border-[#EDE5DC]"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-[#1A1615] uppercase">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="text-[#9E958F] hover:text-[#8B5E6C]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A7270] mt-0.5">
                      Metal: <span className="font-medium text-[#1A1615]">{item.metal}</span> | Size: {item.size}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#EDE5DC] bg-white rounded-xs">
                      <button 
                        onClick={() => updateCartQty(idx, -1)}
                        className="px-2 py-1 text-[#7A7270] hover:text-[#1A1615]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#1A1615]">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(idx, 1)}
                        className="px-2 py-1 text-[#7A7270] hover:text-[#1A1615]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#8B5E6C]">
                      ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EDE5DC] bg-[#FAF6F0] space-y-3">
            
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Promo Code (GEVARIYA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-[#EDE5DC] px-3 py-1.5 text-xs outline-none uppercase"
              />
              <button 
                onClick={handleApplyPromo}
                className="bg-[#1A1615] text-white text-xs font-semibold px-4 py-1.5 rounded-xs hover:bg-[#8B5E6C] transition-colors"
              >
                APPLY
              </button>
            </div>

            {promoApplied && (
              <p className="text-xs text-green-700 font-semibold">
                Promo applied! Saved ₹ {discount.toLocaleString('en-IN')}
              </p>
            )}

            {promoError && (
              <p className="text-xs text-[#B3261E] font-semibold">{promoError}</p>
            )}

            <div className="space-y-1.5 text-xs text-[#7A7270] pt-2 border-t border-[#EDE5DC]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1A1615]">₹ {cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>- ₹ {discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="text-green-700 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1615] pt-2 border-t border-[#EDE5DC]">
                <span>Total Amount</span>
                <span className="text-[#8B5E6C]">₹ {finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#736B66] uppercase">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
              <span>100% Encrypted & Safe Checkout</span>
            </div>

          </div>
        )}

      </div>
    </>
  );
};
