import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Instagram, Facebook, Check } from 'lucide-react';


export default function ContactUs() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) setSubmitted(true);
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen text-[#2B2B2B]">

      {/* Page Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/heropic.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF8F2] via-[#FDF8F2]/60 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#D4952A] block mb-3">
            — Get In Touch —
          </span>
          <h1 className="font-bebas text-[72px] md:text-[110px] text-[#1A1A1A] leading-none tracking-wider drop-shadow-2xl">
            CONTACT US
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C8201A] via-[#D4952A] to-transparent mx-auto mt-5" />
        </div>
      </div>

      <div className="container-custom py-20 px-4">

        {/* Top: Quick contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {[
            {
              icon: <Phone className="w-6 h-6" />,
              label: 'Call Us Directly',
              value: '03 6272 4004',
              href: 'tel:0362724004',
              color: '#C8201A',
            },
            {
              icon: <Mail className="w-6 h-6" />,
              label: 'Email Support',
              value: 'brentstreetgroup@gmail.com',
              href: 'mailto:brentstreetgroup@gmail.com',
              color: '#D4952A',
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              label: 'Our Location',
              value: '2 Brent St, Glenorchy 7010',
              href: 'https://maps.google.com/?q=2+Brent+St+Glenorchy',
              color: '#C8201A',
            },
          ].map(card => (
            <a
              key={card.label}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group bg-[#F5EDE0] rounded-[16px] border border-[#E8D8C8] p-6 flex items-center gap-5 hover:border-[#E8D8C8] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}30`, color: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] mb-0.5">{card.label}</p>
                <p className="font-barlow font-700 text-[15px] text-[#2B2B2B] group-hover:text-[#D4952A] transition-colors break-all">{card.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Main content: form + hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Message form */}
          <div className="bg-[#F5EDE0] rounded-[20px] border border-[#E8D8C8] p-8 md:p-10">
            <h2 className="font-bebas text-[36px] md:text-[44px] text-[#1A1A1A] tracking-wider mb-2">Send a Message</h2>
            <p className="font-inter text-[#555555] text-[14px] mb-8">For catering, large orders, or general enquiries — we reply within 4 hours.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] block mb-1.5">Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      value={formState.name}
                      onChange={e => setFormState(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jane Smith"
                      className="w-full bg-[#FDF8F2] border border-[#E8D8C8] focus:border-[#D4952A] rounded-[8px] px-4 py-3 font-inter text-[14px] text-[#1A1A1A] placeholder:text-[#555555] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] block mb-1.5">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formState.email}
                      onChange={e => setFormState(p => ({ ...p, email: e.target.value }))}
                      placeholder="jane@email.com"
                      className="w-full bg-[#FDF8F2] border border-[#E8D8C8] focus:border-[#D4952A] rounded-[8px] px-4 py-3 font-inter text-[14px] text-[#1A1A1A] placeholder:text-[#555555] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] block mb-1.5">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formState.subject}
                    onChange={e => setFormState(p => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g. Catering Enquiry"
                    className="w-full bg-[#FDF8F2] border border-[#E8D8C8] focus:border-[#D4952A] rounded-[8px] px-4 py-3 font-inter text-[14px] text-[#1A1A1A] placeholder:text-[#555555] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#555555] block mb-1.5">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formState.message}
                    onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                    placeholder="How can we help you?"
                    className="w-full bg-[#FDF8F2] border border-[#E8D8C8] focus:border-[#D4952A] rounded-[8px] px-4 py-3 font-inter text-[13px] text-[#1A1A1A] placeholder:text-[#555555] outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  id="contact-submit"
                  className="w-full btn-primary justify-center py-4 text-[14px]"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-5 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#C8201A]/20 border border-[#C8201A]/40 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#C8201A]" />
                </div>
                <h3 className="font-bebas text-[30px] text-[#1A1A1A] tracking-wider">Message Received!</h3>
                <p className="font-inter text-[14px] text-[#555555] max-w-xs">We'll reply to your email within a few hours. For urgent matters, call us directly.</p>
                <a href="tel:0362724004" className="font-bebas text-[28px] text-[#C8201A] tracking-wider hover:text-[#D4952A] transition-colors">
                  03 6272 4004
                </a>
              </div>
            )}
          </div>

          {/* Right: Hours + Map */}
          <div className="flex flex-col gap-6">
            {/* Hours card */}
            <div className="bg-[#F5EDE0] rounded-[20px] border border-[#E8D8C8] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-[#C8201A]/15 border border-[#C8201A]/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#C8201A]" />
                </div>
                <h3 className="font-bebas text-[26px] text-[#1A1A1A] tracking-wider">Trading Hours</h3>
              </div>

              {/* Pickup block */}
              <div className="bg-[#FDF8F2] rounded-[12px] border border-[#E8D8C8] p-4 mb-3">
                <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.25em] text-[#D4952A] mb-3">In-Store Pickup</p>
                <div className="flex justify-between items-center">
                  <span className="font-inter text-[14px] text-[#555555]">Daily</span>
                  <span className="font-bebas text-[22px] text-[#2B2B2B] tracking-wider">11am – 8pm</span>
                </div>
              </div>

              {/* Delivery block */}
              <div className="bg-[#FDF8F2] rounded-[12px] border border-[#E8D8C8] p-4">
                <p className="font-barlow text-[10px] font-700 uppercase tracking-[0.25em] text-[#D4952A] mb-3">Delivery &amp; Uber Eats</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-[14px] text-[#555555]">Sun – Thu</span>
                    <span className="font-bebas text-[22px] text-[#2B2B2B] tracking-wider">11am – 9:30pm</span>
                  </div>
                  <div className="h-px bg-[#1A1A1A]/5" />
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-[14px] text-[#555555]">Fri – Sat</span>
                    <span className="font-bebas text-[22px] text-[#2B2B2B] tracking-wider">11am – 11pm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-[20px] overflow-hidden border border-[#E8D8C8] shadow-xl flex-grow min-h-[250px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2925.33405391264!2d147.2798651756543!3d-42.84461994073347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaa6ddab79f29bf4d%3A0xc6cb1c4b72782e34!2s2%20Brent%20St%2C%20Glenorchy%20TAS%207010%2C%20Australia!5e0!3m2!1sen!2sau!4v1709121654316!5m2!1sen!2sau"
                width="100%"
                height="260"
                style={{ border: 0, filter: 'brightness(0.65) saturate(0.5) invert(1) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                title="Brent Street Location Map"
              />
            </div>

            {/* Social */}
            <div className="bg-[#F5EDE0] rounded-[20px] border border-[#E8D8C8] p-6 flex items-center justify-between">
              <p className="font-barlow font-700 text-[14px] uppercase tracking-wider text-[#555555]">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-[#E8D8C8] hover:border-[#C8201A] hover:bg-[#C8201A]/10 flex items-center justify-center text-[#555555] hover:text-[#FFFCF7] transition-all hover:scale-110">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-[#E8D8C8] hover:border-[#C8201A] hover:bg-[#C8201A]/10 flex items-center justify-center text-[#555555] hover:text-[#FFFCF7] transition-all hover:scale-110">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
