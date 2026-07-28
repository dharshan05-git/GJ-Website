import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { SlidersHorizontal, ChevronDown, Truck, RotateCcw, ShieldCheck, Gift } from 'lucide-react';

export const Shop = () => {
  const { selectedCategory, setSelectedCategory } = useShop();
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = PRODUCTS.filter(p =>
    selectedCategory === 'ALL' ? true : p.category === selectedCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const sortLabels = {
    featured: 'Featured',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    rating: 'Top Rated',
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <h1
          className="font-serif text-center text-[#2C2623] uppercase mb-2"
          style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 400, letterSpacing: '0.08em' }}
        >
          SHOP OUR COLLECTIONS
        </h1>
        <div className="w-14 h-0.5 bg-[#7A2E3B] mx-auto mb-9" />

        {/* Category filter tabs — exactly like reference */}
        <div className="flex items-center justify-center border-b border-[#E8DFD7] mb-8 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="shrink-0 px-5 py-3 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors relative"
              style={{
                color: selectedCategory === cat.id ? '#7A2E3B' : '#736B66',
                borderBottom: selectedCategory === cat.id ? '2px solid #7A2E3B' : '2px solid transparent',
                marginBottom: '-1px',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter bar + Sort — like reference */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2 text-[#736B66]">
            <SlidersHorizontal size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">FILTER</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#736B66] hover:text-[#2C2623] transition-colors"
            >
              SORT BY: <span className="text-[#2C2623]">{sortLabels[sortBy]}</span>
              <ChevronDown size={13} style={{ transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 bg-white border border-[#E8DFD7] shadow-lg py-1.5 w-48 z-20 animate-fadeIn">
                {Object.entries(sortLabels).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setSortBy(val); setSortOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-[11px] font-semibold tracking-wider text-[#2C2623] hover:bg-[#FAF6F0] hover:text-[#7A2E3B] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-xl text-[#2C2623]">No items in this category yet.</p>
            <button onClick={() => setSelectedCategory('ALL')} className="mt-4 text-[#7A2E3B] font-bold text-sm underline">View All</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Bottom trust row — exactly like reference */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 bg-white border border-[#E8DFD7] p-7 text-center">
          {[
            { icon: <Truck size={22} />, title: 'FREE SHIPPING', desc: 'Insured on all orders' },
            { icon: <RotateCcw size={22} />, title: 'EASY RETURNS', desc: '15-day exchanges' },
            { icon: <ShieldCheck size={22} />, title: 'SECURE PAYMENT', desc: '256-bit SSL encrypted' },
            { icon: <Gift size={22} />, title: 'GIFT WRAPPING', desc: 'Signature velvet box' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-[#2C2623] opacity-70">{item.icon}</div>
              <h4 className="font-sans text-[10px] font-bold tracking-widest text-[#2C2623] uppercase">{item.title}</h4>
              <p className="text-[11px] text-[#736B66]">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
