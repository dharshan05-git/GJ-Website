import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Heart, Search, ChevronRight, ChevronDown, Gem, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

/**
 * Product Details Page — with Plating, Metal (925 Sterling Silver), Ring Size (rings only),
 * and interactive trust guarantee links (Delivery, Warranty, Returns).
 * Fully optimized for mobile and desktop viewports.
 */

const RING_SIZES = [
  { label: '5 (45.11 mm)', value: '5' },
  { label: '6 (45.74 mm)', value: '6' },
  { label: '7 (46.68 mm)', value: '7' },
  { label: '8 (47.25 mm)', value: '8' },
  { label: '9 (48.38 mm)', value: '9' },
  { label: '10 (49.64 mm)', value: '10' },
  { label: '11 (50.58 mm)', value: '11' },
  { label: '12 (51.87 mm)', value: '12' },
  { label: '13 (52.50 mm)', value: '13' },
  { label: '14 (54.51 mm)', value: '14' },
  { label: '15 (54.82 mm)', value: '15' },
  { label: '16 (56.45 mm)', value: '16' },
  { label: '17 (57.15 mm)', value: '17' },
  { label: '18 (58.47 mm)', value: '18' },
  { label: '19 (59.06 mm)', value: '19' },
  { label: '20 (60.66 mm)', value: '20' },
  { label: '21 (60.98 mm)', value: '21' },
  { label: '22 (61.29 mm)', value: '22' },
  { label: '23 (62.89 mm)', value: '23' },
  { label: '24 (63.84 mm)', value: '24' },
  { label: '25 (64.97 mm)', value: '25' },
];

