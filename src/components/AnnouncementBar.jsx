import React from 'react';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-[#F8EDE6] text-[#7A2E3B] text-[11px] py-2 px-4 text-center font-semibold tracking-widest uppercase flex items-center justify-center gap-3 border-b border-[#E8DFD7]">
      <Sparkles size={13} className="animate-pulse text-[#D4AF37]" />
      <span>COMPLIMENTARY INSURED SHIPPING ACROSS INDIA • 100% CERTIFIED 18K FINE GOLD & DIAMONDS</span>
      <Sparkles size={13} className="animate-pulse text-[#D4AF37]" />
    </div>
  );
};
