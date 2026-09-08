import React, { useState, useRef } from 'react';
import { Upload, X, ShoppingBag, Check, ChevronDown, Gem } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const RING_SIZES = [
  '5 (45.11 mm)', '6 (45.74 mm)', '7 (46.68 mm)', '8 (47.25 mm)', '9 (48.38 mm)',
  '10 (49.64 mm)', '11 (50.58 mm)', '12 (51.87 mm)', '13 (52.50 mm)', '14 (54.51 mm)',
  '15 (54.82 mm)', '16 (56.45 mm)', '17 (57.15 mm)', '18 (58.47 mm)', '19 (59.06 mm)',
  '20 (60.66 mm)', '21 (60.98 mm)', '22 (61.29 mm)', '23 (62.89 mm)', '24 (63.84 mm)',
  '25 (64.97 mm)',
];
const BANGLE_SIZES = ['2/2', '2/4', '2/6', '2/8', '2/10', '2/12'];
const PLATING_OPTIONS = [
  '14K Gold',
  '18K Gold',
  '9K Gold',
  '925 Silver',
];
const PRODUCT_TYPES = [
  'Ring', 'Necklace', 'Earrings', 'Bracelet', 'Bangle', 'Pendant', 'Mangalsutra', 'Other',
];

export const Customise = () => {
  const { addToCart, showToast, triggerFlyToCart } = useShop();

  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [plating, setPlating]         = useState('');
  const [ringSize, setRingSize]       = useState('');
  const [bangleSize, setBangleSize]   = useState('');
  const [notes, setNotes]             = useState('');
  const [image, setImage]             = useState(null);
  const [dragging, setDragging]       = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  const fileInputRef  = useRef(null);
  const bagBtnRef     = useRef(null);
  const imageStageRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImage({ file, preview: URL.createObjectURL(file) });
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);
  const onDrop       = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver   = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave  = ()  => setDragging(false);
  const removeImage  = ()  => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleAddToCart = () => {
    if (!productName.trim()) { showToast('Please enter a product name'); return; }
    if (!productType)        { showToast('Please select a jewellery type'); return; }
    if (!plating)            { showToast('Please choose a metal plating'); return; }

    const customImg = image?.preview || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
    const customProduct = {
      id:    `custom_${Date.now()}`,
      name:  productName.trim(),
      price: 0,
      image: customImg,
      badge: 'CUSTOM ORDER',
      isCustom: true,
    };

    const targetEl = imageStageRef.current || bagBtnRef.current;
    if (targetEl) {
      const fromRect = targetEl.getBoundingClientRect();
      triggerFlyToCart({ image: customImg, fromRect });
    }

    setTimeout(() => {
      addToCart(customProduct, plating, ringSize || bangleSize || '—', 1);
      setSubmitted(true);
    }, 80);
  };

  const resetForm = () => {
    setProductName(''); setProductType(''); setPlating('');
    setRingSize(''); setBangleSize(''); setNotes('');
    removeImage(); setSubmitted(false);
  };

  const showRingSize   = productType === 'Ring';
  const showBangleSize = ['Bracelet', 'Bangle'].includes(productType);

  if (submitted) {
    return (
      <div className="bg-[#F5F1EA] min-h-screen py-12 sm:py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#DBC5B8] p-6 sm:p-8 rounded-2xl text-center shadow-sm">
          <div className="w-14 h-14 bg-[#7B3F42] text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={28} />
          </div>
          <h2 className="font-serif text-2xl text-[#2E2B2B] uppercase tracking-wide mb-2">Custom Request Added!</h2>
          <p className="text-xs text-[#5C4038] mb-6 leading-relaxed">
            Your custom piece <strong>"{productName}"</strong> has been added to your shopping bag. Our master karigars will review your reference image and specs.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-[#7B3F42] text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#623033] transition-colors"
          >
            Create Another Custom Piece
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F1EA] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[9.5px] sm:text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
            BESPOKE JEWELLERY SERVICE
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
            CUSTOMISE YOUR CREATION
          </h1>
          <div className="w-12 h-[1.5px] bg-[#7B3F42] mx-auto mt-2.5 mb-3.5" />
          <p className="text-xs text-[#5C4038] leading-relaxed">
            Upload your reference image, specify your desired plating, dimensions, and custom details. Our artisans will bring your dream masterpiece to life.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#DBC5B8] rounded-xl sm:rounded-2xl p-4 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left: Upload Image Stage */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <label className="block text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-3">
                1. UPLOAD REFERENCE PHOTO
              </label>
              
              <div
                ref={imageStageRef}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !image && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all cursor-pointer min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center ${
                  dragging
                    ? 'border-[#7B3F42] bg-[#E8D5CE]/30'
                    : image
                    ? 'border-[#DBC5B8] bg-white'
                    : 'border-[#DBC5B8] bg-[#F5F1EA]/50 hover:bg-[#E8D5CE]/20'
                }`}
              >
                {image ? (
                  <div className="relative w-full h-full min-h-[220px] sm:min-h-[260px] group">
                    <img
                      src={image.preview}
                      alt="Custom preview"
                      className="w-full h-[240px] sm:h-[280px] object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#7B3F42] text-white flex items-center justify-center shadow-md hover:bg-[#623033] transition-colors"
                      title="Remove Image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#E8D5CE] text-[#7B3F42] flex items-center justify-center mb-3">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-[#2E2B2B] uppercase tracking-wider mb-1">
                      Drag &amp; Drop photo here
                    </p>
                    <p className="text-[10.5px] sm:text-[11px] text-[#8A726A] mb-4">
                      or click to browse files (PNG, JPG, WEBP)
                    </p>
                    <span className="text-[9.5px] sm:text-[10px] font-bold tracking-widest text-white uppercase bg-[#7B3F42] px-4 py-2 rounded-lg">
                      BROWSE IMAGE
                    </span>
                  </>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 p-4 bg-[#F5F1EA] rounded-xl border border-[#DBC5B8]/60">
              <h4 className="text-[10.5px] sm:text-[11px] font-bold text-[#7B3F42] uppercase tracking-wider mb-1">
                ✦ Masterpiece Guarantee
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-[#5C4038] leading-relaxed">
                Every custom jewel is hand-certified, crafted in 925 sterling silver with premium plating, and backed by a 90-day colour warranty.
              </p>
            </div>
          </div>

          {/* Right: Specifications Form */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <h3 className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] border-b border-[#DBC5B8] pb-2">
              2. JEWELLERY SPECIFICATIONS
            </h3>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Royal Solitaire Emerald Crown Ring"
                maxLength={60}
                className="w-full bg-white border border-[#DBC5B8] rounded-xl px-4 py-3 text-sm text-[#2E2B2B] outline-none focus:border-[#7B3F42]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                Category Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={productType}
                  onChange={e => { setProductType(e.target.value); setRingSize(''); setBangleSize(''); }}
                  className="w-full appearance-none bg-white border border-[#DBC5B8] rounded-xl px-4 py-3 text-sm text-[#2E2B2B] outline-none focus:border-[#7B3F42] cursor-pointer"
                >
                  <option value="">Select Category…</option>
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A726A] pointer-events-none" />
              </div>
            </div>

            {/* METAL (Fixed Header) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                Metal
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F9F6F0] border border-[#DBC5B8] rounded-xl">
                <Gem size={16} strokeWidth={1.6} className="text-[#7B3F42]" />
                <span className="text-sm font-semibold text-[#2E2B2B] tracking-wide">925 Sterling Silver</span>
              </div>
            </div>

            {/* Metal Plating */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                Metal Plating <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATING_OPTIONS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPlating(m)}
                    className={`text-[11px] font-semibold tracking-wide px-3.5 py-2.5 rounded-lg border transition-all ${
                      plating === m ? 'bg-[#7B3F42] text-white border-[#7B3F42]' : 'bg-white text-[#2E2B2B] border-[#DBC5B8] hover:border-[#7B3F42]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Size */}
            {showRingSize && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                  Ring Size
                </label>
                <div className="relative">
                  <select
                    value={ringSize}
                    onChange={e => setRingSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#DBC5B8] rounded-xl px-4 py-3 text-sm text-[#2E2B2B] outline-none focus:border-[#7B3F42] cursor-pointer"
                  >
                    <option value="">Select Ring Size…</option>
                    {RING_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A726A] pointer-events-none" />
                </div>
              </div>
            )}

            {/* Bangle Size */}
            {showBangleSize && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                  Bangle Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {BANGLE_SIZES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBangleSize(s)}
                      className={`px-3.5 py-2 rounded-lg border text-[11px] font-semibold transition-all ${
                        bangleSize === s ? 'bg-[#7B3F42] text-white border-[#7B3F42]' : 'bg-white text-[#2E2B2B] border-[#DBC5B8] hover:border-[#7B3F42]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B3F42] mb-1.5">
                Special Instructions / Custom Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe your vision — gemstone preferences, custom engravings, special requests…"
                rows={3}
                maxLength={400}
                className="w-full bg-white border border-[#DBC5B8] rounded-xl px-4 py-3 text-sm text-[#2E2B2B] outline-none focus:border-[#7B3F42] resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              ref={bagBtnRef}
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#7B3F42] hover:bg-[#623033] text-white font-sans font-bold text-xs uppercase tracking-[0.22em] py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md active:scale-98"
            >
              <ShoppingBag size={16} />
              <span>FLY TO CART</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
