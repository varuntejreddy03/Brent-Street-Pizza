import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, Phone } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHero = currentPath === '/' && !scrolled;


  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'MENU', path: '/menu' },
    { name: 'DEALS', path: '/deals' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-white shadow-md`}
        style={{ height: '90px' }}
      >
        <div className="container-custom h-full flex items-center justify-between relative">

          {/* Logo */}
          <Link to="/" className={`transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 ${isHero ? 'absolute left-4 md:left-8 top-4 md:-top-4 z-[110]' : 'flex items-center z-50'}`}>
            <Logo
              className={`transition-all duration-500 rounded-full border-[5px] border-[#E8D8C8] overflow-hidden bg-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex justify-center items-center ${isHero
                ? 'w-[160px] h-[160px] md:w-[280px] md:h-[280px]'
                : 'w-[70px] h-[70px] md:w-[76px] md:h-[76px]'}`}
              innerClassName={`w-full h-full object-cover rounded-full transition-transform duration-500 ${isHero ? 'scale-[1.18]' : 'scale-[1.1]'}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden lg:flex items-center gap-1 transition-all duration-500 ${isHero ? 'md:ml-[300px]' : 'md:ml-[20px]'}`}>
            {navLinks.map((link, idx) => (
              <React.Fragment key={link.name}>
                <Link
                  to={link.path}
                  className={`font-barlow text-[13px] md:text-[14px] font-700 uppercase tracking-widest transition-all duration-300 px-3 py-1 rounded relative group ${currentPath === link.path
                    ? 'text-[#1A1A1A]'
                    : 'text-black hover:text-[#C8201A]'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-[#C8201A] transition-all duration-300 ${currentPath === link.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                </Link>
                {idx < navLinks.length - 1 && (
                  <span className="text-black/20 text-xs select-none mx-2">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right: Phone + Cart + CTA */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto relative z-[120]">
            <a
              href="tel:0362724004"
              className="hidden md:flex items-center gap-2 text-black hover:text-[#C8201A] transition-colors duration-300 group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>


            <Link
              to="/menu"
              className="hidden sm:flex bg-[#C8201A] text-white hover:bg-[#9E1510] font-barlow font-800 tracking-wider text-[15px] px-6 py-2.5 rounded-sm shadow-md transition-all duration-300"
            >
              ORDER NOW <span className="ml-1 text-lg leading-none">›</span>
            </Link>

            {/* Mobile Toggle */}
            <button
              id="mobile-menu-toggle"
              className="lg:hidden text-black p-1"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-[#FDF8F2] border-l border-[#E8D8C8] transition-transform duration-500 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-[#E8D8C8]">
            <Logo className="w-14 h-14" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors">
              <X className="w-7 h-7" />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-6 flex-grow">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-barlow text-[28px] font-700 tracking-widest uppercase transition-all px-2 py-3 border-b border-[#E8D8C8] ${currentPath === link.path ? 'text-[#1A1A1A]' : 'text-[#1A1A1A] hover:text-[#C8201A]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="p-6 border-t border-[#E8D8C8]">
            <a href="tel:0362724004" className="flex items-center gap-3 text-[#1A1A1A] hover:text-[#C8201A] transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-barlow text-[20px] font-700 tracking-wider">03 6272 4004</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
