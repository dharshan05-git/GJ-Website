import React from 'react';
import { Diamond, Hammer, Clock, Award } from 'lucide-react';

export const ValueProps = () => {
  const props = [
    {
      icon: <Diamond size={24} className="text-[#7A2E3B]" />,
      title: "ETHICAL DIAMONDS",
      desc: "100% Conflict-free certified gems"
    },
    {
      icon: <Hammer size={24} className="text-[#7A2E3B]" />,
      title: "FINE CRAFTSMANSHIP",
      desc: "Meticulously handcrafted in 18k gold"
    },
    {
      icon: <Clock size={24} className="text-[#7A2E3B]" />,
      title: "TIMELESS DESIGN",
      desc: "Heirloom pieces designed to last"
    },
    {
      icon: <Award size={24} className="text-[#7A2E3B]" />,
      title: "LIFETIME WARRANTY",
      desc: "Complimentary polishing & inspection"
    }
  ];

  return (
    <section className="bg-[#FAF6F0] py-12 border-b border-[#E8DFD7]">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
          {props.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-4 group">
              <div className="w-14 h-14 rounded-full bg-[#F3EAE1] border border-[#D4AF37]/30 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#7A2E3B] group-hover:text-white">
                {item.icon}
              </div>
              <h4 className="font-serif text-sm font-bold tracking-widest text-[#2C2623] uppercase">
                {item.title}
              </h4>
              <p className="text-xs text-[#736B66] mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
