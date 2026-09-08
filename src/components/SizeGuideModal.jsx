import React from 'react';
import { X, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal = () => {
  const { sizeGuideOpen, setSizeGuideOpen } = useShop();

  if (!sizeGuideOpen) return null;

  const sizeChart = [
    { us: '5', dia: '14.36 mm', circ: '45.11 mm' },
    { us: '6', dia: '14.56 mm', circ: '45.74 mm' },
    { us: '7', dia: '14.86 mm', circ: '46.68 mm' },
    { us: '8', dia: '15.04 mm', circ: '47.25 mm' },
    { us: '9', dia: '15.40 mm', circ: '48.38 mm' },
    { us: '10', dia: '15.80 mm', circ: '49.64 mm' },
    { us: '11', dia: '16.10 mm', circ: '50.58 mm' },
    { us: '12', dia: '16.51 mm', circ: '51.87 mm' },
    { us: '13', dia: '16.71 mm', circ: '52.50 mm' },
    { us: '14', dia: '17.35 mm', circ: '54.51 mm' },
    { us: '15', dia: '17.45 mm', circ: '54.82 mm' },
    { us: '16', dia: '17.97 mm', circ: '56.45 mm' },
    { us: '17', dia: '18.19 mm', circ: '57.15 mm' },
    { us: '18', dia: '18.61 mm', circ: '58.47 mm' },
    { us: '19', dia: '18.80 mm', circ: '59.06 mm' },
    { us: '20', dia: '19.31 mm', circ: '60.66 mm' },
    { us: '21', dia: '19.41 mm', circ: '60.98 mm' },
    { us: '22', dia: '19.51 mm', circ: '61.29 mm' },
    { us: '23', dia: '20.02 mm', circ: '62.89 mm' },
    { us: '24', dia: '20.32 mm', circ: '63.84 mm' },
    { us: '25', dia: '20.68 mm', circ: '64.97 mm' },
  ];

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSizeGuideOpen(false)}
      />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 z-10 border border-[#EDE5DC] max-h-[85vh] flex flex-col animate-fadeIn">
        <div className="flex justify-between items-center pb-3 border-b border-[#EDE5DC] shrink-0">
          <div className="flex items-center gap-2 text-[#7B3F42]">
            <Ruler size={20} />
            <h3 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#1A1615]">
              RING SIZE GUIDE (5–25)
            </h3>
          </div>
          <button 
            onClick={() => setSizeGuideOpen(false)}
            className="text-[#7A7270] hover:text-[#1A1615] p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-3 text-xs text-[#7A7270] space-y-3 overflow-y-auto flex-1">
          <p className="text-[11px] sm:text-xs leading-relaxed">
            Measure the inner diameter of an existing ring that fits comfortably, or wrap a string around your finger and measure the circumference in millimeters.
          </p>

          <div className="border border-[#EDE5DC] rounded-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-[#FAF6F0] text-[#1A1615] font-bold sticky top-0">
                  <th className="p-2 sm:p-2.5 border-b border-[#EDE5DC]">Size</th>
                  <th className="p-2 sm:p-2.5 border-b border-[#EDE5DC]">Diameter</th>
                  <th className="p-2 sm:p-2.5 border-b border-[#EDE5DC]">Circumference</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((s, idx) => (
                  <tr key={s.us} className={idx % 2 === 1 ? 'bg-[#FAF6F0]/40' : ''}>
                    <td className="p-1.5 sm:p-2 border-b border-[#EDE5DC]/60 font-semibold text-[#7B3F42]">{s.us}</td>
                    <td className="p-1.5 sm:p-2 border-b border-[#EDE5DC]/60">{s.dia}</td>
                    <td className="p-1.5 sm:p-2 border-b border-[#EDE5DC]/60">{s.circ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-[#EDE5DC] text-center shrink-0">
          <button 
            onClick={() => setSizeGuideOpen(false)}
            className="bg-[#7B3F42] hover:bg-[#623033] text-white font-sans text-xs font-bold uppercase tracking-wider py-2.5 px-7 rounded-xs transition-colors shadow-xs"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
