import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-[#110800] text-white relative overflow-hidden">
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
      {/* Red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#C0392B]/8 blur-[80px] pointer-events-none" />

      {/* Pre-footer CTA */}
      <div className="border-b border-white/5 relative z-10">
        <div className="container-custom py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-bebas text-[36px] md:text-[44px] tracking-wider text-white leading-none">
              Ready to Order Direct?
            </h3>
            <p className="font-inter text-white/40 text-[13px] mt-1">
              Get free garlic bread on direct orders. No app fees ever.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/menu" className="btn-primary px-7 py-3 text-[13px]">
              Order Pickup <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/menu" className="btn-outline px-7 py-3 text-[13px]">
              Order Delivery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-custom pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-14">

          {/* Col 1: Brand */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-bebas text-[30px] tracking-widest text-white leading-none">BRENT STREET</h2>
              <h2 className="font-bebas text-[30px] tracking-widest text-[#C0392B] leading-none">PIZZA</h2>
            </div>
            <p className="font-inter text-[13px] text-white/35 leading-relaxed max-w-[200px]">
              Authentic Italian pizza crafted with passion, served hot daily since 2026.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/10 hover:border-[#C0392B] hover:bg-[#C0392B]/10 flex items-center justify-center text-white/30 hover:text-white transition-all hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/10 hover:border-[#C0392B] hover:bg-[#C0392B]/10 flex items-center justify-center text-white/30 hover:text-white transition-all hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Nav */}
          <div className="flex flex-col gap-3">
            <h4 className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-white/25 mb-2">Navigate</h4>
            {[
              { label: 'Home', path: '/' },
              { label: 'Our Menu', path: '/menu' },
              { label: 'Contact Us', path: '/contact' },
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="font-barlow text-[14px] font-600 text-white/40 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
              >
                <span className="w-0 h-[1px] bg-[#C0392B] group-hover:w-3 transition-all duration-300" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Contact + Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-white/25 mb-2">Contact</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C0392B] mt-0.5 flex-shrink-0" />
              <p className="font-inter text-[13px] text-white/40 leading-relaxed">2 Brent Street,<br />Glenorchy TAS 7010</p>
            </div>
            <a href="tel:0455123678" className="flex items-center gap-2.5 group">
              <Phone className="w-4 h-4 text-[#C0392B] flex-shrink-0" />
              <span className="font-bebas text-[22px] tracking-wider text-white/70 group-hover:text-[#d4a017] transition-colors">0455 123 678</span>
            </a>
            <div className="flex items-center gap-2.5 mt-2">
              <Clock className="w-4 h-4 text-[#d4a017] flex-shrink-0" />
              <p className="font-barlow text-[13px] font-600 text-white/40">
                Daily 11:00 AM – 11:00 PM
              </p>
            </div>
          </div>


        </div>

        {/* Gold divider */}
        <div className="divider-gold mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-barlow text-[11px] font-600 text-white/20 tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Brent Street Pizza — All Rights Reserved
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="font-barlow text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-widest uppercase">Privacy Policy</Link>
            <Link to="/contact" className="font-barlow text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-widest uppercase">Terms of Service</Link>
            <Link to="/admin" className="font-barlow text-[11px] text-[#C0392B]/50 hover:text-[#C0392B] transition-colors tracking-widest uppercase">Admin Login</Link>
            {/* Uber Eats — last resort fallback only */}
            <a
              href="https://www.ubereats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-barlow text-[11px] text-white/15 hover:text-white/35 transition-colors tracking-widest uppercase"
            >
              Also on Uber Eats
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
