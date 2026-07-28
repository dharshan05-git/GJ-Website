import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar = () => {
  const {
    activePage,
    navigateToPage,
    cartCount,
    wishlist,
    setCartOpen,
    setWishlistOpen,
  } = useShop();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const [collectionsHover, setCollectionsHover] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (page, cat = 'ALL') => {
    navigateToPage(page, cat);
    setMobileOpen(false);
    setShopHover(false);
    setCollectionsHover(false);
  };

  const linkCls = (page) =>
    `text-[11px] font-semibold uppercase tracking-[0.14em] cursor-pointer transition-colors ${
      activePage === page ? 'text-[#7A2E3B] border-b border-[#7A2E3B] pb-0.5' : 'text-[#2C2623] hover:text-[#7A2E3B]'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm'
            : 'bg-[#FAF6F0]'
        } border-b border-[#E8DFD7]`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">

          {/* ── LEFT: Logo — matches reference exactly ── */}
          <div
            onClick={() => go('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {/* GJ badge */}
            <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#7A2E3B] text-[#FAF6F0] font-serif text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
              GJ
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.18em] text-[#2C2623]">GEVARIYA</span>
              <span className="text-[9px] font-semibold tracking-[0.3em] text-[#7A2E3B]">JEWELS</span>
            </div>
          </div>

          {/* ── CENTER: Nav links — exactly like reference ── */}
          <nav className="hidden lg:flex items-center gap-7">

            <button onClick={() => go('home')} className={linkCls('home')}>Home</button>

            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopHover(true)}
              onMouseLeave={() => setShopHover(false)}
            >
              <button
                onClick={() => go('shop', 'ALL')}
                className={`${linkCls('shop')} flex items-center gap-0.5`}
              >
                Shop <ChevronDown size={12} />
              </button>
              {shopHover && (
                <div className="absolute top-full left-0 w-44 bg-white border border-[#E8DFD7] shadow-lg py-1.5 rounded-sm z-50 animate-fadeIn">
                  {['ALL', 'RINGS', 'NECKLACES', 'EARRINGS', 'BRACELETS'].map(c => (
                    <button
                      key={c}
                      onClick={() => go('shop', c)}
                      className="block w-full text-left px-4 py-2 text-[11px] font-semibold tracking-wider text-[#2C2623] hover:bg-[#FAF6F0] hover:text-[#7A2E3B] transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collections dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsHover(true)}
              onMouseLeave={() => setCollectionsHover(false)}
            >
              <button
                onClick={() => go('shop', 'ALL')}
                className={`${linkCls('shop')} flex items-center gap-0.5`}
              >
                Collections <ChevronDown size={12} />
              </button>
              {collectionsHover && (
                <div className="absolute top-full left-0 w-44 bg-white border border-[#E8DFD7] shadow-lg py-1.5 rounded-sm z-50 animate-fadeIn">
                  {['RINGS', 'NECKLACES', 'EARRINGS', 'BRACELETS'].map(c => (
                    <button
                      key={c}
                      onClick={() => go('shop', c)}
                      className="block w-full text-left px-4 py-2 text-[11px] font-semibold tracking-wider text-[#2C2623] hover:bg-[#FAF6F0] hover:text-[#7A2E3B] transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => go('about')} className={linkCls('about')}>About Us</button>
            <button onClick={() => {}} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2C2623] hover:text-[#7A2E3B] transition-colors">Journal</button>
            <button onClick={() => go('contact')} className={linkCls('contact')}>Contact</button>

          </nav>

          {/* ── RIGHT: Icons — search, wishlist, cart ── */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="text-[#2C2623] hover:text-[#7A2E3B] transition-colors p-1"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative text-[#2C2623] hover:text-[#7A2E3B] transition-colors p-1"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A2E3B] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart bag */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#2C2623] hover:text-[#7A2E3B] transition-colors p-1"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7A2E3B] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden text-[#2C2623] p-1"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* ── Search bar ── */}
        {searchOpen && (
          <div className="bg-[#FAF6F0] border-t border-[#E8DFD7] py-2.5 px-5 animate-fadeIn">
            <div className="max-w-xl mx-auto flex items-center gap-2">
              <Search size={16} className="text-[#7A2E3B] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { go('shop'); setSearchOpen(false); } }}
                placeholder="Search rings, necklaces, earrings…"
                className="flex-1 bg-transparent text-sm text-[#2C2623] placeholder-[#9E958F] outline-none"
              />
              <button
                onClick={() => { go('shop'); setSearchOpen(false); }}
                className="text-[11px] font-bold uppercase tracking-wider bg-[#7A2E3B] text-white px-3 py-1.5 rounded-sm"
              >
                Go
              </button>
            </div>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#FAF6F0] border-t border-[#E8DFD7] py-5 px-6 space-y-4 animate-fadeIn">
            {[['home','HOME'],['shop','SHOP ALL'],['about','ABOUT US'],['contact','CONTACT']].map(([p,l]) => (
              <button key={p} onClick={() => go(p)} className="block w-full text-left text-sm font-semibold tracking-widest text-[#2C2623] border-b border-[#E8DFD7]/50 pb-3 hover:text-[#7A2E3B]">
                {l}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
