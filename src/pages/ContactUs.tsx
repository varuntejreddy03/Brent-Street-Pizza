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
    <div className="bg-[#1a0a00] min-h-screen text-white">

      {/* Page Hero */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/heropic.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/60 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-3">
            — Get In Touch —
          </span>
          <h1 className="font-bebas text-[72px] md:text-[110px] text-white leading-none tracking-wider drop-shadow-2xl">
            CONTACT US
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C0392B] via-[#d4a017] to-transparent mx-auto mt-5" />
        </div>
      </div>

      <div className="container-custom py-20 px-4">

        {/* Top: Quick contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {[
            {
              icon: <Phone className="w-6 h-6" />,
              label: 'Call Us Directly',
              value: '0455 123 678',
              href: 'tel:0455123678',
              color: '#C0392B',
            },
            {
              icon: <Mail className="w-6 h-6" />,
              label: 'Email Support',
              value: 'brentstreetgroup@gmail.com',
              href: 'mailto:brentstreetgroup@gmail.com',
              color: '#d4a017',
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              label: 'Our Location',
              value: '2 Brent St, Glenorchy 7010',
              href: 'https://maps.google.com/?q=2+Brent+St+Glenorchy',
              color: '#C0392B',
            },
          ].map(card => (
            <a
              key={card.label}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group bg-[#2b1200] rounded-[16px] border border-white/8 p-6 flex items-center gap-5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}30`, color: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 mb-0.5">{card.label}</p>
                <p className="font-barlow font-700 text-[15px] text-white group-hover:text-[#d4a017] transition-colors break-all">{card.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Main content: form + hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Message form */}
          <div className="bg-[#2b1200] rounded-[20px] border border-white/8 p-8 md:p-10">
            <h2 className="font-bebas text-[36px] md:text-[44px] text-white tracking-wider mb-2">Send a Message</h2>
            <p className="font-inter text-white/40 text-[14px] mb-8">For catering, large orders, or general enquiries — we reply within 4 hours.</p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      value={formState.name}
                      onChange={e => setFormState(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jane Smith"
                      className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder:text-white/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formState.email}
                      onChange={e => setFormState(p => ({ ...p, email: e.target.value }))}
                      placeholder="jane@email.com"
                      className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder:text-white/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    value={formState.subject}
                    onChange={e => setFormState(p => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g. Catering Enquiry"
                    className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder:text-white/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formState.message}
                    onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                    placeholder="How can we help you?"
                    className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[13px] text-white placeholder:text-white/20 outline-none transition-all resize-none"
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
                <div className="w-16 h-16 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#C0392B]" />
                </div>
                <h3 className="font-bebas text-[30px] text-white tracking-wider">Message Received!</h3>
                <p className="font-inter text-[14px] text-white/40 max-w-xs">We'll reply to your email within a few hours. For urgent matters, call us directly.</p>
                <a href="tel:0455123678" className="font-bebas text-[28px] text-[#C0392B] tracking-wider hover:text-[#d4a017] transition-colors">
                  0455 123 678
                </a>
              </div>
            )}
          </div>

          {/* Right: Hours + Map */}
          <div className="flex flex-col gap-6">
            {/* Hours card */}
            <div className="bg-[#2b1200] rounded-[20px] border border-white/8 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-[#C0392B]/15 border border-[#C0392B]/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#C0392B]" />
                </div>
                <h3 className="font-bebas text-[26px] text-white tracking-wider">Trading Hours</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'In-Store Pickup', hours: 'Daily 11am – 8pm', sub: '' },
                  { day: 'Delivery & Uber Eats', hours: '', sub: '' },
                  { day: 'Sun – Thu', hours: '11am – 9:30pm', sub: '' },
                  { day: 'Fri – Sat', hours: '11am – 11pm', sub: '' },
                ].map(row => (
                  <div key={row.day} className={`flex justify-between items-center py-2 border-b border-white/5 ${
                    row.day === 'Delivery & Uber Eats' ? 'pt-4' : ''
                  }`}>
                    <span className={`font-barlow text-[14px] font-600 ${
                      row.day === 'In-Store Pickup' || row.day === 'Delivery & Uber Eats'
                        ? 'text-[#c9922a] font-700 uppercase tracking-wider text-[12px]'
                        : 'text-white/60'
                    }`}>{row.day}</span>
                    {row.hours && <span className="font-bebas text-[18px] text-white tracking-wider">{row.hours}</span>}
                  </div>
                ))}
              </div>

            </div>

            {/* Map embed */}
            <div className="rounded-[20px] overflow-hidden border border-white/8 shadow-xl flex-grow min-h-[250px]">
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
            <div className="bg-[#2b1200] rounded-[20px] border border-white/8 p-6 flex items-center justify-between">
              <p className="font-barlow font-700 text-[14px] uppercase tracking-wider text-white/50">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C0392B] hover:bg-[#C0392B]/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/10 hover:border-[#C0392B] hover:bg-[#C0392B]/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110">
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
