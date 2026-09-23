import React, { useState, useEffect } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, ShieldCheck, Sparkles, MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const TrackOrderModal = ({ isOpen, onClose }) => {
  const { showToast } = useShop();

  const [orderInput, setOrderInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default sample order data for demonstration
  const sampleOrder = {
    orderId: 'GV-2026-8942',
    date: '15 Sep 2026',
    estDelivery: '19 - 21 Sep 2026',
    item: 'Classic Solitaire Pendant (18K Yellow Gold, 100% 925 Silver)',
    price: '₹1,450',
    carrier: 'BlueDart Insured Air Express',
    awb: 'BD-89420912IN',
    statusStep: 3, // 0: placed, 1: handcrafted, 2: certified, 3: dispatched, 4: delivered
    steps: [
      {
        title: 'Order Confirmed & Payment Verified',
        desc: '15 Sep 2026, 02:30 PM • 100% Insured Transaction Verified',
        completed: true,
      },
      {
        title: 'Artisan Atelier Handcrafting',
        desc: '16 Sep 2026, 11:15 AM • Handcrafted by Master Jewelers in Jaipur',
        completed: true,
      },
      {
        title: '925 Hallmarking & Certificate Issued',
        desc: '16 Sep 2026, 04:45 PM • Authenticity & Quality Passed',
        completed: true,
      },
      {
        title: 'Dispatched with Insured Air Courier',
        desc: '17 Sep 2026, 08:20 AM • In Transit via BlueDart Express (Air Cargo)',
        completed: true,
        active: true,
      },
      {
        title: 'Out for Delivery & Luxury Unboxing',
        desc: 'Expected Delivery by 19 Sep 2026 • Secure OTP Delivery',
        completed: false,
      },
    ],
  };

  // Check for any order in localStorage or load default sample
  useEffect(() => {
    if (isOpen) {
      try {
        const lastOrder = localStorage.getItem('gevariya_last_order');
        if (lastOrder) {
          const parsed = JSON.parse(lastOrder);
          setSearchedOrder({
            ...sampleOrder,
            orderId: parsed.orderId || 'GV-2026-8942',
            price: parsed.total ? `₹${parsed.total.toLocaleString('en-IN')}` : '₹1,450',
          });
        } else {
          setSearchedOrder(sampleOrder);
        }
      } catch {
        setSearchedOrder(sampleOrder);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderInput.trim()) {
      setSearchedOrder(sampleOrder);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearchedOrder({
        ...sampleOrder,
        orderId: orderInput.trim().toUpperCase().startsWith('GV-') ? orderInput.trim().toUpperCase() : `GV-2026-${orderInput.trim()}`,
      });
      showToast('Order details retrieved successfully');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#D8CFC3] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D8CFC3] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D8CFC3] flex items-center justify-center text-[#7B3F42]">
              <Package size={17} />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2E2B2B] uppercase tracking-wide">
                TRACK YOUR CREATION
              </h2>
              <p className="text-[10.5px] text-[#5C4038]">
                Real-time insured courier tracking &amp; status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7B3F42] hover:bg-[#FAF7F2] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GV-8942) or Phone"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full bg-white border border-[#D8CFC3] rounded-xl px-3.5 py-2.5 text-xs text-[#2E2B2B] placeholder-[#8A726A] focus:outline-none focus:border-[#7B3F42] shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7B3F42] hover:bg-[#623033] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shrink-0 shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <Search size={13} />
              <span>{loading ? 'Searching…' : 'Track'}</span>
            </button>
          </form>

          {searchedOrder && (
            <div className="space-y-4">
              
              {/* Order Card Overview */}
              <div className="bg-white rounded-2xl border border-[#D8CFC3] p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#EDE5DC] pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A726A] uppercase tracking-widest block">
                      ORDER REFERENCE
                    </span>
                    <span className="font-sans text-sm font-extrabold text-[#7B3F42]">
                      #{searchedOrder.orderId}
                    </span>
                  </div>
                  <span className="bg-[#E8D5CE]/60 text-[#7B3F42] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    In Transit
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-[#8A726A] block">Placed On:</span>
                    <span className="font-medium text-[#2E2B2B]">{searchedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A726A] block">Estimated Delivery:</span>
                    <span className="font-bold text-[#7B3F42]">{searchedOrder.estDelivery}</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-[10px] text-[#8A726A] block">Courier Partner &amp; AWB:</span>
                    <div className="flex items-center justify-between text-[#2E2B2B]">
                      <span className="font-medium flex items-center gap-1">
                        <Truck size={13} className="text-[#7B3F42]" />
                        {searchedOrder.carrier}
                      </span>
                      <span className="text-[11px] font-mono text-[#5C4038] font-bold bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D8CFC3]">
                        {searchedOrder.awb}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-white rounded-2xl border border-[#D8CFC3] p-4 sm:p-5 shadow-xs">
                <h3 className="text-xs font-bold text-[#2E2B2B] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#C6A46A]" />
                  <span>CRAFTING &amp; DISPATCH PROGRESS</span>
                </h3>

                <div className="relative pl-6 space-y-5">
                  {/* Vertical Track Line */}
                  <div className="absolute left-2.5 top-2 bottom-3 w-[2px] bg-[#E8D5CE]" />

                  {searchedOrder.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          step.completed
                            ? step.active
                              ? 'bg-[#7B3F42] text-white ring-4 ring-[#7B3F42]/20 animate-pulse'
                              : 'bg-[#7B3F42] text-white'
                            : 'bg-white border-2 border-[#D8CFC3] text-transparent'
                        }`}
                      >
                        {step.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                      </div>

                      {/* Content */}
                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            step.completed
                              ? step.active
                                ? 'text-[#7B3F42]'
                                : 'text-[#2E2B2B]'
                              : 'text-[#8A726A]'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[10.5px] text-[#5C4038] mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concierge & Support Box */}
              <div className="bg-[#FAF6F0] rounded-2xl border border-[#EDE5DC] p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#D8CFC3] flex items-center justify-center text-[#7B3F42] shrink-0">
                    <MessageSquare size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2E2B2B] block">
                      Need Assistance With Your Order?
                    </span>
                    <span className="text-[10px] text-[#5C4038]">
                      Our Personal Jewelry Concierge is available 24/7
                    </span>
                  </div>
                </div>

                <a
                  href="https://wa.me/917041677500?text=Hello%20Gevariya%20team,%20I%20would%20like%20to%20check%20my%20order%20status."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1ebe5b] text-white text-[10.5px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <span>WhatsApp Us</span>
                  <ExternalLink size={11} />
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
