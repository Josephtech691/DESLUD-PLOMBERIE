// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { Btn } from '../ui';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#pourquoi', label: 'Pourquoi nous' },
  { href: '#processus', label: 'Processus' },
  { href: '#temoignages', label: 'Avis clients' },
  { href: '#suivi', label: 'Suivi devis' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Active section tracking
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100 && window.scrollY < s.offsetTop + s.offsetHeight - 100) {
          setActive(`#${s.id}`);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href) => {
    setMobileOpen(false);
    document.body.style.overflow = '';
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy/97 backdrop-blur-xl shadow-card' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#hero" onClick={() => handleNav('#hero')} className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-deslud rounded-xl flex items-center justify-center text-2xl shadow-glow-blue flex-shrink-0">💧</div>
            <div className="leading-none">
              <div className="font-display text-xl font-black text-white uppercase tracking-[0.05em]">Deslud</div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-deslud">Plomberie</div>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => handleNav(href)}
                  className={`font-display text-[15px] font-semibold tracking-[0.08em] uppercase px-3.5 py-2 rounded-lg transition-all duration-200
                    ${active === href ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+237683906225" className="flex items-center gap-2 font-display font-bold text-cyan-deslud text-base tracking-wide hover:text-cyan-deslud-2 transition-colors">
              <Phone size={16} strokeWidth={2.5} />
              683 90 62 25
            </a>
            <Btn size="sm" onClick={() => handleNav('#contact')}>Devis gratuit</Btn>
          </div>

          {/* Hamburger */}
          <button onClick={toggleMobile} className="lg:hidden p-2 text-white" aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className={`fixed top-20 inset-x-0 bg-navy/99 backdrop-blur-xl z-40 border-b border-white/5 transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-6 flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <button key={href} onClick={() => handleNav(href)}
              className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-white/70 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg text-left transition-all">
              {label}
            </button>
          ))}
          <div className="mt-5 pt-5 border-t border-white/8 flex flex-col gap-3">
            <a href="tel:+237683906225" className="flex items-center gap-3 font-display font-bold text-xl text-cyan-deslud">📞 683 90 62 25</a>
            <a href="tel:+237658518788" className="flex items-center gap-3 font-display font-bold text-xl text-cyan-deslud">📞 658 51 87 88</a>
            <Btn className="w-full justify-center mt-2" onClick={() => handleNav('#contact')}>Demander un devis gratuit</Btn>
          </div>
        </div>
      </div>
    </>
  );
}
