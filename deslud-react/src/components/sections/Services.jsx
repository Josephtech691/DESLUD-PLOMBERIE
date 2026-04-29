// src/components/sections/Services.jsx
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../hooks/useLang.jsx';

const serviceData = [
  { slug: 'installation', icon: '🔧', price: 15000, num: '01', features: ['Robinets & mitigeurs', 'Lavabos, WC, douches', 'Chauffe-eau & ballons', 'Tuyauterie complète'], features_en: ['Faucets & mixers', 'Sinks, toilets, showers', 'Water heaters', 'Full piping'] },
  { slug: 'entretien', icon: '⚙️', price: 10000, num: '02', features: ['Contrats annuels', 'Maintenance préventive', 'Vérification fuites', 'Pièces usées'], features_en: ['Annual contracts', 'Preventive maintenance', 'Leak checks', 'Worn parts'] },
  { slug: 'depannage', icon: '⚡', price: 5000, num: '03', accent: true, features: ['Disponible 7j/7', 'Intervention <30 min', 'Dépannage fuites', 'Débouchage'], features_en: ['Available 24/7', 'Response <30 min', 'Leak repair', 'Unblocking'] },
  { slug: 'fuites', icon: '💧', price: 8000, num: '04', features: ['Sans démolition', 'Fuites cachées', 'Réparation rapide', 'Rapport inclus'], features_en: ['No demolition', 'Hidden leaks', 'Quick repair', 'Report included'] },
  { slug: 'tuyauterie', icon: '🔩', price: 12000, num: '05', features: ['PVC, Cuivre, PER', 'Remplacement complet', 'Soudure & raccords', 'Travail soigné'], features_en: ['PVC, Copper, PEX', 'Full replacement', 'Welding & fittings', 'Clean work'] },
];

function ServiceCard({ svc, lang, t, navigate }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  };
  const handleMouseLeave = () => { cardRef.current.style.transform = ''; };

  const features = lang === 'en' ? svc.features_en : svc.features;
  const name = t(`services.${svc.slug}.name`);
  const desc = t(`services.${svc.slug}.desc`);

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className="service-card bg-white rounded-2xl overflow-hidden border border-blue-deslud/8 cursor-pointer group relative
                 hover:shadow-[0_24px_60px_rgba(20,100,220,0.15)] hover:border-blue-deslud/20
                 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1
                 after:bg-gradient-to-r after:from-blue-deslud after:to-cyan-deslud
                 after:scale-x-0 after:origin-left after:transition-transform after:duration-500
                 hover:after:scale-x-100">

      {/* Card top - dark */}
      <div className={`relative px-9 pt-10 pb-9 overflow-hidden ${svc.accent ? 'bg-gradient-to-br from-navy to-navy-4' : 'bg-gradient-to-br from-navy to-navy-4'}`}>
        <span className="absolute top-3 right-5 font-display font-black text-[72px] text-white/[0.04] leading-none select-none">{svc.num}</span>
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-5 shadow-glow-blue relative z-10
          ${svc.accent ? 'bg-gradient-to-br from-red-600 to-red-500' : 'bg-gradient-to-br from-blue-deslud to-cyan-deslud'}`}>
          {svc.icon}
        </div>
        <h3 className="font-display font-black text-[26px] text-white uppercase tracking-[0.03em] leading-[1.1] relative z-10">{name}</h3>
      </div>

      {/* Card body - light */}
      <div className="px-9 py-7">
        <p className="text-sm text-gray-500 leading-[1.8] mb-6">{desc}</p>
        <ul className="flex flex-col gap-2.5 mb-7">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-navy-2">
              <span className="w-5 h-5 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-full flex-shrink-0 flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-[0.08em] font-semibold mb-0.5">{t('services.from')}</div>
            <div className="font-display font-black text-xl text-blue-deslud">{svc.price.toLocaleString()} FCFA</div>
          </div>
          <button onClick={() => navigate(`/services/${svc.slug}`)}
            className="flex items-center gap-2 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-sm uppercase tracking-wide px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-glow-blue">
            {t('services.cta')} →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  return (
    <section id="services" className="py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3">{t('services.label')}</span>
          <h2 className="font-display font-black text-[clamp(32px,4vw,52px)] uppercase text-navy leading-[1.05] mb-4">
            {t('services.title')} <span className="text-blue-deslud">{t('services.title2')}</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('services.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {serviceData.map((svc, i) => (
            <div key={svc.slug} className={`reveal reveal-delay-${(i % 3) + 1}`}>
              <ServiceCard svc={svc} lang={lang} t={t} navigate={navigate} />
            </div>
          ))}

          {/* CTA card */}
          <div className="reveal reveal-delay-3 bg-gradient-to-br from-navy to-navy-4 rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-blue-deslud/30 min-h-[340px]">
            <div className="text-5xl mb-5">🏠</div>
            <h3 className="font-display font-black text-2xl text-white uppercase tracking-[0.03em] mb-3 leading-[1.2]">
              {lang === 'fr' ? 'Votre projet sur mesure' : 'Your custom project'}
            </h3>
            <p className="text-sm text-white/50 mb-7 leading-relaxed">
              {lang === 'fr' ? 'Un projet spécifique ? Devis personnalisé gratuit.' : 'Specific project? Free personalized quote.'}
            </p>
            <button onClick={() => { const el = document.querySelector('#contact'); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); }}
              className="w-full py-3.5 bg-cyan-deslud hover:bg-cyan-deslud-2 text-navy font-display font-black text-base uppercase tracking-wide rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-glow">
              {t('services.cta')} →
            </button>
            <div className="mt-4 font-display font-bold text-base text-cyan-deslud tracking-wide">📞 683 90 62 25</div>
          </div>
        </div>
      </div>
    </section>
  );
}
