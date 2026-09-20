import React from 'react';
import { Star, Quote, CheckCircle2, Award } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "The Luna Solitaire Ring exceeded all my expectations! The gold finish and diamond sparkle are unmatched.",
      product: "Luna Solitaire Ring",
      verified: true,
    },
    {
      id: 2,
      name: "Ananya Deshmukh",
      location: "Delhi",
      rating: 5,
      comment: "Ordered the Diamond Drop Earrings for my anniversary. The packaging, certification, and craftsmanship are pure luxury!",
      product: "Diamond Drop Earrings",
      verified: true,
    },
    {
      id: 3,
      name: "Meera Kapoor",
      location: "Bengaluru",
      rating: 5,
      comment: "Gevariya Jewels is my go-to for fine 18k jewelry. The customer service and insured delivery were remarkably fast.",
      product: "Classic Solitaire Pendant",
      verified: true,
    },
    {
      id: 4,
      name: "Ridhi Mehta",
      location: "Ahmedabad",
      rating: 5,
      comment: "The Tiara Tennis Bracelet feels so premium and heavy in solid gold. Absolutely in love with this brand!",
      product: "Tiara Tennis Bracelet",
      verified: true,
    },
    {
      id: 5,
      name: "Kavya Reddy",
      location: "Hyderabad",
      rating: 5,
      comment: "Bespoke consultation was smooth and seamless. Certified diamonds and hallmarked gold guaranteed. Truly world-class.",
      product: "Oval Diamond Ring",
      verified: true,
    }
  ];

  const [headingRef, headingVisible] = useScrollAnimation(0.15);
  const [trackRef, trackVisible] = useScrollAnimation(0.1);

  return (
    <section className="bg-[#FAF7F2] py-20 border-t border-b border-[#D8CFC3] overflow-hidden relative">
      {/* Background ambient luxury glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#C6A46A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Heading Section ── */}
      <div
        ref={headingRef}
        className={`max-w-4xl mx-auto px-6 mb-12 text-center reveal-up ${headingVisible ? 'visible' : ''}`}
      >
        <div className="inline-flex items-center gap-2 bg-[#E8D5CE]/60 border border-[#DBC5B8] px-3.5 py-1 rounded-full mb-3">
          <Award size={13} className="text-[#7B3F42]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#7B3F42] uppercase">
            PATRON STORIES & REVIEWS
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2B2B] uppercase tracking-wider font-light">
          WORDS FROM OUR <span className="italic font-normal text-[#7B3F42]">CONNOISSEURS</span>
        </h2>

        <div className="mt-3 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#7B3F42] to-transparent w-48" />

        {/* Aggregate Trust Pill */}
        <div className="flex items-center justify-center gap-3 mt-4 text-xs text-[#5C4038]">
          <div className="flex items-center text-[#C6A46A] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#C6A46A" stroke="none" />
            ))}
          </div>
          <span className="font-bold text-[#2E2B2B]">4.9 / 5.0</span>
          <span className="text-[#8A726A]">• Over 1,200+ Verified 5-Star Reviews</span>
        </div>
      </div>

      {/* ── Dual Track Infinite Running Marquee with Edge Gradient Mask ── */}
      <div
        ref={trackRef}
        className={`marquee-container relative w-full overflow-hidden marquee-edge-mask flex reveal-fade ${
          trackVisible ? 'visible' : ''
        }`}
      >
        {/* Track 1 */}
        <div className="animate-marquee-track py-4">
          {reviews.map((rev) => (
            <div
              key={`track1-${rev.id}`}
              className="w-[290px] sm:w-[380px] bg-white p-5 sm:p-7 rounded-sm border border-[#D8CFC3]/90 shadow-xs flex flex-col justify-between shrink-0 luxury-card-interactive group select-none"
            >
              <div>
                {/* Stars + Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C6A46A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="#C6A46A"
                        stroke="none"
                        className="star-shimmer"
                      />
                    ))}
                  </div>
                  <Quote size={22} className="text-[#9B6668]/30 group-hover:text-[#7B3F42] transition-colors duration-300" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-[13px] text-[#5C4038] italic leading-relaxed font-serif">
                  "{rev.comment}"
                </p>
              </div>

              {/* Patron Info & Product Badge */}
              <div className="mt-6 pt-4 border-t border-[#EDE7DE] flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-[#2E2B2B] text-[13px] group-hover:text-[#7B3F42] transition-colors">
                      {rev.name}
                    </span>
                    {rev.verified && (
                      <span className="inline-flex items-center text-[#7B3F42]" title="Verified Buyer">
                        <CheckCircle2 size={12} fill="#7B3F42" stroke="#FFFFFF" />
                      </span>
                    )}
                  </div>
                  <span className="text-[#8A726A] text-[11px]">{rev.location}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold tracking-wider text-[#7B3F42] bg-[#F5EFEF] px-2.5 py-1 border border-[#E0D0CE] uppercase group-hover:border-[#7B3F42] transition-colors">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Track 2 (Duplicate for 100% seamless infinite loop) */}
        <div className="animate-marquee-track py-4" aria-hidden="true">
          {reviews.map((rev) => (
            <div
              key={`track2-${rev.id}`}
              className="w-[290px] sm:w-[380px] bg-white p-5 sm:p-7 rounded-sm border border-[#D8CFC3]/90 shadow-xs flex flex-col justify-between shrink-0 luxury-card-interactive group select-none"
            >
              <div>
                {/* Stars + Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C6A46A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="#C6A46A"
                        stroke="none"
                        className="star-shimmer"
                      />
                    ))}
                  </div>
                  <Quote size={22} className="text-[#9B6668]/30 group-hover:text-[#7B3F42] transition-colors duration-300" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-[13px] text-[#5C4038] italic leading-relaxed font-serif">
                  "{rev.comment}"
                </p>
              </div>

              {/* Patron Info & Product Badge */}
              <div className="mt-6 pt-4 border-t border-[#EDE7DE] flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-[#2E2B2B] text-[13px] group-hover:text-[#7B3F42] transition-colors">
                      {rev.name}
                    </span>
                    {rev.verified && (
                      <span className="inline-flex items-center text-[#7B3F42]" title="Verified Buyer">
                        <CheckCircle2 size={12} fill="#7B3F42" stroke="#FFFFFF" />
                      </span>
                    )}
                  </div>
                  <span className="text-[#8A726A] text-[11px]">{rev.location}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold tracking-wider text-[#7B3F42] bg-[#F5EFEF] px-2.5 py-1 border border-[#E0D0CE] uppercase group-hover:border-[#7B3F42] transition-colors">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
