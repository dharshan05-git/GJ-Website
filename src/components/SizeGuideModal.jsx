import React from 'react';
import { X, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal = () => {
  const { sizeGuideOpen, setSizeGuideOpen } = useShop();

  if (!sizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSizeGuideOpen(false)}
      />

      <div className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl p-6 z-10 border border-[#E8DFD7]">
        <div className="flex justify-between items-center pb-3 border-b border-[#E8DFD7]">
          <div className="flex items-center gap-2 text-[#7A2E3B]">
            <Ruler size={20} />
            <h3 className="font-serif text-xl font-bold uppercase text-[#2C2623]">
              RING SIZE GUIDE
            </h3>
          </div>
          <button 
            onClick={() => setSizeGuideOpen(false)}
            className="text-[#736B66] hover:text-[#2C2623]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4 text-xs text-[#736B66] space-y-3">
          <p>
            Measure the inner diameter of an existing ring that fits your finger comfortably, or wrap a string around your finger and measure the circumference in millimeters.
          </p>

          <table className="w-full text-left border-collapse border border-[#E8DFD7] text-xs">
            <thead>
              <tr className="bg-[#FAF6F0] text-[#2C2623] font-bold">
                <th className="p-2.5 border border-[#E8DFD7]">US Size</th>
                <th className="p-2.5 border border-[#E8DFD7]">Inner Diameter (mm)</th>
                <th className="p-2.5 border border-[#E8DFD7]">Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-[#E8DFD7]">6</td><td className="p-2 border border-[#E8DFD7]">16.5 mm</td><td className="p-2 border border-[#E8DFD7]">51.8 mm</td></tr>
              <tr className="bg-[#FAF6F0]/50"><td className="p-2 border border-[#E8DFD7]">7</td><td className="p-2 border border-[#E8DFD7]">17.3 mm</td><td className="p-2 border border-[#E8DFD7]">54.4 mm</td></tr>
              <tr><td className="p-2 border border-[#E8DFD7]">8</td><td className="p-2 border border-[#E8DFD7]">18.1 mm</td><td className="p-2 border border-[#E8DFD7]">56.9 mm</td></tr>
              <tr className="bg-[#FAF6F0]/50"><td className="p-2 border border-[#E8DFD7]">9</td><td className="p-2 border border-[#E8DFD7]">18.9 mm</td><td className="p-2 border border-[#E8DFD7]">59.5 mm</td></tr>
              <tr><td className="p-2 border border-[#E8DFD7]">10</td><td className="p-2 border border-[#E8DFD7]">19.8 mm</td><td className="p-2 border border-[#E8DFD7]">62.1 mm</td></tr>
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-[#E8DFD7] text-center">
          <button 
            onClick={() => setSizeGuideOpen(false)}
            className="btn-primary py-2 px-6 text-xs"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
