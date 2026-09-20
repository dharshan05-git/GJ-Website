import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Instagram, Facebook, CheckCircle2 } from 'lucide-react';
import { GevariyaLogo } from '../components/GevariyaLogo';
import * as api from '../services/api';

/**
 * Contact page — Book a Private Consultation
 * Optimized for mobile touch screens and desktop viewports.
 */
export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', preferredDate: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.bookConsultation(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Could not send your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const set = (k) => (e) => setFormData(d => ({ ...d, [k]: e.target.value }));

  const inputCls = 'w-full bg-[#EDE7DE] border border-[#D8CFC3] pl-10 pr-4 py-3 text-xs font-sans text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42] transition-colors rounded-xs';

  return (
    <div className="bg-[#F5F1EA] min-h-screen">

      {/* ── 1. Consultation Room Hero Image with Logo Overlay ── */}
      <section className="relative w-full overflow-hidden" style={{ height: '300px' }}>
        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1800&q=85"
          alt="Gevariya Jewels Private Consultation Studio"
          className="w-full h-full object-cover object-center brightness-[0.82]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        {/* Centered logo + brand name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <GevariyaLogo size="xl" isDarkBackground={true} />
        </div>
      </section>

      {/* ── 2. Title ── */}
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8 text-center px-4">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#2E2B2B] uppercase font-light tracking-wider">
          BOOK A PRIVATE CONSULTATION
        </h1>
        <p className="text-xs sm:text-[13px] font-sans text-[#5C4038] mt-2 max-w-md mx-auto">
          Our master artisans and stylists are here to assist your bespoke requirements.
        </p>
      </section>

      {/* ── 3. Form + Studio Info ── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-10">
          <div className="bg-white border border-[#D8CFC3] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm rounded-xl">

            {/* Left: Form */}
            <div className="lg:col-span-7 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#D8CFC3]">
              {submitted ? (
                <div className="text-center py-10 sm:py-12 space-y-4">
                  <CheckCircle2 size={40} className="text-[#7B3F42] mx-auto" />
                  <h3 className="font-serif text-2xl text-[#2E2B2B] uppercase">Consultation Confirmed</h3>
                  <p className="text-xs text-[#5C4038] max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-[#2E2B2B]">{formData.name}</span>. Our concierge will reach you at <span className="text-[#7B3F42]">{formData.email}</span>.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="font-sans font-semibold text-xs tracking-widest text-white uppercase bg-[#7B3F42] hover:bg-[#623033] py-3 px-6 mt-2 rounded-xs">
                    BOOK ANOTHER SESSION
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-3.5 text-[#8A726A]" />
                    <input type="text" required placeholder="Your Name"     value={formData.name}         onChange={set('name')}          className={inputCls} />
                  </div>
                  <div className="relative flex items-center">
                    <Mail size={14} className="absolute left-3.5 text-[#8A726A]" />
                    <input type="email" required placeholder="Email Address" value={formData.email}        onChange={set('email')}         className={inputCls} />
                  </div>
                  <div className="relative flex items-center">
                    <Phone size={14} className="absolute left-3.5 text-[#8A726A]" />
                    <input type="tel" required placeholder="Phone Number"   value={formData.phone}        onChange={set('phone')}         className={inputCls} />
                  </div>
                  <div className="relative flex items-center">
                    <Calendar size={14} className="absolute left-3.5 text-[#8A726A]" />
                    <input type="date" required                              value={formData.preferredDate} onChange={set('preferredDate')} className={inputCls} />
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the piece or occasion you have in mind…"
                    value={formData.message}
                    onChange={set('message')}
                    className="w-full bg-[#EDE7DE] border border-[#D8CFC3] p-3.5 text-xs font-sans text-[#2E2B2B] placeholder-[#8A726A] outline-none focus:border-[#7B3F42] transition-colors resize-none rounded-xs"
                  />
                  {error && (
                    <p className="text-[11px] text-[#B3261E] bg-[#FDECEA] border border-[#F5C6C0] px-3 py-2 rounded-xs">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-sans font-semibold text-xs tracking-[0.24em] text-white uppercase bg-[#7B3F42] hover:bg-[#623033] disabled:bg-[#B6ADA6] disabled:cursor-not-allowed py-3.5 sm:py-4 transition-colors shadow-xs rounded-xs active:scale-98"
                  >
                    {submitting ? 'SENDING…' : 'BOOK NOW'}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Studio Details */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-5 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2E2B2B] uppercase tracking-wide">
                  MUMBAI ATELIER
                </h3>
                
                <div className="space-y-3 text-xs text-[#5C4038]">
                  <p className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#7B3F42] shrink-0 mt-0.5" />
                    <span>Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone size={14} className="text-[#7B3F42] shrink-0" />
                    <span>+91 98765 43210</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail size={14} className="text-[#7B3F42] shrink-0" />
                    <span>hello@gevariyajewels.com</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D8CFC3]">
                  <h4 className="text-[10.5px] font-bold text-[#2E2B2B] uppercase tracking-wider mb-1">
                    Operating Hours
                  </h4>
                  <p className="text-[11px] text-[#5C4038]">
                    Monday – Saturday: 10:00 AM – 7:30 PM IST<br />
                    Sunday: Private Appointments Only
                  </p>
                </div>
              </div>

              {/* Socials */}
              <div className="pt-3 border-t border-[#D8CFC3] flex items-center gap-3">
                {[Instagram, Facebook].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white border border-[#D8CFC3] flex items-center justify-center text-[#5C4038] hover:text-[#7B3F42] hover:border-[#7B3F42] transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
