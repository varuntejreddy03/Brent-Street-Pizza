import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-[#1A1A1A] text-[#CCCCCC] relative overflow-hidden">
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
      {/* Red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-[#1A1A1A]/8 blur-[80px] pointer-events-none" />

      {/* Pre-footer CTA */}
      <div className="border-b border-[#E8D8C8] relative z-10">
        <div className="container-custom py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-bebas text-[36px] md:text-[44px] tracking-wider text-[#CCCCCC] leading-none">
              Ready to Order Direct?
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/menu" className="btn-primary px-7 py-3 text-[13px]">
              Order Pickup <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/menu?tab=delivery" className="btn-primary px-7 py-3 text-[13px]">
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
              <h2 className="font-bebas text-[30px] tracking-widest text-[#CCCCCC] leading-none">BRENT STREET</h2>
              <h2 className="font-bebas text-[30px] tracking-widest text-[#CCCCCC] leading-none">PIZZA</h2>
            </div>
            <p className="font-inter text-[13px] text-[#CCCCCC] leading-relaxed max-w-[200px]">
              Brent Street Pizza is your local go-to for hot, fresh pizza made to order. Simple ingredients. Big flavour.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#E8D8C8] hover:border-[#C8201A] hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#CCCCCC] hover:text-[#C8201A] transition-all hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#E8D8C8] hover:border-[#C8201A] hover:bg-[#1A1A1A]/10 flex items-center justify-center text-[#CCCCCC] hover:text-[#C8201A] transition-all hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Nav */}
          <div className="flex flex-col gap-3">
            <h4 className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#CCCCCC] mb-2">Navigate</h4>
            {[
              { label: 'Home', path: '/' },
              { label: 'Our Menu', path: '/menu' },
              { label: 'Contact Us', path: '/contact' },
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="font-barlow text-[14px] font-600 text-[#CCCCCC] hover:text-[#C8201A] transition-colors duration-300 flex items-center gap-2 group"
              >
                <span className="w-0 h-[1px] bg-[#1A1A1A] group-hover:w-3 transition-all duration-300" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#CCCCCC] mb-2">Location</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#CCCCCC] mt-0.5 flex-shrink-0" />
              <p className="font-inter text-[13px] text-[#CCCCCC] leading-relaxed">2 Brent Street,<br />Glenorchy TAS 7010</p>
            </div>
            <a href="tel:0362724004" className="flex items-center gap-2.5 group">
              <Phone className="w-4 h-4 text-[#CCCCCC] flex-shrink-0" />
              <span className="font-bebas text-[22px] tracking-wider text-[#CCCCCC] group-hover:text-[#C8201A] transition-colors">03 6272 4004</span>
            </a>
          </div>

          {/* Col 4: Trading Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="font-barlow text-[11px] font-700 uppercase tracking-[0.25em] text-[#CCCCCC] mb-2">Trading Hours</h4>
            <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/10">
              <div className="mb-4">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#c9922a] mb-1">In-Store Pickup</p>
                <p className="font-inter text-[13px] text-white">Daily 11am – 8pm</p>
              </div>
              <div>
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#c9922a] mb-1">Delivery &amp; Uber Eats</p>
                <p className="font-inter text-[13px] text-white mb-1">Sun – Thu: 11am – 9:30pm</p>
                <p className="font-inter text-[13px] text-white">Fri – Sat: 11am – 11pm</p>
              </div>
            </div>
          </div>



        </div>

        {/* Gold divider */}
        <div className="divider-gold mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-barlow text-[11px] font-600 text-[#CCCCCC] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Brent Street Pizza — All Rights Reserved
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="font-barlow text-[11px] text-[#CCCCCC] hover:text-[#C8201A] transition-colors tracking-widest uppercase">Privacy Policy</Link>
            <Link to="/contact" className="font-barlow text-[11px] text-[#CCCCCC] hover:text-[#C8201A] transition-colors tracking-widest uppercase">Terms of Service</Link>
            <Link to="/admin" className="font-barlow text-[11px] text-[#CCCCCC]/50 hover:text-[#C8201A] transition-colors tracking-widest uppercase">Admin Login</Link>
            {/* Uber Eats — last resort fallback only */}
            <a
              href="https://www.ubereats.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-barlow text-[11px] text-[#CCCCCC] hover:text-[#C8201A] transition-colors tracking-widest uppercase"
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
