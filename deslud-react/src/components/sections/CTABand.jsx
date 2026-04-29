// src/components/sections/CTABand.jsx
import { useLang } from '../../hooks/useLang.jsx';

export default function CTABand() {
  const { t, lang } = useLang();
  return (
    <div id="cta-band" className="py-20 bg-gradient-to-r from-blue-deslud to-blue-deslud-dark relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 flex-wrap">
          <div className="reveal">
            <h2 className="font-display font-black text-[clamp(26px,3vw,44px)] text-white uppercase leading-[1.05] mb-3">{t('cta.title')}</h2>
            <p className="text-white/70 text-base">{t('cta.sub')}</p>
          </div>
          <div className="flex flex-wrap gap-4 reveal reveal-delay-2">
            {[{ label: lang === 'fr' ? 'Numéro principal' : 'Main number', num: '683 90 62 25', href: 'tel:+237683906225' },
              { label: lang === 'fr' ? 'Numéro secondaire' : 'Secondary', num: '658 51 87 88', href: 'tel:+237658518788' }].map(p => (
              <a key={p.num} href={p.href}
                className="flex items-center gap-3 bg-white/12 border border-white/30 hover:bg-white/20 hover:border-white/60 hover:-translate-y-1 rounded-xl px-6 py-4 transition-all duration-300">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="text-white/60 text-[11px] font-semibold uppercase tracking-[0.1em]">{p.label}</div>
                  <div className="font-display font-black text-xl text-white tracking-[0.05em] leading-tight">{p.num}</div>
                </div>
              </a>
            ))}
            <a href={`https://wa.me/237683906225?text=${encodeURIComponent(lang === 'fr' ? "Bonjour, j'ai un problème de plomberie et souhaite un devis." : "Hello, I have a plumbing issue and need a quote.")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5C] hover:-translate-y-1 rounded-xl px-6 py-4 transition-all duration-300 shadow-[0_4px_20px_rgba(37,211,102,0.4)]">
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-white/80 text-[11px] font-semibold uppercase tracking-[0.1em]">WhatsApp</div>
                <div className="font-display font-black text-xl text-white tracking-[0.03em] leading-tight">{lang === 'fr' ? 'Message direct' : 'Direct message'}</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---

// src/components/sections/MapSection.jsx
export function MapSection({ lang = 'fr' }) {
  return (
    <section id="map" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3">
            {lang === 'fr' ? 'Zone d\'intervention' : 'Service area'}
          </span>
          <h2 className="font-display font-black text-[clamp(28px,3.5vw,46px)] uppercase text-navy leading-[1.05]">
            {lang === 'fr' ? <>Nous intervenons à <span className="text-blue-deslud">Yaoundé</span></> : <>We operate in <span className="text-blue-deslud">Yaoundé</span></>}
          </h2>
        </div>
        <div className="reveal rounded-2xl overflow-hidden shadow-card border border-gray-100">
          <iframe
            title="Deslud Plomberie - Yaoundé"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.4218261!2d11.4658!3d3.8667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x7a0e8bea25bcfcc0!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2s!4v1709999999999!5m2!1sen!2s"
            width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {['Bastos', 'Nlongkak', 'Melen', 'Biyem-Assi', 'Mvog-Ada', 'Elig-Essono', 'Ekounou', 'Tout Cameroun'].map(z => (
            <div key={z} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 reveal">
              <span className="text-blue-deslud text-sm">📍</span>
              <span className="font-display font-bold text-sm text-navy uppercase tracking-[0.04em]">{z}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
