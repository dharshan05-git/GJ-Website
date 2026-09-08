import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ANNOUNCEMENTS = [
  {
    text: 'COMPLIMENTARY INSURED SHIPPING ACROSS INDIA • 100% CERTIFIED 925 STERLING SILVER',
    page: 'about',
  },
  {
    text: 'DELIVERY IN 5 TO 7 DAYS • FREE SHIPPING ON ALL ORDERS',
    page: 'delivery',
  },
];

export const AnnouncementBar = () => {
  const { navigateToPage } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      onClick={() => navigateToPage(current.page)}
      className="bg-[#EDE7DE] hover:bg-[#E5DCD1] cursor-pointer text-[#7B3F42] text-[11px] py-2 px-4 text-center font-bold tracking-widest uppercase flex items-center justify-center gap-3 border-b border-[#D8CFC3] overflow-hidden relative h-[36px] transition-colors"
      title="Click to view details"
    >
      <Sparkles size={13} className="animate-pulse text-[#C6A46A] shrink-0" />
      <div className="relative overflow-hidden h-[18px] flex items-center">
        <span
          className="inline-block transition-all duration-400 ease-in-out"
          style={{
            transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {current.text}
        </span>
      </div>
      <Sparkles size={13} className="animate-pulse text-[#C6A46A] shrink-0" />
    </div>
  );
};
