import React from 'react';
import { RefreshCw, CheckCircle, XCircle, ArrowRight, ShieldCheck, HelpCircle, Package, HeartHandshake } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Returns & Exchange Policy Page — 7-Day Easy Returns & Hassle-Free Exchanges
 */
export const Returns = () => {
  const { navigateToPage } = useShop();

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [rulesRef, rulesVisible] = useScrollAnimation(0.1);
  const [stepsRef, stepsVisible] = useScrollAnimation(0.1);
  const [faqRef, faqVisible] = useScrollAnimation(0.1);

  const eligibleItems = [
    'Items returned within 7 calendar days from the verified delivery date',
    'Jewellery must be in unworn, brand-new condition without scratches or signs of wear',
    'All original packaging, velvet box, certificates, and tags must be intact',
    'Standard catalog pieces (rings, necklaces, earrings, bracelets, curated sets)',
  ];

  const nonEligibleItems = [
    'Custom-engraved, personalised, or bespoke custom-designed creations',
    'Pieces showing visible signs of wear, perfume exposure, alteration, or damage',
    'Requests initiated after the 7-day return/exchange window has lapsed',
    'Items returned without original security tags or authenticity certificates',
  ];

  const steps = [
    {
      num: '1',
      title: 'Initiate Your Request',
      desc: 'Contact our support concierge via WhatsApp (+91 98765 43210) or email (hello@gevariyajewels.com) with your Order ID and photos.',
    },
    {
      num: '2',
      title: 'Free Reverse Pickup',
      desc: 'We arrange a complimentary insured courier pickup directly from your doorstep with secure tamper-evident packaging.',
    },
    {
      num: '3',
      title: 'Artisan Quality Inspection',
      desc: 'Once received at our Mumbai atelier, our gemologists inspect the item within 24–48 hours to confirm original condition.',
    },
    {
      num: '4',
      title: 'Instant Refund / Exchange',
      desc: 'Your replacement size is immediately dispatched, or your full refund is credited back to your original payment method in 3–5 days.',
    },
  ];

  const faqs = [
    {
      q: 'How many days do I have to return or exchange an item?',
      a: 'You have 7 calendar days from the date your shipment was delivered according to courier tracking records to initiate a return or exchange request.',
    },
    {
      q: 'Are reverse pickups chargeable?',
      a: 'No! Reverse pickup is 100% complimentary for all eligible returns and exchanges across India.',
    },
    {
      q: 'How long does the refund process take?',
      a: 'Once the returned item passes our quality inspection (within 24–48 hours of receipt), refunds are processed instantly. Bank account and UPI credits reflect in 3 to 5 business days.',
    },
    {
      q: 'What if my ring does not fit?',
      a: 'We offer a free first-time ring size exchange within 7 days. Simply let our team know your revised size, and we will swap it for you at zero shipping charge.',
    },
    {
      q: 'Can I return bespoke or customised jewellery?',
      a: 'Bespoke custom-made creations and custom engraved items are crafted specifically for you and cannot be returned for refund, but are covered under our 90-Day Colour Warranty and resizing support.',
    },
  ];

  return (
    <div className="bg-[#F5F1EA] min-h-screen">

      {/* ── 1. Hero ── */}
      <section className="relative bg-[#7B3F42] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(198,164,106,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(198,164,106,0.25) 0%, transparent 50%)',
            }}
          />
        </div>
        <div
          ref={heroRef}
          className={`max-w-[920px] mx-auto px-6 sm:px-12 text-center relative z-10 reveal-up ${
            heroVisible ? 'visible' : ''
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <RefreshCw size={28} className="text-[#C6A46A]" />
          </div>
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A46A] uppercase block mb-3">
            SHOP WITH ABSOLUTE CONFIDENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wide mb-4">
            RETURNS & <span className="italic font-normal text-[#C6A46A]">EXCHANGE POLICY</span>
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl mx-auto">
            We want you to love your Gevariya jewel unconditionally. If it is not everything you envisioned, enjoy our <strong>7-Day Easy Return &amp; Exchange Policy</strong> with free insured doorstep reverse pickup.
          </p>
        </div>
      </section>

      {/* ── 2. Eligibility Overview ── */}
      <section className="py-16 sm:py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-12">
          <div
            ref={rulesRef}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 reveal-up ${rulesVisible ? 'visible' : ''}`}
          >
            {/* Eligible */}
            <div className="bg-white border border-[#D8CFC3] rounded-lg p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#D8CFC3]">
                <CheckCircle size={20} className="text-green-600" />
                <h3 className="font-serif text-xl text-[#2E2B2B] font-medium">Eligible for Return / Exchange</h3>
              </div>
              <div className="space-y-3.5">
                {eligibleItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-[13px] text-[#2E2B2B] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Eligible */}
            <div className="bg-[#FFF8F5] border border-[#E8D5CE] rounded-lg p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E8D5CE]">
                <XCircle size={20} className="text-red-500" />
                <h3 className="font-serif text-xl text-[#2E2B2B] font-medium">Non-Eligible Conditions</h3>
              </div>
              <div className="space-y-3.5">
                {nonEligibleItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Step-by-Step Return Workflow ── */}
      <section className="py-20 bg-white border-b border-[#D8CFC3]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
              SEAMLESS 4-STEP PROCESS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
              HOW TO INITIATE A <span className="italic font-normal text-[#7B3F42]">RETURN OR EXCHANGE</span>
            </h2>
            <div className="mt-4 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#7B3F42] to-transparent w-48" />
          </div>

          <div
            ref={stepsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-up ${stepsVisible ? 'visible' : ''}`}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] border border-[#E8D5CE] rounded-lg p-6 flex flex-col justify-between hover:border-[#7B3F42] transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#7B3F42] text-white flex items-center justify-center font-serif font-bold text-sm mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#2E2B2B] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5C4038] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions ── */}
      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div ref={faqRef} className={`reveal-up ${faqVisible ? 'visible' : ''}`}>
            <div className="text-center mb-12">
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
                CLEAR & TRANSPARENT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
                FREQUENTLY ASKED <span className="italic font-normal text-[#7B3F42]">QUESTIONS</span>
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#D8CFC3] pb-5">
                  <h3 className="font-sans text-sm font-bold text-[#2E2B2B] mb-2 flex items-center gap-2">
                    <HelpCircle size={15} className="text-[#7B3F42] shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-[#7B3F42] text-white rounded-lg text-center">
              <HeartHandshake size={28} className="text-[#C6A46A] mx-auto mb-3" />
              <h4 className="font-serif text-2xl font-light uppercase tracking-wide mb-2">
                Need Help with a Return or Size Exchange?
              </h4>
              <p className="text-xs text-white/80 max-w-md mx-auto mb-6">
                Our support team is happy to guide you through size fitting, return pickup scheduling, and instant replacements.
              </p>
              <button
                onClick={() => navigateToPage('contact')}
                className="inline-flex items-center gap-2 bg-white text-[#7B3F42] hover:bg-[#FAF6F0] font-sans font-semibold text-xs tracking-[0.22em] uppercase px-8 py-3.5 transition-colors shadow-md"
              >
                <span>CONTACT CUSTOMER SUPPORT</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
