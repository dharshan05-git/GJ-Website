import React from 'react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid = () => {
  const { navigateToPage } = useShop();
  const collections = CATEGORIES.filter(c => c.id !== 'ALL');

  return (
    <section className="bg-[#FAF6F0] py-12 border-b border-[#E8DFD7]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-sans text-xs font-bold tracking-[0.22em] text-[#2C2623] uppercase">
            OUR COLLECTIONS
          </h2>
          <button 
            onClick={() => navigateToPage('shop', 'ALL')}
            className="font-sans text-xs font-bold tracking-[0.18em] text-[#7A2E3B] uppercase flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>VIEW ALL</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Spherical Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {collections.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => navigateToPage('shop', cat.id)}
              className="group cursor-pointer flex flex-col items-center text-center"
            >
              {/* Sphere (Circular Round Container) with Golden Ring Accent */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-[#D4AF37]/50 bg-[#F3EAE1] mb-3 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#7A2E3B] group-hover:shadow-xl">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#7A2E3B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Sphere Title */}
              <h3 className="font-serif text-sm font-semibold tracking-widest text-[#2C2623] group-hover:text-[#7A2E3B] uppercase transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
