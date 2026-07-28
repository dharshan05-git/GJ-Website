import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Calendar, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-10 lg:py-16">
      <div className="container">
        
        {/* Studio Consultation Grid matching View 5 */}
        <div className="bg-white rounded-xs border border-[#E8DFD7] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 mb-16">
          
          {/* Left Column: Studio Interior Banner Picture matching View 5 */}
          <div className="lg:col-span-6 relative bg-black min-h-[420px] lg:min-h-[600px] flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=85" 
              alt="Gevariya Jewels Private Studio Lounge"
              className="w-full h-full object-cover opacity-80 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1615] via-[#1A1615]/30 to-transparent" />
            
            <div className="relative z-10 text-center p-8 text-white space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-[#7A2E3B] text-2xl font-serif font-bold shadow-xl">
                GJ
              </div>
              <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                GEVARIYA JEWELS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light">
                BOOK A PRIVATE CONSULTATION
              </h2>
              <p className="text-xs text-[#E8DFD7] max-w-md mx-auto font-light leading-relaxed">
                Our gemologists and master designers are here to help you find or create the perfect bespoke piece in total privacy.
              </p>
            </div>
          </div>

          {/* Right Column: Consultation Booking Form matching View 5 */}
          <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
            
            {submitted ? (
              <div className="text-center space-y-4 py-12">
                <CheckCircle2 size={48} className="text-[#7A2E3B] mx-auto" />
                <h3 className="font-serif text-2xl text-[#2C2623]">CONSULTATION REQUEST RECEIVED</h3>
                <p className="text-xs text-[#736B66] max-w-sm mx-auto">
                  Thank you, <span className="font-bold text-[#2C2623]">{formData.name}</span>. Our concierge team will contact you shortly at {formData.email} to confirm your appointment at our Bandra Kurla Complex studio.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn-primary text-xs py-2 px-6"
                >
                  BOOK ANOTHER SESSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold tracking-wider text-[#2C2623] uppercase mb-4">
                  BOOK A PRIVATE CONSULTATION
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#736B66] uppercase mb-1">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD7] px-4 py-2.5 text-xs text-[#2C2623] outline-none rounded-xs focus:border-[#7A2E3B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#736B66] uppercase mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFD7] px-4 py-2.5 text-xs text-[#2C2623] outline-none rounded-xs focus:border-[#7A2E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#736B66] uppercase mb-1">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFD7] px-4 py-2.5 text-xs text-[#2C2623] outline-none rounded-xs focus:border-[#7A2E3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#736B66] uppercase mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-[#7A2E3B]" /> Preferred Date
                  </label>
                  <input 
                    type="date" 
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD7] px-4 py-2.5 text-xs text-[#2C2623] outline-none rounded-xs focus:border-[#7A2E3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#736B66] uppercase mb-1">
                    Message / Special Requests
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about the ring or fine jewelry piece you are looking to explore..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E8DFD7] px-4 py-2.5 text-xs text-[#2C2623] outline-none rounded-xs focus:border-[#7A2E3B]"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full btn-primary py-3.5 uppercase tracking-widest text-xs font-bold"
                >
                  BOOK NOW
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Studio Info Panel matching View 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 border border-[#E8DFD7] rounded-xs shadow-xs text-left">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#7A2E3B] shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold uppercase text-[#2C2623]">VISIT OUR STUDIO</h4>
              <p className="text-xs text-[#736B66] mt-1 leading-relaxed">
                Bandra Kurla Complex, Bandra East, Mumbai, 400051
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#7A2E3B] shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold uppercase text-[#2C2623]">CALL US</h4>
              <p className="text-xs text-[#736B66] mt-1">
                +91 98765 43210
              </p>
              <p className="text-[11px] text-[#9E958F]">Mon - Sat: 10:00 AM - 8:00 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#7A2E3B] shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold uppercase text-[#2C2623]">EMAIL US</h4>
              <p className="text-xs text-[#736B66] mt-1">
                hello@gevariyajewels.com
              </p>
              <p className="text-[11px] text-[#9E958F]">24/7 Concierge Support</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
