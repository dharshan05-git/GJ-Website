import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "The Luna Solitaire Ring exceeded all my expectations! The gold finish and diamond sparkle are unmatched.",
      product: "Luna Solitaire Ring"
    },
    {
      id: 2,
      name: "Ananya Deshmukh",
      location: "Delhi",
      rating: 5,
      comment: "Ordered the Diamond Drop Earrings for my anniversary. The packaging and craftsmanship are pure luxury!",
      product: "Diamond Drop Earrings"
    },
    {
      id: 3,
      name: "Meera Kapoor",
      location: "Bengaluru",
      rating: 5,
      comment: "Gevariya Jewels is my go-to for fine 18k jewelry. The customer service and insured delivery were so fast.",
      product: "Classic Solitaire Pendant"
    },
    {
      id: 4,
      name: "Ridhi Mehta",
      location: "Ahmedabad",
      rating: 5,
      comment: "The Tiara Tennis Bracelet feels so premium and heavy in solid gold. Absolutely in love with this brand!",
      product: "Tiara Tennis Bracelet"
    },
    {
      id: 5,
      name: "Kavya Reddy",
      location: "Hyderabad",
      rating: 5,
      comment: "Bespoke consultation was smooth and seamless. Certified diamonds and hallmarked gold guaranteed.",
      product: "Oval Diamond Ring"
    }
  ];

  // Duplicate list for seamless infinite loop effect
  const marqueeItems = [...reviews, ...reviews];

  return (
    <section className="bg-[#F3EAE1] py-14 border-t border-b border-[#E8DFD7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#7A2E3B] uppercase">
          CLIENT LOVE & REVIEWS
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2623] uppercase mt-1">
          WHAT OUR PATRONS SAY
        </h2>
        <div className="w-16 h-0.5 bg-[#7A2E3B] mx-auto mt-2" />
      </div>

      {/* Marquee Track - Left to Right scrolling, pauses on hover */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee hover:pause cursor-pointer w-max">
          {marqueeItems.map((rev, idx) => (
            <div 
              key={idx}
              className="w-80 sm:w-96 bg-white p-6 rounded-xs border border-[#E8DFD7] shadow-sm flex flex-col justify-between shrink-0 transition-transform duration-300 hover:scale-102 hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4AF37" stroke="none" />
                  ))}
                </div>
                <Quote size={20} className="text-[#7A2E3B]/30 mb-2" />
                <p className="text-xs text-[#2C2623] italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-[#2C2623]">{rev.name}</span>
                  <span className="text-[#736B66] text-[11px] block">{rev.location}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#7A2E3B] bg-[#FAF6F0] px-2 py-0.5 rounded-xs border border-[#E8DFD7]">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
