import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const SignatureProduct = () => {
  const { addToCart, navigateToProduct } = useShop();

  // Diamond Drop Earrings signature product
  const signatureItem = PRODUCTS.find(p => p.id === 'diamond-drop-earrings') || PRODUCTS[1];

  return (
    <section className="bg-[#F8EDE6] text-[#2C2623] py-16 border-t border-b border-[#E8DFD7] relative overflow-hidden">
      
      {/* Background Ambient Warm Glow */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Side Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-xs border-4 border-white shadow-xl group">
              <img 
                src={signatureItem.image} 
                alt={signatureItem.name}
                className="w-full h-[400px] sm:h-[460px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Signature Badge */}
              <div className="absolute top-4 left-4 bg-[#7A2E3B] text-white text-[10px] font-bold tracking-[0.25em] px-3.5 py-1 uppercase shadow-sm rounded-xs">
                ★ SIGNATURE CREATION
              </div>
            </div>
          </div>

          {/* Right Side Info & Call To Action */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 text-[#7A2E3B] text-xs font-bold tracking-[0.25em] uppercase">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span>GEVARIYA SIGNATURE PIECE</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2C2623] leading-tight uppercase">
              {signatureItem.name}
            </h2>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#7A2E3B]">
                ₹{signatureItem.price.toLocaleString('en-IN')}
              </span>
              {signatureItem.originalPrice && (
                <span className="text-sm text-[#9E958F] line-through">
                  ₹{signatureItem.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#736B66] leading-relaxed max-w-lg font-normal">
              Cascading drop earrings designed with micro-pave diamond halos and glowing teardrop stones. Meticulously handcrafted in 18k solid gold to bring timeless elegance to every moment.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(signatureItem, "18K Yellow Gold")}
                className="bg-[#7A2E3B] hover:bg-[#5F222D] text-white font-sans font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG</span>
              </button>

              <button 
                onClick={() => navigateToProduct(signatureItem)}
                className="border border-[#7A2E3B] hover:bg-[#7A2E3B] hover:text-white text-[#7A2E3B] font-sans font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>VIEW DETAILS</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
