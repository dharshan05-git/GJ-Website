import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/* ── Two slides: 1 image, 1 video ── */
const SLIDES = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90',
    alt: 'Woman wearing elegant diamond jewelry',
  },
  {
    type: 'video',
    /* 10-second royalty-free jewelry craftsmanship clip */
    src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-jeweler-setting-a-diamond-ring-41551-large.mp4',
    poster: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=90',
    alt: 'Artisan setting a diamond ring',
  },
];

export const Hero = () => {
  const { navigateToPage } = useShop();
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setCurrent(idx);
    resetTimer(idx);
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  /* Auto-advance logic */
  const resetTimer = (slideIdx) => {
    clearInterval(timerRef.current);
    const duration = SLIDES[slideIdx].type === 'video' ? 10000 : 5000;
    timerRef.current = setTimeout(() => {
      setCurrent(prev => {
        const n = (prev + 1) % SLIDES.length;
        resetTimer(n);
        return n;
      });
    }, duration);
  };

  useEffect(() => {
    resetTimer(0);
    return () => clearTimeout(timerRef.current);
  }, []);

  /* When video slide becomes active, restart the video */
  useEffect(() => {
    if (SLIDES[current].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '88vh', minHeight: '560px' }}
    >
      {/* ── BACKGROUND SLIDES ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: current === i ? 1 : 0, zIndex: 0 }}
        >
          {slide.type === 'image' ? (
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              poster={slide.poster}
              className="w-full h-full object-cover object-center"
              /* stop at 10 s and let the timer handle the slide change */
              onTimeUpdate={(e) => {
                if (e.currentTarget.currentTime >= 10) {
                  e.currentTarget.pause();
                }
              }}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          )}
        </div>
      ))}

      {/* ── GRADIENT OVERLAY (cream left → transparent right, like reference) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(250,246,240,0.93) 0%, rgba(250,246,240,0.78) 28%, rgba(250,246,240,0.18) 55%, transparent 72%)',
          zIndex: 1,
        }}
      />

      {/* ── TEXT OVERLAY (left side) ── */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 2 }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ maxWidth: '420px' }}>
            <h1
              className="font-serif text-[#2C2623] leading-tight"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3.1rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              TIMELESS
              <br />
              <em style={{ color: '#7A2E3B', fontStyle: 'italic', fontWeight: 400 }}>
                ELEGANCE,
              </em>
              <br />
              CRAFTED FOR YOU
            </h1>

            <p
              className="text-[#4a4440] mt-4 leading-relaxed"
              style={{ fontSize: '0.85rem' }}
            >
              Handcrafted fine jewelry designed to
              <br />
              be cherished for generations.
            </p>

            <button
              onClick={() => navigateToPage('shop')}
              className="mt-7 font-sans font-semibold text-white uppercase tracking-widest"
              style={{
                background: '#7A2E3B',
                padding: '13px 28px',
                fontSize: '0.78rem',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#5F222D')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#7A2E3B')}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </div>

      {/* ── LEFT ARROW ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#2C2623] transition-all"
        style={{ width: '42px', height: '42px', zIndex: 4, backdropFilter: 'blur(4px)' }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* ── RIGHT ARROW ── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#2C2623] transition-all"
        style={{ width: '42px', height: '42px', zIndex: 4, backdropFilter: 'blur(4px)' }}
      >
        <ChevronRight size={22} />
      </button>

      {/* ── DOTS ── */}
      <div
        className="absolute bottom-6 left-0 right-0 flex justify-center gap-2"
        style={{ zIndex: 3 }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: current === i ? '28px' : '10px',
              height: '10px',
              borderRadius: current === i ? '5px' : '50%',
              background: current === i ? '#7A2E3B' : 'rgba(122,46,59,0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
};
