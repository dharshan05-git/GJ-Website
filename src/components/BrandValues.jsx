import React from 'react';
import { Gem, Hammer, ShieldCheck, Truck } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useShop } from '../context/ShopContext';

/**
 * BrandValues — 4-column icon bar with luxury micro-animations and page routing:
 * 925 STERLING SILVER | FINE CRAFTSMANSHIP | DELIVERY 5–7 DAYS | 90-DAY WARRANTY
 */
export const BrandValues = () => {
  const { navigateToPage } = useShop();

  const values = [
    {
      icon: <Gem size={22} strokeWidth={1.4} />,
      title: '925 STERLING SILVER',
      desc: 'Certified Purity & Craftsmanship',
      targetPage: 'about',
    },
    {
      icon: <Hammer size={22} strokeWidth={1.4} />,
      title: 'FINE CRAFTSMANSHIP',
      desc: 'Hand-finished 925 Sterling Silver',
      targetPage: 'about',
    },
    {
      icon: <Truck size={22} strokeWidth={1.4} />,
      title: 'DELIVERY 5–7 DAYS',
      desc: 'Insured & Tracked Pan-India Shipping',
      targetPage: 'delivery',
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={1.4} />,
      title: '90-DAY WARRANTY',
      desc: 'Colour Protection Guarantee',
      targetPage: 'warranty',
    },
  ];

  const [rowRef, rowVisible] = useScrollAnimation(0.2);

  return (
    <section className="bg-white border-t border-b border-[#D8CFC3] py-6 sm:py-8">
      <div
        ref={rowRef}
        className="max-w-[1320px] mx-auto px-4 sm:px-10 grid grid-cols-2 md:grid-cols-4 stagger-children"
      >
        {values.map((v, i) => (
          <button
            key={i}
            onClick={() => navigateToPage(v.targetPage)}
            className={`group cursor-pointer flex flex-col items-center text-center py-3 px-2 sm:py-4 sm:px-4 rounded-sm transition-all duration-300 hover:bg-[#F9F6F0] reveal-up ${
              rowVisible ? 'visible' : ''
            } ${i !== values.length - 1 ? 'md:border-r md:border-[#D8CFC3]' : ''} ${
              i % 2 === 0 ? 'border-r border-[#D8CFC3]/60 md:border-r-0' : ''
            } ${i < 2 ? 'border-b border-[#D8CFC3]/60 md:border-b-0' : ''}`}
            style={{ transitionDelay: `${0.1 * i}s` }}
          >
            {/* Animated Icon with soft bounce and gold accent ring */}
            <div className="mb-2 w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center text-[#5C4038] group-hover:text-[#7B3F42] bg-[#F5EFEF]/60 group-hover:bg-[#F5EFEF] border border-transparent group-hover:border-[#C6A46A]/40 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-xs">
              <span className="hover-icon-float">{v.icon}</span>
            </div>

            <h4 className="font-sans text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.2em] text-[#2E2B2B] group-hover:text-[#7B3F42] uppercase leading-snug transition-colors duration-300">
              {v.title}
            </h4>
            <p className="text-[9.5px] sm:text-[10px] font-sans text-[#5C4038] mt-0.5 hidden sm:block leading-relaxed">
              {v.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
