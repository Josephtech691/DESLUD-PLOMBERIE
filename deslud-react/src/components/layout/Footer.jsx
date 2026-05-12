// src/components/layout/Footer.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';

const services  = ['Installation sanitaire', 'Entretien & maintenance', 'Dépannage rapide', 'Réparation de fuites', 'Réparation tuyauterie'];
const navLinks  = ['Accueil', 'Pourquoi nous', 'Processus', 'Avis clients', 'Suivi devis', 'Contact'];
const navHrefs  = ['#hero', '#pourquoi', '#processus', '#temoignages', '#suivi', '#contact'];

const contacts = [
  { icon: '📞', val: '683 90 62 25', href: 'tel:+237683906225'             },
  { icon: '📞', val: '658 51 87 88', href: 'tel:+237658518788'             },
  { icon: '✉️', val: 'ludovicnono83@gmail.com', href: 'mailto:ludovicnono83@gmail.com' },
  { icon: '📍', val: 'Yaoundé, Cameroun', href: null                       },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Sur page secondaire → ramène à l'accueil section #contact
  const isSecondaryPage = location.pathname !== '/';

  const handleNav = (href) => {
    if (isSecondaryPage) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector('#contact');
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.querySelector(href);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try { await api.subscribe(email); setSent(true); setEmail(''); } catch {}
  };

  return (
    <footer className="bg-navy-2 relative overflow-hidden">
      {/* Ligne dégradée en haut */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-deslud via-cyan-deslud to-blue-deslud" />

      <div className="container mx-auto px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/[0.06]">

          ‎{/* Brand */}
‎<div>
‎  <div className="mb-5">
‎    <img
‎      src="images/logodeslud.png"
‎      alt="Deslud Plomberie"
‎      className="h-14 w-auto object-contain brightness-0 invert"
‎    />
‎  </div>
‎  <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
‎    Service de plomberie rapide, propre et efficace à Yaoundé et dans tout le Cameroun.
‎  </p>
            <div className="flex flex-col gap-2">
              {contacts.map(({ icon, val, href }) => (
                href
                  ? <a key={val} href={href} className="flex items-center gap-2.5 text-sm text-white/50 hover:text-cyan-deslud transition-colors">
                      <span className="text-base w-5">{icon}</span>{val}
                    </a>
                  : <div key={val} className="flex items-center gap-2.5 text-sm text-white/50">
                      <span className="text-base w-5">{icon}</span>{val}
                    </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-[15px] font-bold text-white uppercase tracking-[0.1em] mb-5">Nos services</h4>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => handleNav('#services')}
                    className="text-sm text-white/40 hover:text-cyan-deslud transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-blue-deslud text-xs opacity-60 group-hover:opacity-100 transition-opacity">→</span>{s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-[15px] font-bold text-white uppercase tracking-[0.1em] mb-5">Navigation</h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((label, i) => (
                <li key={label}>
                  <button
                    onClick={() => handleNav(navHrefs[i])}
                    className="text-sm text-white/40 hover:text-cyan-deslud transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-blue-deslud text-xs opacity-60 group-hover:opacity-100 transition-opacity">→</span>{label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-[15px] font-bold text-white uppercase tracking-[0.1em] mb-5">Newsletter</h4>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Recevez nos conseils et offres spéciales directement dans votre boîte mail.
            </p>
            {sent
              ? <div className="text-sm text-cyan-deslud font-semibold">✅ Abonnement confirmé !</div>
              : <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="votre@email.com"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-body outline-none focus:border-blue-deslud placeholder:text-white/25 transition-colors"
                  />
                  <button type="submit"
                    className="px-4 py-3 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-sm uppercase tracking-wide rounded-lg transition-colors whitespace-nowrap">
                    OK
                  </button>
                </form>
            }
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-xs text-white/25 text-center sm:text-left">
            © 2024 <span className="text-cyan-deslud">Deslud Plomberie</span> — Tous droits réservés | Yaoundé, Cameroun
          </p>
          <p className="text-xs text-white/20">Votre confort, notre expertise 💧</p>
        </div>
      </div>
    </footer>
  );
        }
