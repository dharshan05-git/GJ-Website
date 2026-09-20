import React from 'react';
import { Gem, Hammer, Clock, Award } from 'lucide-react';

export const ValueProps = () => {
  const props = [
    {
      icon: <Gem size={24} className="text-[#7B3F42]" />,
      title: "925 STERLING SILVER",
      desc: "Certified purity & hallmarked quality"
    },
    {
      icon: <Hammer size={24} className="text-[#7B3F42]" />,
      title: "FINE CRAFTSMANSHIP",
      desc: "Meticulously handcrafted in 925 silver"
    },
    {
      icon: <Clock size={24} className="text-[#7B3F42]" />,
      title: "TIMELESS DESIGN",
      desc: "Heirloom pieces designed to last"
    },
    {
      icon: <Award size={24} className="text-[#7B3F42]" />,
      title: "90-DAY WARRANTY",
      desc: "Complimentary colour protection"
    }
  ];

  return (
    <section className="bg-[#F5F1EA] py-12 border-b border-[#D8CFC3]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
          {props.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-4 group">
              <div className="w-14 h-14 rounded-full bg-[#EDE7DE] border border-[#D8CFC3] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#7B3F42] group-hover:text-white">
                {item.icon}
              </div>
              <h4 className="font-serif text-sm font-bold tracking-widest text-[#2E2B2B] uppercase">
                {item.title}
              </h4>
              <p className="text-xs text-[#5C4038] mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
