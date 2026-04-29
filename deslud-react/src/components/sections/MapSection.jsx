// src/components/sections/MapSection.jsx
import { useLang } from '../../hooks/useLang.jsx';

export default function MapSection() {
  const { lang } = useLang();
  const zones = ['Bastos', 'Nlongkak', 'Melen', 'Biyem-Assi', 'Mvog-Ada', 'Elig-Essono', 'Ekounou', lang === 'fr' ? 'Tout Cameroun' : 'All Cameroon'];

  return (
    <section id="map" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3">
            {lang === 'fr' ? "Zone d'intervention" : 'Service area'}
          </span>
          <h2 className="font-display font-black text-[clamp(28px,3.5vw,46px)] uppercase text-navy leading-[1.05]">
            {lang === 'fr' ? <>Nous intervenons à <span className="text-blue-deslud">Yaoundé</span></> : <>We operate in <span className="text-blue-deslud">Yaoundé</span></>}
          </h2>
          <p className="text-gray-400 mt-3">{lang === 'fr' ? 'et dans tout le territoire camerounais' : 'and across all of Cameroon'}</p>
        </div>
        <div className="reveal rounded-2xl overflow-hidden shadow-card border border-gray-100 mb-8">
          <iframe title="Deslud Plomberie - Yaoundé Cameroun"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.4218261!2d11.4658!3d3.8667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x7a0e8bea25bcfcc0!2sYaound%C3%A9%2C%20Cameroon!5e0!3m2!1sfr!2scm!4v1709999999999!5m2!1sfr!2scm"
            width="100%" height="420" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {zones.map(z => (
            <div key={z} className="flex items-center gap-2.5 bg-white border border-gray-100 hover:border-blue-deslud/30 rounded-xl px-4 py-3 transition-colors reveal">
              <span className="text-blue-deslud">📍</span>
              <span className="font-display font-bold text-sm text-navy uppercase tracking-[0.04em]">{z}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
