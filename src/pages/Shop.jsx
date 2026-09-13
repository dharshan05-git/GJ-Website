import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const Shop = () => {
  const { selectedCategory, setSelectedCategory, products: PRODUCTS, navigateToPage } = useShop();
  const { category: categoryParam } = useParams();

  // /shop/rings and the category tabs stay in step, so the URL is always shareable.
  useEffect(() => {
    const fromUrl = (categoryParam || 'ALL').toUpperCase();
    if (fromUrl !== selectedCategory) setSelectedCategory(fromUrl);
  }, [categoryParam]);
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);

  // Set appropriate default filter when main category tab changes
  useEffect(() => {
    if (selectedCategory === 'EARRINGS') {
      setGenderFilter('WOMEN');
    } else {
      setGenderFilter('ALL');
    }
  }, [selectedCategory]);

  const MAIN_CATS = ['ALL', 'RINGS', 'NECKLACES', 'EARRINGS', 'BRACELETS', 'SETS'];

  const categoryNameMap = {
    ALL: 'ALL CREATIONS',
    RINGS: 'RINGS COLLECTION',
    NECKLACES: 'PENDANTS & NECKLACES',
    EARRINGS: 'EARRINGS COLLECTION',
    BRACELETS: 'BRACELETS & BANGLES',
    SETS: 'CURATED BRIDAL SETS',
  };

  const getSubFilterOptions = () => {
    if (selectedCategory === 'RINGS' || selectedCategory === 'BRACELETS') {
      return ['ALL', 'MEN', 'WOMEN'];
    }
    if (selectedCategory === 'EARRINGS') {
      return ['WOMEN', 'UNISEX STUDS'];
    }
    return [];
  };

  const subFilterOptions = getSubFilterOptions();

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'price-low')  return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating')     return b.rating - a.rating;
      return 0;
    });
  };

  const sortLabels = {
    featured:    'Featured',
    'price-low': 'Price: Low to High',
    'price-high':'Price: High to Low',
    rating:      'Top Rated',
  };

  const mainTabCls = (cat) =>
    `shrink-0 px-3.5 sm:px-5 py-2.5 sm:py-3 text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.16em] uppercase transition-colors relative cursor-pointer ${
      selectedCategory === cat
        ? 'text-[#7B3F42] border-b-2 border-[#7B3F42]'
        : 'text-[#5C4038] border-b-2 border-transparent hover:text-[#7B3F42]'
    }`;

  // Helper to render grid of products (2 columns on mobile, 3 on tablet, 4 on desktop)
  const renderProductGrid = (items) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
      {sortItems(items).map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );

  return (
    <div className="bg-[#F5F1EA] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* ── Heading ── */}
        <h1
          className="font-serif text-center text-[#2E2B2B] uppercase tracking-wider font-light"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)' }}
        >
          {categoryNameMap[selectedCategory] || 'SHOP OUR COLLECTIONS'}
        </h1>
        <div className="w-12 h-[1.5px] bg-[#7B3F42] mx-auto mt-2.5 mb-6 sm:mb-8" />

        {/* ── Main Category Tabs ── */}
        <div className="flex items-center justify-start border-b border-[#D8CFC3] mb-5 sm:mb-6 overflow-x-auto no-scrollbar -mb-px gap-1">
          {MAIN_CATS.map(cat => (
            <button
              key={cat}
              onClick={() => navigateToPage('shop', cat)}
              className={mainTabCls(cat)}
              style={{ marginBottom: '-1px' }}
            >
              {cat === 'NECKLACES' ? 'PENDANTS' : cat}
            </button>
          ))}
        </div>

        {/* ── Filter Bar & Sort By ── */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D8CFC3]/60">
          <div className="flex items-center gap-1.5 text-[#5C4038]">
            <SlidersHorizontal size={13} />
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider">
              FILTER
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-wider text-[#5C4038] hover:text-[#2E2B2B] transition-colors p-1"
            >
              SORT BY: <span className="text-[#2E2B2B] font-bold">{sortLabels[sortBy]}</span>
              <ChevronDown size={12} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 bg-white border border-[#D8CFC3] shadow-lg py-1.5 w-44 sm:w-48 z-20 animate-fadeIn">
                {Object.entries(sortLabels).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => { setSortBy(val); setSortOpen(false); }}
                    className={`block w-full text-left px-3.5 sm:px-4 py-2 text-[10.5px] sm:text-[11px] font-semibold tracking-wider transition-colors ${
                      sortBy === val
                        ? 'bg-[#EDE7DE] text-[#7B3F42] font-bold'
                        : 'text-[#5C4038] hover:bg-[#F5F1EA] hover:text-[#2E2B2B]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Sub-Selector: RINGS, EARRINGS, BRACELETS ── */}
        {subFilterOptions.length > 0 && (
          <div className="flex items-center gap-5 sm:gap-8 mb-6 sm:mb-8 text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold flex-wrap">
            {subFilterOptions.map(option => (
              <button
                key={option}
                onClick={() => setGenderFilter(option)}
                className={`transition-all relative pb-1 cursor-pointer ${
                  genderFilter === option
                    ? 'text-[#2E2B2B] font-bold border-b-2 border-[#2E2B2B]'
                    : 'text-[#8A726A] hover:text-[#2E2B2B] border-b-2 border-transparent'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* ── PRODUCT CONTENT DISPLAY ── */}

        {/* 1. RINGS CATEGORY */}
        {selectedCategory === 'RINGS' && (
          <div className="space-y-10 sm:space-y-12">
            {(genderFilter === 'ALL' || genderFilter === 'MEN') && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    MEN RING COLLECTION
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'RINGS' && p.gender === 'MEN'))}
              </div>
            )}

            {(genderFilter === 'ALL' || genderFilter === 'WOMEN') && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    WOMEN'S RING COLLECTION
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'RINGS' && p.gender === 'WOMEN'))}
              </div>
            )}
          </div>
        )}

        {/* 2. EARRINGS CATEGORY */}
        {selectedCategory === 'EARRINGS' && (
          <div className="space-y-10 sm:space-y-12">
            {genderFilter === 'WOMEN' && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    WOMEN'S EARRING COLLECTION
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'EARRINGS' && p.gender === 'WOMEN'))}
              </div>
            )}

            {genderFilter === 'UNISEX STUDS' && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    UNISEX DIAMOND STUDS
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'EARRINGS' && p.gender === 'UNISEX'))}
              </div>
            )}
          </div>
        )}

        {/* 3. BRACELETS CATEGORY */}
        {selectedCategory === 'BRACELETS' && (
          <div className="space-y-10 sm:space-y-12">
            {(genderFilter === 'ALL' || genderFilter === 'MEN') && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    MEN'S BRACELETS &amp; CHAINS
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'BRACELETS' && p.gender === 'MEN'))}
              </div>
            )}

            {(genderFilter === 'ALL' || genderFilter === 'WOMEN') && (
              <div>
                <div className="mb-4 sm:mb-6 pb-2 border-b border-[#D8CFC3]">
                  <h2 className="font-serif text-lg sm:text-2xl text-[#2E2B2B] uppercase tracking-wide font-normal">
                    WOMEN'S BANGLES &amp; BRACELETS
                  </h2>
                </div>
                {renderProductGrid(PRODUCTS.filter(p => p.category === 'BRACELETS' && p.gender === 'WOMEN'))}
              </div>
            )}
          </div>
        )}

        {/* 4. OTHER CATEGORIES (ALL, NECKLACES, SETS) */}
        {selectedCategory !== 'RINGS' && selectedCategory !== 'EARRINGS' && selectedCategory !== 'BRACELETS' && (
          <div>
            {renderProductGrid(
              selectedCategory === 'ALL'
                ? PRODUCTS
                : PRODUCTS.filter(p => p.category === selectedCategory)
            )}
          </div>
        )}

      </div>
    </div>
  );
};
