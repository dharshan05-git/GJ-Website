import React from 'react';
import { Gem, Award, Clock, ShieldCheck, Users, Lightbulb, Rocket, Building2, Globe } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * About Us — The Gevariya Jewels founder's real journey from 2023 to 2026
 */
export const About = () => {
  const { navigateToPage } = useShop();

  const [storyRef, storyVisible] = useScrollAnimation(0.1);
  const [timelineRef, timelineVisible] = useScrollAnimation(0.05);
  const [valuesRef, valuesVisible] = useScrollAnimation(0.1);

  const milestones = [
    {
      year: '2023',
      icon: <Lightbulb size={20} strokeWidth={1.5} />,
      title: 'The Spark',
      desc: 'It all started with a passion for jewellery. Our founder began designing jewels from scratch, teaching himself every curve and contour. He picked up CAD (Computer-Aided Design) to bring his visions to life digitally — spending countless hours mastering the craft.',
    },
    {
      year: '2023',
      icon: <Clock size={20} strokeWidth={1.5} />,
      title: 'The 9-to-5 Grind',
      desc: 'To sustain his dream, he took up a regular 9-to-5 job during the day. But his nights belonged to jewellery. He started freelancing as a side hustle — working tirelessly until 2–3 AM every night, pouring his heart into every design that came his way.',
    },
    {
      year: '2024',
      icon: <Rocket size={20} strokeWidth={1.5} />,
      title: 'The Leap of Faith',
      desc: 'After months of burning the midnight oil, the freelancing work grew enough to sustain him. He made the boldest decision of his career — leaving the safety of his 9-to-5 job to go full-time freelance. Every day became a step closer to the bigger dream.',
    },
    {
      year: 'Early 2025',
      icon: <Building2 size={20} strokeWidth={1.5} />,
      title: 'The First Office',
      desc: 'With growing demand and a vision that outgrew his home workspace, he opened the first official Gevariya Jewels office. He hired his first staff member — someone who shared his passion for craftsmanship and excellence.',
    },
    {
      year: '2025–2026',
      icon: <Users size={20} strokeWidth={1.5} />,
      title: '20 Strong & Growing',
      desc: 'What started as a one-man operation rapidly grew into a team of around 20 skilled artisans, designers, and specialists. Together, they began crafting bespoke jewellery for customers across India — each piece a testament to the journey that brought them here.',
    },
    {
      year: 'September 2026',
      icon: <Globe size={20} strokeWidth={1.5} />,
      title: 'The Digital Launch',
      desc: 'Today, we\'re proud to launch the Gevariya Jewels website — bringing our handcrafted 925 sterling silver creations to the world. Every piece you see represents years of sacrifice, late nights, and an unwavering commitment to quality.',
    },
  ];

  return (
    <div className="bg-[#F5F1EA] min-h-screen">

      {/* ── 1. Cinematic Banner ── */}
      <section className="relative w-full overflow-hidden" style={{ height: '400px' }}>
        <img
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1800&q=85"
          alt="Artisan jeweler at work"
          className="w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E2B2B]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-12">
          <div className="text-center">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A46A] uppercase block mb-2">
              OUR STORY
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white uppercase font-light tracking-wide">
              THE JOURNEY OF <span className="italic font-normal text-[#C6A46A]">GEVARIYA</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── 2. Founder's Story ── */}
      <section className="py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-12">
          <div
            ref={storyRef}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal-up ${storyVisible ? 'visible' : ''}`}
          >
            {/* Left */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase">
                FROM PASSION TO PURPOSE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#2E2B2B] leading-[1.15] uppercase">
                BUILT ON LATE NIGHTS<br />
                <span className="italic font-normal text-[#7B3F42]">& UNWAVERING BELIEF.</span>
              </h2>
              <p className="text-xs sm:text-[13px] font-sans text-[#5C4038] leading-relaxed max-w-lg">
                Gevariya Jewels wasn't born in a boardroom — it was forged in the quiet hours between midnight and dawn. Our founder, an actor, storyteller, and poet at heart, discovered his calling in the art of jewellery design in 2023.
              </p>
              <p className="text-xs sm:text-[13px] font-sans text-[#5C4038] leading-relaxed max-w-lg">
                What started as a curiosity quickly became an obsession. He taught himself CAD design, took a 9-to-5 job to pay the bills, and spent every night until 2–3 AM freelancing — turning sketches into wearable art. When the side hustle outgrew the day job, he took the leap.
              </p>
              <p className="text-xs sm:text-[13px] font-sans text-[#5C4038] leading-relaxed max-w-lg">
                By early 2025, the first Gevariya office opened its doors. One staff member became five, then ten, then twenty. Today, we're a team of artisans, designers, and dreamers — and this September 2026 marks the launch of everything we've built.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateToPage('shop', 'ALL')}
                  className="font-sans font-semibold text-[11px] tracking-[0.22em] text-white uppercase bg-[#7B3F42] hover:bg-[#623033] py-3.5 px-9 transition-colors shadow-xs"
                >
                  EXPLORE OUR CREATIONS
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden border border-[#D8CFC3] shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
                  alt="925 Sterling Silver Jewellery on Design Sketches"
                  className="w-full object-cover object-center"
                  style={{ height: '420px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Journey Timeline ── */}
      <section className="py-20 bg-white border-b border-[#D8CFC3]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
              THE MILESTONES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
              HOW WE <span className="italic font-normal text-[#7B3F42]">GOT HERE</span>
            </h2>
            <div className="mt-4 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#7B3F42] to-transparent w-48" />
          </div>

          <div ref={timelineRef} className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D8CFC3] via-[#7B3F42] to-[#D8CFC3]" />

            <div className="space-y-10">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`relative flex gap-6 sm:gap-8 pl-2 reveal-up ${timelineVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${0.1 * idx}s` }}
                >
                  {/* Dot */}
                  <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#7B3F42] flex items-center justify-center text-[#7B3F42] shrink-0 shadow-sm">
                    {m.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#C6A46A] uppercase bg-[#FAF6F0] px-2.5 py-0.5 rounded-sm border border-[#EDE5DC]">
                        {m.year}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2E2B2B] mb-1.5">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Brand Values ── */}
      <section
        ref={valuesRef}
        className="bg-[#F5F1EA] py-12 border-b border-[#D8CFC3]"
      >
        <div className={`max-w-[1320px] mx-auto px-6 sm:px-10 grid grid-cols-2 md:grid-cols-4 text-center reveal-up ${valuesVisible ? 'visible' : ''}`}>
          {[
            { icon: <Gem         size={20} strokeWidth={1.4} />, title: '925 STERLING SILVER' },
            { icon: <Award       size={20} strokeWidth={1.4} />, title: 'EXCEPTIONAL QUALITY'  },
            { icon: <Clock       size={20} strokeWidth={1.4} />, title: 'TIMELESS DESIGN'      },
            { icon: <ShieldCheck size={20} strokeWidth={1.4} />, title: '90-DAY WARRANTY'    },
          ].map((v, i) => (
            <div
              key={i}
              className={`flex flex-col items-center px-4 py-6 ${
                i !== 3 ? 'md:border-r md:border-[#D8CFC3]' : ''
              }`}
            >
              <div className="mb-2.5 text-[#5C4038] opacity-70">{v.icon}</div>
              <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#2E2B2B]">
                {v.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
