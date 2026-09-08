import React from 'react';
import { Truck, ShieldCheck, Clock, PackageCheck, MapPin, CheckCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Delivery Page — Insured Shipping & Delivery in 5 to 7 Days
 */
export const Delivery = () => {
  const { navigateToPage } = useShop();

  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [stepsRef, stepsVisible] = useScrollAnimation(0.1);
  const [partnersRef, partnersVisible] = useScrollAnimation(0.1);
  const [packagingRef, packagingVisible] = useScrollAnimation(0.1);
  const [faqRef, faqVisible] = useScrollAnimation(0.1);

  const deliverySteps = [
    {
      step: '01',
      title: 'Order Confirmation & Hallmarking Check',
      time: 'Day 1',
      desc: 'Each piece undergoes a rigorous quality audit and BIS 925 Hallmarking verification at our Mumbai atelier before packaging.',
    },
    {
      step: '02',
      title: 'Handcrafted Secure Packaging',
      time: 'Day 1–2',
      desc: 'Your jewel is cocooned inside our signature velvet presentation box, wrapped in a tamper-evident, sealed security pouch.',
    },
    {
      step: '03',
      title: 'Insured Express Dispatch',
      time: 'Day 2–3',
      desc: 'Handed over to our premier armoured courier partners (Sequel Logistics & Blue Dart Apex) with full transit insurance coverage.',
    },
    {
      step: '04',
      title: 'Delivered to Your Doorstep',
      time: 'Day 5–7',
      desc: 'Delivered securely to your doorstep across all pincodes in India with OTP-verified handoff for complete peace of mind.',
    },
  ];

  const features = [
    {
      icon: <Truck size={24} className="text-[#7B3F42]" />,
      title: 'Complimentary Pan-India Shipping',
      desc: 'Enjoy free insured express delivery on all orders with zero hidden freight charges.',
    },
    {
      icon: <ShieldCheck size={24} className="text-[#7B3F42]" />,
      title: '100% Insured in Transit',
      desc: 'Every shipment is fully insured by Gevariya Jewels from the moment it leaves our atelier until it is in your hands.',
    },
    {
      icon: <Clock size={24} className="text-[#7B3F42]" />,
      title: '5 to 7 Business Days Delivery',
      desc: 'Fast express transit ensuring your jewellery arrives promptly for your special occasions.',
    },
    {
      icon: <PackageCheck size={24} className="text-[#7B3F42]" />,
      title: 'Discreet Tamper-Proof Packaging',
      desc: 'Shipped in unbranded, discreet outer boxes with tamper-proof security seals to safeguard privacy.',
    },
  ];

  const faqs = [
    {
      q: 'How many days will it take for my order to arrive?',
      a: 'Standard orders arrive within 5 to 7 business days. Ready-to-ship items are dispatched within 24–48 hours. Customised bespoke pieces take an additional 3–5 crafting days before dispatch.',
    },
    {
      q: 'Is my package insured during shipping?',
      a: 'Yes, 100%! Every single parcel sent by Gevariya Jewels is fully covered by transit insurance. In the rare event of damage or loss in transit, you receive an immediate replacement or full refund.',
    },
    {
      q: 'How do I track my order status?',
      a: 'Once your parcel is dispatched, you will receive an SMS and email notification containing your live courier tracking link and AWB number to monitor progress in real-time.',
    },
    {
      q: 'Do you deliver to my pincode?',
      a: 'We deliver to over 19,000+ pincodes across India through premier courier partners including Blue Dart, Delhivery, and Sequel Secure Logistics.',
    },
    {
      q: 'Can I change my delivery address after placing an order?',
      a: 'Yes, you can update your shipping address within 12 hours of placing the order by contacting our support team via WhatsApp or email before dispatch.',
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
            <Truck size={28} className="text-[#C6A46A]" />
          </div>
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A46A] uppercase block mb-3">
            FAST, SAFE & COMPLIMENTARY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wide mb-4">
            INSURED SHIPPING & <span className="italic font-normal text-[#C6A46A]">DELIVERY</span>
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl mx-auto">
            Experience seamless, complimentary express delivery across India in <strong>5 to 7 days</strong>. Every order is 100% insured and packaged with discreet luxury protection.
          </p>
        </div>
      </section>

      {/* ── 2. Four Core Pillars ── */}
      <section className="py-16 sm:py-20 border-b border-[#D8CFC3]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-[#D8CFC3] rounded-lg p-6 sm:p-7 hover:border-[#7B3F42] transition-colors shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-[#F9F6F0] border border-[#E8D5CE] flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#2E2B2B] mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-[#5C4038] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Step-by-Step Delivery Timeline ── */}
      <section className="py-20 bg-white border-b border-[#D8CFC3]">
        <div className="max-w-[960px] mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
              HOW YOUR JEWEL TRAVELS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
              THE 5–7 DAY <span className="italic font-normal text-[#7B3F42]">DELIVERY TIMELINE</span>
            </h2>
            <div className="mt-4 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#7B3F42] to-transparent w-48" />
          </div>

          <div ref={stepsRef} className="relative">
            <div className="space-y-8">
              {deliverySteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row gap-4 sm:gap-6 bg-[#FAF7F2] border border-[#E8D5CE] rounded-lg p-6 sm:p-7 reveal-up ${
                    stepsVisible ? 'visible' : ''
                  }`}
                  style={{ transitionDelay: `${0.1 * idx}s` }}
                >
                  <div className="flex items-center sm:flex-col justify-between sm:justify-start gap-2 shrink-0 sm:w-28 border-b sm:border-b-0 sm:border-r border-[#D8CFC3] pb-3 sm:pb-0 sm:pr-4">
                    <span className="font-serif text-2xl font-bold text-[#7B3F42]">{step.step}</span>
                    <span className="text-[10px] font-bold tracking-widest text-[#C6A46A] bg-white px-2.5 py-1 rounded border border-[#D8CFC3] uppercase">
                      {step.time}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-[#2E2B2B] mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Packaging & Security ── */}
      <section
        ref={packagingRef}
        className={`py-20 border-b border-[#D8CFC3] reveal-up ${packagingVisible ? 'visible' : ''}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase">
              LUXURY UNBOXING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] font-light uppercase leading-tight">
              TAMPER-PROOF PACKAGING,<br />
              <span className="italic font-normal text-[#7B3F42]">ELEGANT PRESENTATION.</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-[#5C4038] leading-relaxed">
              Every Gevariya order is presented inside a plush branded jewellery box accompanied by a certificate of authenticity, warranty card, and silver care polishing cloth.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                'BIS 925 Hallmark Authenticity Certificate included with every order',
                'Signature blush velvet presentation keepsake box',
                'Discreet outer transit box with tamper-evident security barcode seals',
                'Microfiber jewellery polishing cloth & anti-tarnish storage pouch',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={15} className="text-[#7B3F42] shrink-0" />
                  <span className="text-xs text-[#2E2B2B]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-[#D8CFC3] shadow-md bg-white">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Jewellery Packaging"
                className="w-full h-[360px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6 sm:px-12">
          <div ref={faqRef} className={`reveal-up ${faqVisible ? 'visible' : ''}`}>
            <div className="text-center mb-12">
              <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#7B3F42] uppercase block mb-2">
                HAVE QUESTIONS?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2E2B2B] uppercase font-light tracking-wide">
                DELIVERY <span className="italic font-normal text-[#7B3F42]">FAQS</span>
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

            <div className="mt-12 p-6 bg-[#FAF7F2] border border-[#E8D5CE] rounded-lg text-center">
              <h4 className="font-serif text-lg font-semibold text-[#2E2B2B] mb-2">Need Urgent Order Support or Custom Dispatch?</h4>
              <p className="text-xs text-[#5C4038] mb-4">Our concierge team is available Monday to Saturday (10 AM to 7 PM IST).</p>
              <button
                onClick={() => navigateToPage('contact')}
                className="inline-flex items-center gap-2 bg-[#7B3F42] hover:bg-[#623033] text-white font-sans font-semibold text-xs tracking-[0.2em] uppercase px-7 py-3 transition-colors shadow-xs"
              >
                <span>CONTACT CONCIERGE</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
