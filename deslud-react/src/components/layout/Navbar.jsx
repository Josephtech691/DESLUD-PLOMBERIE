divcomponents/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Btn } from '../ui';

const NAV_LINKS = [
  { href: '#services',     label: 'Services'      },
  { href: '#pourquoi',     label: 'Pourquoi nous' },
  { href: '#processus',    label: 'Processus'     },
  { href: '#temoignages',  label: 'Avis clients'  },
  { href: '#suivi',        label: 'Suivi devis'   },
  { href: '#contact',      label: 'Contact'       },
];

const DROPDOWN_ITEMS = [
  { label: '🔧 Services',   type: 'scroll', target: '#services' },
  { label: '📖 À propos',   type: 'page',   target: '/about'    },
  { label: '✏️ Blog',        type: 'page',   target: '/blog'     },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active,       setActive]       = useState('');
  const dropdownRef = useRef(null);
  const navigate   = useNavigate();
  const location   = useLocation();

  // Pages secondaires : about, blog, article de blog
  const isSecondaryPage = location.pathname !== '/';

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (!isSecondaryPage) {
        document.querySelectorAll('section[id]').forEach((s) => {
          if (window.scrollY >= s.offsetTop - 100 && window.scrollY < s.offsetTop + s.offsetHeight - 100) {
            setActive(`#${s.id}`);
          }
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isSecondaryPage]);

  // Navigation principale
  // Sur page secondaire → tout ramène à l'accueil section #contact
  const handleNav = (href) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    document.body.style.overflow = '';

    if (isSecondaryPage) {
      // Toujours ramener à l'accueil section contact
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector('#contact');
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }, 300);
      return;
    }

    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  // Gestion du dropdown (Services / À propos / Blog)
  const handleDropdownItem = (item) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    document.body.style.overflow = '';

    if (item.type === 'page') {
      navigate(item.target);
      window.scrollTo(0, 0);
    } else {
      // scroll vers section
      if (isSecondaryPage) {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(item.target);
          if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.querySelector(item.target);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }
    }
  };

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy/97 backdrop-blur-xl shadow-card' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex items-center justify-between h-20">

          {/* Logo */}
‎<button onClick={() => handleNav('#hero')} className="flex items-center gap-3">
‎  <div className="w-36 sm:w-40 flex-shrink-0">
‎    <img
‎      src="images/logodeslud.png"
‎      alt="Deslud Plomberie"
‎      className="w-full h-auto object-contain"
‎      style={{ maxHeight: '48px' }}
‎    />
‎  </div>
‎</button>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => handleNav(href)}
                  className={`font-display text-[14px] font-semibold tracking-[0.08em] uppercase px-3 py-2 rounded-lg transition-all duration-200
                    ${!isSecondaryPage && active === href
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/8'}`}
                >
                  {label}
                </button>
              </li>
            ))}

            {/* ── Dropdown "Pages" ── */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 font-display text-[14px] font-semibold tracking-[0.08em] uppercase px-3 py-2 rounded-lg transition-all duration-200
                  ${dropdownOpen ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'}`}
              >
                Pages
                <span className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-navy-2 border border-blue-deslud/20 rounded-2xl shadow-card overflow-hidden z-50">
                  {/* Petit triangle */}
                  <div className="absolute -top-2 right-5 w-4 h-4 bg-navy-2 border-l border-t border-blue-deslud/20 rotate-45" />
                  <div className="p-2">
                    {DROPDOWN_ITEMS.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleDropdownItem(item)}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-[0.06em] text-white/70 hover:text-white hover:bg-white/8 transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+237683906225" className="flex items-center gap-2 font-display font-bold text-cyan-deslud text-base tracking-wide hover:text-cyan-deslud-2 transition-colors">
              <Phone size={16} strokeWidth={2.5} />
              683 90 62 25
            </a>
            <Btn size="sm" onClick={() => handleNav('#contact')}>Devis gratuit</Btn>
          </div>

          {/* Hamburger */}
          <button onClick={toggleMobile} className="lg:hidden p-2 text-white" aria-label="Menu">
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`fixed top-20 inset-x-0 bg-navy/99 backdrop-blur-xl z-40 border-b border-white/5 transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">

          {/* Liens principaux */}
          <div className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map(({ href, label }) => (
              <button key={href} onClick={() => handleNav(href)}
                className="font-display text-xl font-bold uppercase tracking-[0.05em] text-white/70 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-left transition-all">
                {label}
              </button>
            ))}
          </div>

          {/* Section Pages dans mobile */}
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-4 mb-2">Pages</div>
            {DROPDOWN_ITEMS.map((item) => (
              <button key={item.label} onClick={() => handleDropdownItem(item)}
                className="w-full font-display text-xl font-bold uppercase tracking-[0.05em] text-white/70 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-left transition-all">
                {item.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div className="border-t border-white/8 pt-4 flex flex-col gap-3">
            <a href="tel:+237683906225" className="flex items-center gap-3 font-display font-bold text-xl text-cyan-deslud">📞 683 90 62 25</a>
            <a href="tel:+237658518788" className="flex items-center gap-3 font-display font-bold text-xl text-cyan-deslud">📞 658 51 87 88</a>
            <Btn className="w-full justify-center mt-1" onClick={() => handleNav('#contact')}>Demander un devis gratuit</Btn>
          </div>
        </div>
      </div>
    </>
  );
              }
