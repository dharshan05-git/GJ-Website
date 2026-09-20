import React from 'react';
import { Star, Heart, Shield } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * WhyChooseUs — Exactly matches Reference Image 2:
 * "WHY CHOOSE GEVARIYA?" centered serif header in burgundy.
 * 2x2 Grid on mobile with solid burgundy filled icons, serif titles, and minimal descriptions.
 */
export const WhyChooseUs = () => {
  const points = [
    {
      icon: <Star size={30} fill="#7B3F42" stroke="none" />,
      title: "Premium Quality",
      desc: "Finest 925 Sterling Silver for lasting beauty."
    },
    {
      icon: <Heart size={30} fill="#7B3F42" stroke="none" />,
      title: "Crafted with Care",
      desc: "Every piece is delicately crafted by skilled artisans."
    },
    {
      icon: <Shield size={30} fill="#7B3F42" stroke="none" />,
      title: "Hypoallergenic",
      desc: "Safe for sensitive skin. Nickel-free."
    },
    {
      icon: <Star size={30} fill="#7B3F42" stroke="none" />,
      title: "Timeless Designs",
      desc: "Elegant pieces that never go out of style."
    }
  ];

  const [headingRef, headingVisible] = useScrollAnimation(0.12);
  const [gridRef, gridVisible] = useScrollAnimation(0.1);

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#D8CFC3]">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10">

        {/* Heading — Exactly matching Reference Image 2 */}
        <div
          ref={headingRef}
          className={`text-center mb-12 sm:mb-16 reveal-up ${headingVisible ? 'visible' : ''}`}
        >
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#7B3F42] uppercase tracking-[0.06em] font-light">
            WHY CHOOSE GEVARIYA?
          </h2>
        </div>

        {/* 2x2 Grid on Mobile (2 cols on mobile, 4 cols on desktop) */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 gap-x-4 sm:gap-x-8 text-center stagger-children"
        >
          {points.map((item, idx) => (
            <div
              key={idx}
              className={`group flex flex-col items-center max-w-[180px] mx-auto reveal-up ${
                gridVisible ? 'visible' : ''
              }`}
              style={{ transitionDelay: `${0.08 * idx}s` }}
            >
              {/* Solid Burgundy Filled Icon */}
              <div className="mb-3 sm:mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-115">
                {item.icon}
              </div>

              {/* Title in Serif Font */}
              <h3 className="font-serif text-[14px] sm:text-base font-medium text-[#2E2B2B] mb-1.5 transition-colors duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-[10.5px] sm:text-xs text-[#5C4038] leading-relaxed max-w-[145px] sm:max-w-[180px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
