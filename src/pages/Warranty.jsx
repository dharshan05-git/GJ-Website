import React from 'react';
import { ShieldCheck, CheckCircle, XCircle, ArrowRight, Clock, Package, RefreshCw, AlertTriangle, Gem, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Warranty Page — 90-Day Colour Protection Guarantee
 * Strategy: Only covers plating colour degradation (re-plating cost ~₹200-400).
 * Excludes physical damage, scratches, misuse — keeping it profitable.
 */
export const Warranty = () => {
  const { navigateToPage } = useShop();
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [coveredRef, coveredVisible] = useScrollAnimation(0.1);
  const [notCoveredRef, notCoveredVisible] = useScrollAnimation(0.1);
  const [processRef, processVisible] = useScrollAnimation(0.1);
  const [faqRef, faqVisible] = useScrollAnimation(0.1);

  const covered = [
    'Natural colour fading or plating degradation within 90 days of purchase',
    'Tarnishing of gold plating under normal, everyday wear conditions',
    'Uneven discolouration not caused by external chemicals or misuse',
    'Manufacturing defects affecting the plating finish',
  ];

  const notCovered = [
    'Physical damage — scratches, dents, bending, or breakage',
    'Exposure to perfumes, lotions, chlorine, or harsh chemicals',
    'Stone loss, chain breakage, or clasp damage',
    'Intentional misuse, negligence, or improper storage',
    'Alterations or repairs done by third-party jewellers',
    'Normal wear & tear beyond the 90-day warranty period',
    'Products purchased from unauthorised resellers',
  ];

  const claimSteps = [
    {
      icon: <Package size={24} />,
      title: 'Contact Us',
      desc: 'Reach out via email or WhatsApp with your order number, photos of the issue, and a brief description. Our team responds within 24 hours.',
    },
    {
      icon: <RefreshCw size={24} />,
      title: 'Ship Your Piece',
      desc: 'We\'ll provide a prepaid shipping label. Pack your jewellery securely in the original packaging and ship it to our studio for inspection.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Receive & Wear',
      desc: 'Our artisans will re-plate your piece to its original glory within 5–7 business days. We\'ll ship it back — fully insured and beautifully packaged.',
    },
  ];

  const faqs = [
    {
      q: 'Does the 90-day warranty cover scratches?',
      a: 'No. The warranty exclusively covers colour degradation and plating wear. Physical damage such as scratches, dents, or bending is not covered.',
    },
    {
      q: 'Can I claim warranty if I used perfume near my jewellery?',
      a: 'Chemical exposure (perfumes, lotions, chlorine) voids the warranty as it accelerates plating degradation beyond normal conditions.',
    },
    {
      q: 'What happens after 90 days?',
      a: 'Beyond 90 days, we offer our Lifetime Jewellery Care service — re-plating is available at a nominal cost of ₹299–₹599 depending on the piece, ensuring your jewellery always looks brand new.',
    },
    {
      q: 'Do I need the original receipt?',
      a: 'Yes. Proof of purchase (order confirmation email or invoice) is required for all warranty claims.',
    },
    {
      q: 'How long does the warranty claim process take?',
      a: 'From the day we receive your piece, the re-plating and return typically takes 5–7 business days.',
    },
  ];

  return (
    <div className="bg-[#F5F1EA] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative bg-[#7B3F42] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(198,164,106,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(198,164,106,0.2) 0%, transparent 50%)',
          }} />
        </div>
        <div
          ref={heroRef}
          className={`max-w-[900px] mx-auto px-6 sm:px-12 text-center relative z-10 reveal-up ${heroVisible ? 'visible' : ''}`}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={28} className="text-[#C6A46A]" />
          </div>
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A46A] uppercase block mb-3">
            OUR PROMISE TO YOU
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wide mb-4">
            90-DAY COLOUR <span className="italic font-normal text-[#C6A46A]">WARRANTY</span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            Every Gevariya jewel is crafted in 925 sterling silver with premium gold plating. If your plating shows colour degradation within 90 days of purchase, we'll restore it — free of charge.
          </p>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 sm:py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div
            ref={coveredRef}
            className={`reveal-up ${coveredVisible ? 'visible' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={22} className="text-green-600" />
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wide">
                WHAT'S <span className="italic font-normal text-[#7B3F42]">COVERED</span>
              </h2>
            </div>
            <div className="bg-white border border-[#D8CFC3] rounded-lg p-6 sm:p-8 space-y-4">
              {covered.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-[13px] text-[#2E2B2B] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's NOT Covered ── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#D8CFC3]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div
            ref={notCoveredRef}
            className={`reveal-up ${notCoveredVisible ? 'visible' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle size={22} className="text-red-500" />
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wide">
                WHAT'S <span className="italic font-normal text-[#7B3F42]">NOT COVERED</span>
              </h2>
            </div>
            <div className="bg-[#FFF8F5] border border-[#E8D5CE] rounded-lg p-6 sm:p-8 space-y-4">
              {notCovered.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Claim ── */}
      <section className="py-16 sm:py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div
            ref={processRef}
            className={`reveal-up ${processVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-12">
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
                SIMPLE & TRANSPARENT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wide">
                HOW TO <span className="italic font-normal text-[#7B3F42]">CLAIM</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {claimSteps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#7B3F42] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                    {step.icon}
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#C6A46A] uppercase mb-1">
                    STEP {i + 1}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2E2B2B] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#5C4038] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lifetime Care ── */}
      <section className="py-16 sm:py-20 bg-[#7B3F42] text-white">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12 text-center">
          <Gem size={28} className="text-[#C6A46A] mx-auto mb-4" />
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A46A] uppercase block mb-3">
            BEYOND 90 DAYS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide mb-4">
            LIFETIME JEWELLERY <span className="italic font-normal text-[#C6A46A]">CARE</span>
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-lg mx-auto mb-6">
            Your Gevariya jewellery is designed to last. Beyond the 90-day warranty, our Lifetime Care service offers professional re-plating at a nominal cost of <strong className="text-white">₹299–₹599</strong> depending on the piece — ensuring your jewellery looks as stunning as the day you first wore it.
          </p>
          <button
            onClick={() => navigateToPage('contact')}
            className="inline-flex items-center gap-2 bg-white text-[#7B3F42] hover:bg-[#FAF6F0] font-sans font-semibold text-xs tracking-[0.22em] uppercase px-8 py-3.5 transition-colors shadow-md"
          >
            <span>CONTACT US</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div
            ref={faqRef}
            className={`reveal-up ${faqVisible ? 'visible' : ''}`}
          >
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wide">
                FREQUENTLY <span className="italic font-normal text-[#7B3F42]">ASKED</span>
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#D8CFC3] pb-5">
                  <h3 className="font-sans text-sm font-bold text-[#2E2B2B] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
