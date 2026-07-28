import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Heart, ShoppingBag, ZoomIn, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';

export const ProductPage = () => {
  const { 
    selectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSizeGuideOpen,
    navigateToPage 
  } = useShop();

  const product = selectedProduct || PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedMetal, setSelectedMetal] = useState(product.metals[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "7");
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Gallery thumbnails matching View 4
  const thumbnails = [
    product.image,
    product.hoverImage || product.image,
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
  ];

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10">
      <div className="container">
        
        {/* Breadcrumb Navigation matching View 4 */}
        <div className="flex items-center gap-2 text-xs text-[#736B66] mb-8">
          <button onClick={() => navigateToPage('home')} className="hover:text-[#7A2E3B]">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigateToPage('shop', product.category)} className="hover:text-[#7A2E3B] uppercase">{product.category}</button>
          <ChevronRight size={12} />
          <span className="font-semibold text-[#2C2623] uppercase">{product.name}</span>
        </div>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 lg:p-10 rounded-xs border border-[#E8DFD7] shadow-sm">
          
          {/* Left Column: Gallery Thumbnails + Main View with Zoom matching View 4 */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Column */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto">
              {thumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xs border-2 overflow-hidden shrink-0 transition-all ${
                    activeImage === img ? 'border-[#7A2E3B] shadow-xs' : 'border-[#E8DFD7] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF6F0] border border-[#E8DFD7] rounded-xs flex items-center justify-center text-xs font-bold text-[#7A2E3B]">
                +2
              </div>
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 bg-[#FAF6F0] rounded-xs overflow-hidden border border-[#E8DFD7] flex items-center justify-center group min-h-[380px] sm:min-h-[480px]">
              <img 
                src={activeImage} 
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setZoomed(!zoomed)}
              />

              <button 
                onClick={() => setZoomed(!zoomed)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#2C2623] hover:text-[#7A2E3B] transition-colors"
                title="Toggle Zoom"
              >
                <ZoomIn size={18} />
              </button>
            </div>

          </div>

          {/* Right Column: Title, Price, Metal, Size, Actions matching View 4 */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div>
              <span className="text-xs font-bold tracking-widest text-[#7A2E3B] uppercase">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#2C2623] uppercase mt-1">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#7A2E3B]">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#9E958F] line-through">
                    ₹ {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                  Includes all taxes & insured shipping
                </span>
              </div>

              <p className="text-xs text-[#736B66] mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Metal Selector matching View 4 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2C2623] uppercase tracking-wider">
                METAL: <span className="font-normal text-[#7A2E3B]">{selectedMetal}</span>
              </label>
              <div className="flex gap-3">
                {product.metals.map((metal, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMetal(metal)}
                    className={`px-4 py-2 border text-xs font-semibold rounded-xs transition-all ${
                      selectedMetal === metal 
                        ? 'border-[#7A2E3B] bg-[#7A2E3B] text-white shadow-xs' 
                        : 'border-[#E8DFD7] text-[#2C2623] hover:border-[#7A2E3B] bg-white'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector matching View 4 */}
            {product.sizes && product.sizes[0] !== "Standard" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#2C2623] uppercase tracking-wider">
                    SIZE:
                  </label>
                  <button 
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs text-[#7A2E3B] font-semibold underline"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex gap-2">
                  {product.sizes.map((sz, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-11 h-11 border text-xs font-bold rounded-xs transition-all ${
                        selectedSize === sz 
                          ? 'border-[#7A2E3B] bg-[#7A2E3B] text-white' 
                          : 'border-[#E8DFD7] text-[#2C2623] hover:border-[#7A2E3B] bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons matching View 4 */}
            <div className="pt-4 border-t border-[#E8DFD7] space-y-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => addToCart(product, selectedMetal, selectedSize, quantity)}
                  className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag size={18} />
                  <span>ADD TO CART</span>
                </button>

                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border rounded-xs transition-all ${
                    isWishlisted ? 'border-[#7A2E3B] text-[#7A2E3B] bg-[#FAF6F0]' : 'border-[#E8DFD7] text-[#736B66] hover:text-[#7A2E3B]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? '#7A2E3B' : 'none'} />
                </button>
              </div>

              {/* Product Specifications List */}
              <div className="bg-[#FAF6F0] p-4 rounded-xs border border-[#E8DFD7] text-xs text-[#736B66] space-y-2">
                <h4 className="font-serif text-xs font-bold uppercase text-[#2C2623] tracking-wider mb-2">
                  PRODUCT SPECIFICATIONS
                </h4>
                {product.details.map((detail, idx) => (
                  <p key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A2E3B]" />
                    <span>{detail}</span>
                  </p>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Carousel/Grid */}
        <div className="mt-16">
          <h3 className="font-serif text-2xl text-[#2C2623] uppercase mb-6 text-center">
            YOU MAY ALSO ADMIRE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