export const ProductPage = () => {
  const {
    selectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSizeGuideOpen,
    navigateToPage,
    triggerFlyToCart,
  } = useShop();

  const product = selectedProduct || PRODUCTS[0];
  const mainImgRef = React.useRef(null);

  const isRingProduct = product.category === 'RINGS';

  const [activeImage, setActiveImage]       = useState(product.image);
  const [selectedPlating, setSelectedPlating] = useState(product.plating?.[0] ?? '18K White Gold');
  const [selectedSize, setSelectedSize]     = useState('7');
  const [zoomed, setZoomed]                 = useState(false);

  const handleAddToCart = () => {
    if (mainImgRef.current && (activeImage || product.image)) {
      const fromRect = mainImgRef.current.getBoundingClientRect();
      triggerFlyToCart({ image: activeImage || product.image, fromRect });
    }
    const sizeValue = isRingProduct ? selectedSize : (product.sizes?.[0] ?? '—');
    setTimeout(() => addToCart(product, selectedPlating, sizeValue), 80);
  };

  const isWishlisted = isInWishlist(product.id);

  const thumbnails = [
    product.image,
    product.hoverImage || product.image,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
  ];

  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#F5F1EA] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#5C4038] mb-6 sm:mb-8 font-sans overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => navigateToPage('home')} className="hover:text-[#7B3F42] transition-colors">Home</button>
          <ChevronRight size={11} className="opacity-50 shrink-0" />
          <button onClick={() => navigateToPage('shop', product.category)} className="hover:text-[#7B3F42] uppercase transition-colors">
            {product.category}
          </button>
          <ChevronRight size={11} className="opacity-50 shrink-0" />
          <span className="font-semibold text-[#2E2B2B] truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Left: Thumbnails + Main Image */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">

            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto no-scrollbar pb-1 sm:pb-0">
              {thumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-white border overflow-hidden shrink-0 transition-all rounded-xs ${
                    activeImage === img
                      ? 'border-[#7B3F42] shadow-xs'
                      : 'border-[#D8CFC3] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-[#D8CFC3] flex items-center justify-center text-xs font-bold text-[#5C4038] shrink-0 rounded-xs">
                +2
              </div>
            </div>

            {/* Main image stage */}
            <div ref={mainImgRef} className="relative flex-1 bg-white border border-[#D8CFC3] flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[500px] rounded-xs shadow-xs">
              <img
                src={activeImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setZoomed(!zoomed)}
              />
              <button
                onClick={() => setZoomed(!zoomed)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 shadow-sm border border-[#D8CFC3] flex items-center justify-center text-[#2E2B2B] hover:text-[#7B3F42] transition-colors rounded-xs"
                aria-label="Zoom"
              >
                <Search size={14} strokeWidth={1.6} />
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">

            <div>
              <h1 className="font-serif text-2xl sm:text-4xl text-[#2E2B2B] uppercase font-normal tracking-wide leading-tight">
                {product.name}
              </h1>
              <div className="mt-2.5 sm:mt-3 text-xl sm:text-2xl font-sans font-bold text-[#7B3F42]">
                ₹ {product.price.toLocaleString('en-IN')}
              </div>
              <p className="text-xs sm:text-[13px] font-sans text-[#5C4038] mt-3 sm:mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* ── PLATING Selector ── */}
            <div className="space-y-2">
              <label className="block text-[10.5px] sm:text-[11px] font-sans font-bold text-[#2E2B2B] uppercase tracking-wider">PLATING</label>
              <div className="flex flex-wrap gap-2">
                {(product.plating || ['18K White Gold', '18K Rose Gold', '18K Gold']).map((plating, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlating(plating)}
                    className={`px-3 sm:px-3.5 py-2 sm:py-2.5 border text-[11px] sm:text-xs font-sans font-medium transition-all rounded-xs ${
                      selectedPlating === plating
                        ? 'border-[#7B3F42] bg-white text-[#7B3F42] font-semibold shadow-xs'
                        : 'border-[#D8CFC3] bg-white text-[#5C4038] hover:border-[#7B3F42]'
                    }`}
                  >
                    {plating}
                  </button>
                ))}
              </div>
            </div>

            {/* ── METAL (Fixed — 925 Sterling Silver) ── */}
            <div className="space-y-2">
              <label className="block text-[10.5px] sm:text-[11px] font-sans font-bold text-[#2E2B2B] uppercase tracking-wider">METAL</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#F9F6F0] border border-[#D8CFC3] rounded-xs">
                <Gem size={15} strokeWidth={1.6} className="text-[#7B3F42]" />
                <span className="text-xs font-sans font-semibold text-[#2E2B2B] tracking-wide">925 Sterling Silver</span>
              </div>
            </div>

            {/* ── Ring Size (ONLY for Rings) ── */}
            {isRingProduct && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10.5px] sm:text-[11px] font-sans font-bold text-[#2E2B2B] uppercase tracking-wider">RING SIZE</label>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10.5px] sm:text-[11px] text-[#7B3F42] font-sans font-semibold underline hover:text-[#623033]"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#D8CFC3] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#2E2B2B] font-sans outline-none focus:border-[#7B3F42] cursor-pointer rounded-xs"
                  >
                    {RING_SIZES.map((rs) => (
                      <option key={rs.value} value={rs.value}>
                        {rs.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A726A] pointer-events-none" />
                </div>
              </div>
            )}

            {/* CTA Row */}
            <div className="pt-2 flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 font-sans font-semibold text-xs tracking-[0.22em] text-white uppercase bg-[#7B3F42] hover:bg-[#623033] py-3.5 sm:py-4 transition-colors shadow-xs rounded-xs active:scale-98"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-11 h-11 sm:w-12 sm:h-12 border flex items-center justify-center transition-all rounded-xs shrink-0 ${
                  isWishlisted ? 'border-[#7B3F42] text-[#7B3F42]' : 'border-[#D8CFC3] text-[#5C4038] hover:text-[#7B3F42]'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#7B3F42' : 'none'} strokeWidth={1.7} />
              </button>
            </div>

            {/* ── Trust Guarantees & Routing Links ── */}
            <div className="pt-3.5 sm:pt-4 border-t border-[#D8CFC3] space-y-2">
              <button
                onClick={() => navigateToPage('delivery')}
                className="w-full flex items-center justify-between p-2 sm:p-2.5 rounded bg-[#FAF7F2] border border-[#E8D5CE] hover:border-[#7B3F42] text-left transition-colors group"
              >
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#2E2B2B]">
                  <Truck size={14} className="text-[#7B3F42] shrink-0" />
                  <span><strong>Delivery:</strong> Free Insured 5–7 Days</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#7B3F42] group-hover:underline uppercase">View →</span>
              </button>

              <button
                onClick={() => navigateToPage('warranty')}
                className="w-full flex items-center justify-between p-2 sm:p-2.5 rounded bg-[#FAF7F2] border border-[#E8D5CE] hover:border-[#7B3F42] text-left transition-colors group"
              >
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#2E2B2B]">
                  <ShieldCheck size={14} className="text-[#7B3F42] shrink-0" />
                  <span><strong>Warranty:</strong> 90-Day Colour Protection</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#7B3F42] group-hover:underline uppercase">Details →</span>
              </button>

              <button
                onClick={() => navigateToPage('returns')}
                className="w-full flex items-center justify-between p-2 sm:p-2.5 rounded bg-[#FAF7F2] border border-[#E8D5CE] hover:border-[#7B3F42] text-left transition-colors group"
              >
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#2E2B2B]">
                  <RefreshCw size={14} className="text-[#7B3F42] shrink-0" />
                  <span><strong>Returns:</strong> 7-Day Easy Returns</span>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#7B3F42] group-hover:underline uppercase">Read →</span>
              </button>
            </div>

          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-[#D8CFC3]">
          <h3 className="font-serif text-xl sm:text-3xl text-[#2E2B2B] uppercase mb-6 sm:mb-8 text-center font-light tracking-wider">
            YOU MAY ALSO ADMIRE
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

      </div>
    </div>
  );
};
