import React from 'react';
import { Star, Heart, Shield } from 'lucide-react';

export const WhyChooseUs = () => {
  const points = [
    {
      icon: <Star size={36} fill="#7A2E3B" stroke="none" className="text-[#7A2E3B]" />,
      title: "Certified Excellence",
      desc: "100% Hallmarked 18K Solid Gold & Certified Diamonds for lasting beauty."
    },
    {
      icon: <Heart size={36} fill="#7A2E3B" stroke="none" className="text-[#7A2E3B]" />,
      title: "Crafted with Devotion",
      desc: "Every piece is delicately forged by skilled artisans in our studio."
    },
    {
      icon: <Shield size={36} fill="#7A2E3B" stroke="none" className="text-[#7A2E3B]" />,
      title: "Hypoallergenic & Pure",
      desc: "Safe for sensitive skin. 100% Nickel-free and skin-conscious."
    },
    {
      icon: <Star size={36} fill="#7A2E3B" stroke="none" className="text-[#7A2E3B]" />,
      title: "Timeless Elegance",
      desc: "Elegant heirloom designs created to never go out of style."
    }
  ];

  return (
    <section className="bg-[#FAF6F0] py-20 border-b border-[#E8DFD7]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Title matching user image */}
        <div className="text-center mb-14">
          <h2 
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#7A2E3B] tracking-wide"
            style={{ fontWeight: 400 }}
          >
            WHY CHOOSE GEVARIYA?
          </h2>
        </div>

        {/* 4 Clean Columns matching user image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {points.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center max-w-xs mx-auto">
              <div className="mb-5 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#2C2623] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-[#736B66] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
