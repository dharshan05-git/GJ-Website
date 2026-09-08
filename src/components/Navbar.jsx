import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GevariyaLogo } from './GevariyaLogo';

export const Navbar = () => {
  const {
    activePage,
    navigateToPage,
    cartCount,
    setCartOpen,
    cartIconRef,
  } = useShop();

  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [shopHover, setShopHover]         = useState(false);
  const [colHover, setColHover]           = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileOpen]);

  const go = (page, cat = 'ALL') => {
    navigateToPage(page, cat);
    setMobileOpen(false);
    setShopHover(false);
    setColHover(false);
  };

  /* active underline helper */
  const linkCls = (page) =>
    `relative text-[11.5px] font-semibold uppercase tracking-[0.13em] cursor-pointer transition-colors whitespace-nowrap
     after:absolute after:left-0 after:bottom-0 after:h-px after:bg-[#7B3F42] after:transition-all after:duration-300
     ${activePage === page
       ? 'text-[#7B3F42] after:w-full'
       : 'text-[#5C4038] hover:text-[#7B3F42] after:w-0 hover:after:w-full'
     }`;

  const shopCategories = [
    { id: 'ALL',       name: 'All Creations',   tag: 'Complete Boutique Catalog' },
    { id: 'RINGS',     name: 'Rings',           tag: 'Solitaire & Eternity Bands' },
    { id: 'NECKLACES', name: 'Necklaces',       tag: 'Pendants & Grand Chokers' },
    { id: 'EARRINGS',  name: 'Earrings',        tag: 'Drops, Hoops & Studs' },
    { id: 'BRACELETS', name: 'Bracelets',       tag: 'Bangles & Tennis Chains' },
    { id: 'SETS',      name: 'Curated Sets',    tag: 'Bridal Suites & Duos' },
  ];

  const collections = [
    { id: 'RINGS',     name: 'Solitaire Suites',  tag: '925 Silver Solitaires' },
    { id: 'NECKLACES', name: 'Royal Chokers',     tag: 'Master Artisan Heritage' },
    { id: 'EARRINGS',  name: 'Diamond Drops',     tag: 'Micro-Pave Halo Earrings' },
    { id: 'BRACELETS', name: 'Eternity Bangles',  tag: 'Hand-Finished 925 Silver' },
    { id: 'SETS',      name: 'Signature Sets',    tag: 'Bridal Ensembles & Gifts' },
  ];

  return (
    <>
      {/* ── Main Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#F5F1EA]/95 backdrop-blur-md shadow-sm' : 'bg-[#F5F1EA]'
        } border-b border-[#D8CFC3]`}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[68px] sm:h-[95px]">

          {/* ── LEFT: Logo ── */}
          <div
            onClick={() => go('home')}
            className="flex items-center cursor-pointer group shrink-0"
          >
            <div className="block sm:hidden">
              <GevariyaLogo size={52} />
            </div>
            <div className="hidden sm:block">
              <GevariyaLogo size="md" />
            </div>
          </div>

          {/* ── CENTER: Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            <button onClick={() => go('home')} className={linkCls('home')}>
              Home
            </button>

            {/* ── SHOP DROPDOWN ── */}
            <div
              className="relative"
              onMouseEnter={() => setShopHover(true)}
              onMouseLeave={() => setShopHover(false)}
            >
              <button
                onClick={() => go('shop', 'ALL')}
                className={`${linkCls('shop')} flex items-center gap-0.5`}
              >
                Shop <ChevronDown size={11} className={`mt-px transition-transform duration-300 ${shopHover ? 'rotate-180 text-[#7B3F42]' : ''}`} />
              </button>

              {shopHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-fadeIn">
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#E8D5CE] border-t border-l border-[#DBC5B8] z-20" />
                  <div className="relative w-64 bg-[#E8D5CE] border border-[#DBC5B8] rounded-xl shadow-lg p-2 overflow-hidden">
                    <div className="space-y-0.5">
                      {shopCategories.map(c => (
                        <button
                          key={c.id}
                          onClick={() => go('shop', c.id)}
                          className="group/item w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200 hover:bg-[#DBC5B8]/60 hover:pl-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B3F42] opacity-70 group-hover/item:opacity-100 transition-opacity" />
                            <div>
                              <span className="block font-serif text-[12.5px] font-medium tracking-wider text-[#2E2B2B] group-hover/item:text-[#7B3F42] transition-colors">
                                {c.name}
                              </span>
                              <span className="block text-[9.5px] font-sans tracking-wide text-[#5C4038] opacity-80 -mt-0.5">
                                {c.tag}
                              </span>
                            </div>
                          </div>
                          <ChevronDown size={10} className="-rotate-90 text-[#7B3F42] opacity-0 group-hover/item:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 mt-1 border-t border-[#DBC5B8] px-3 pb-1 flex items-center justify-between">
                      <button 
                        onClick={() => go('shop', 'ALL')}
                        className="text-[9.5px] font-bold tracking-[0.18em] text-[#7B3F42] hover:text-[#5C4038] uppercase flex items-center gap-1 transition-colors"
                      >
                        <span>VIEW ALL CREATIONS</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── COLLECTIONS DROPDOWN ── */}
            <div
              className="relative"
              onMouseEnter={() => setColHover(true)}
              onMouseLeave={() => setColHover(false)}
            >
              <button
                onClick={() => go('shop', 'ALL')}
                className={`${linkCls('shop')} flex items-center gap-0.5`}
              >
                Collections <ChevronDown size={11} className={`mt-px transition-transform duration-300 ${colHover ? 'rotate-180 text-[#7B3F42]' : ''}`} />
              </button>

              {colHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-fadeIn">
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#E8D5CE] border-t border-l border-[#DBC5B8] z-20" />
                  <div className="relative w-64 bg-[#E8D5CE] border border-[#DBC5B8] rounded-xl shadow-lg p-2 overflow-hidden">
                    <div className="space-y-0.5">
                      {collections.map(c => (
                        <button
                          key={c.id}
                          onClick={() => go('shop', c.id)}
                          className="group/item w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200 hover:bg-[#DBC5B8]/60 hover:pl-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B3F42] opacity-70 group-hover/item:opacity-100 transition-opacity" />
                            <div>
                              <span className="block font-serif text-[12.5px] font-medium tracking-wider text-[#2E2B2B] group-hover/item:text-[#7B3F42] transition-colors">
                                {c.name}
                              </span>
                              <span className="block text-[9.5px] font-sans tracking-wide text-[#5C4038] opacity-80 -mt-0.5">
                                {c.tag}
                              </span>
                            </div>
                          </div>
                          <ChevronDown size={10} className="-rotate-90 text-[#7B3F42] opacity-0 group-hover/item:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 mt-1 border-t border-[#DBC5B8] px-3 pb-1 flex items-center justify-between">
                      <button 
                        onClick={() => go('shop', 'SETS')}
                        className="text-[9.5px] font-bold tracking-[0.18em] text-[#7B3F42] hover:text-[#5C4038] uppercase flex items-center gap-1 transition-colors"
                      >
                        <span>EXPLORE BRIDAL SETS</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => go('about')} className={linkCls('about')}>
              About Us
            </button>

            <button onClick={() => go('customise')} className={linkCls('customise')}>
              Customise
            </button>

            <button onClick={() => go('contact')} className={linkCls('contact')}>
              Contact
            </button>
          </nav>

          {/* ── RIGHT: Icons ── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="text-[#2E2B2B] hover:text-[#7B3F42] p-2 transition-colors rounded-full active:bg-[#E8D5CE]/40"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>

            {/* Cart */}
            <button
              ref={cartIconRef}
              id="navbar-cart-btn"
              onClick={() => setCartOpen(true)}
              className="relative text-[#2E2B2B] hover:text-[#7B3F42] p-2 transition-colors rounded-full active:bg-[#E8D5CE]/40"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#7B3F42] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden text-[#2E2B2B] p-2 transition-colors rounded-md active:bg-[#E8D5CE]/40"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* ── Search bar ── */}
        {searchOpen && (
          <div className="bg-white border-t border-[#D8CFC3] py-3 px-4 sm:px-6 animate-fadeIn shadow-md">
            <div className="max-w-lg mx-auto flex items-center gap-2 sm:gap-3">
              <Search size={16} className="text-[#7B3F42] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { go('shop'); setSearchOpen(false); } }}
                placeholder="Search rings, necklaces, sets…"
                className="flex-1 bg-transparent text-xs sm:text-sm text-[#2E2B2B] placeholder-[#8A726A] outline-none"
              />
              <button
                onClick={() => { go('shop'); setSearchOpen(false); }}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#7B3F42] hover:bg-[#623033] text-white px-3 sm:px-4 py-2 rounded-xs transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* ── Mobile Menu Modal / Drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col">
            <div className="bg-[#FAF7F2] border-b border-[#D8CFC3] p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeIn">
              
              {/* Main Page Links */}
              <div className="space-y-1">
                {[
                  ['home',       'Home'],
                  ['shop',       'Shop All Collections'],
                  ['customise',  'Customise & Bespoke'],
                  ['about',      'Our Story & Journey'],
                  ['contact',    'Contact & Consultations'],
                ].map(([p, l]) => (
                  <button
                    key={p}
                    onClick={() => go(p)}
                    className="block w-full text-left text-[13px] font-semibold tracking-wider text-[#2E2B2B] border-b border-[#D8CFC3]/50 py-2.5 hover:text-[#7B3F42] transition-colors"
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Shop by Category Grid */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#8A726A] uppercase tracking-widest block mb-2.5">
                  Shop by Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {shopCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => go('shop', cat.id)}
                      className="text-left text-[11px] font-medium py-2.5 px-3 bg-white border border-[#D8CFC3] text-[#2E2B2B] hover:border-[#7B3F42] hover:text-[#7B3F42] transition-colors rounded-sm flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <ChevronDown size={11} className="-rotate-90 text-[#8A726A]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Care Direct Links */}
              <div className="pt-3 border-t border-[#D8CFC3]/60 space-y-2">
                <span className="text-[10px] font-bold text-[#8A726A] uppercase tracking-widest block mb-1">
                  Customer Care &amp; Guarantees
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-[#5C4038]">
                  <button
                    onClick={() => go('delivery')}
                    className="flex items-center gap-2 py-1.5 text-left hover:text-[#7B3F42]"
                  >
                    <Truck size={14} className="text-[#7B3F42]" />
                    <span>Free Insured Delivery (5–7 Days)</span>
                  </button>
                  <button
                    onClick={() => go('warranty')}
                    className="flex items-center gap-2 py-1.5 text-left hover:text-[#7B3F42]"
                  >
                    <ShieldCheck size={14} className="text-[#7B3F42]" />
                    <span>90-Day Colour Warranty</span>
                  </button>
                  <button
                    onClick={() => go('returns')}
                    className="flex items-center gap-2 py-1.5 text-left hover:text-[#7B3F42]"
                  >
                    <RefreshCw size={14} className="text-[#7B3F42]" />
                    <span>7-Day Easy Returns &amp; Exchanges</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Click backdrop to close */}
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}
      </header>
    </>
  );
};
