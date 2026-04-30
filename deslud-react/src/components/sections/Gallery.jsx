// src/components/sections/Gallery.jsx
import { useState } from 'react';
import { useLang } from '../../hooks/useLang.jsx';

// 1. Mise à jour des données avec les BONS chemins absolus
const projects = [
  { id: 1, cat: 'installation', before: '/images/install1b.jpg', after: '/images/install1a.jpg', title_fr: 'Installation salle de bain complète', title_en: 'Full bathroom installation', loc: 'Bastos, Yaoundé' },
  { id: 2, cat: 'reparation', before: '/images/repar1b.jpg', after: '/images/repar1a.jpg', title_fr: 'Réparation fuite sous évier', title_en: 'Under-sink leak repair', loc: 'Nlongkak, Yaoundé' },
  { id: 3, cat: 'installation', before: '/images/install2b.jpg', after: '/images/install2a.jpg', title_fr: 'Installation douche moderne', title_en: 'Modern shower installation', loc: 'Melen, Yaoundé' },
  { id: 4, cat: 'entretien', before: '/images/entre1b.jpg', after: '/images/entre1a.jpg', title_fr: 'Entretien réseau complet', title_en: 'Full network maintenance', loc: 'Mvog-Ada, Yaoundé' },
  // N'oublie pas de mettre les vrais noms de fichiers pour les ID 5 et 6 quand tu les auras
  { id: 5, cat: 'reparation', before: '/images/placeholder.jpg', after: '/images/placeholder.jpg', title_fr: 'Remplacement tuyauterie rouillée', title_en: 'Rusty pipe replacement', loc: 'Biyem-Assi, Yaoundé' },
  { id: 6, cat: 'installation', before: '/images/placeholder.jpg', after: '/images/placeholder.jpg', title_fr: 'Robinetterie haut de gamme', title_en: 'Premium faucet installation', loc: 'Elig-Essono, Yaoundé' },
];

export default function Gallery() {
  // ... (le reste de ton code ne change pas)

  const { t, lang } = useLang();
  const [filter, setFilter] = useState('all') ;
    const [selected, setSelected] = useState(null);

  const cats = ['all', 'installation', 'reparation', 'entretien'];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);
  const gl = lang === 'fr' ? { all: 'Tout', installation: 'Installation', reparation: 'Réparation', entretien: 'Entretien' }
    : { all: 'All', installation: 'Installation', reparation: 'Repair', entretien: 'Maintenance' };

  return (
    <section id="galerie" className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3">{t('gallery.label')}</span>
          <h2 className="font-display font-black text-[clamp(32px,4vw,52px)] uppercase text-navy leading-[1.05] mb-4">
            {t('gallery.title')} <span className="text-blue-deslud">{t('gallery.title2')}</span>
          </h2>
          {/* Filters */}
          <div className="flex justify-center gap-2 flex-wrap mt-8">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`font-display font-bold text-sm uppercase tracking-[0.08em] px-6 py-2.5 rounded-full border transition-all duration-200
                  ${filter === c ? 'bg-blue-deslud text-white border-blue-deslud shadow-glow-blue' : 'text-navy border-gray-200 hover:border-blue-deslud hover:text-blue-deslud'}`}>
                {gl[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <div key={p.id} onClick={() => setSelected(p)}
              className={`group cursor-pointer bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-deslud/30 hover:shadow-[0_16px_48px_rgba(20,100,220,0.12)] hover:-translate-y-1.5 transition-all duration-300 reveal reveal-delay-${(i % 3) + 1}`}>
              
              {/* 2. Mise à jour de l'affichage Avant/Après de la grille */}
              <div className="relative flex h-48 overflow-hidden">
                {/* Zone Avant */}
                <div className="relative flex-1 bg-gray-200 flex flex-col items-center justify-end pb-3">
                  <img src={p.before} alt="Avant" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-black/60 px-3 py-1 rounded-full">{lang === 'fr' ? 'Avant' : 'Before'}</span>
                </div>
                
                {/* Flèche centrale */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md font-display font-black text-blue-deslud text-sm">→</div>
                
                {/* Zone Après */}
                <div className="relative flex-1 bg-gray-200 flex flex-col items-center justify-end pb-3">
                  <img src={p.after} alt="Après" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-blue-deslud/80 px-3 py-1 rounded-full">{lang === 'fr' ? 'Après' : 'After'}</span>
                </div>
              </div>
              
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-deslud bg-blue-deslud/8 px-2.5 py-1 rounded-full">{gl[p.cat]}</span>
                <h3 className="font-display font-bold text-[17px] text-navy uppercase tracking-[0.02em] mt-3 mb-1.5">{lang === 'en' ? p.title_en : p.title_fr}</h3>
                <p className="text-xs text-gray-400">📍 {p.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-navy text-2xl font-bold z-50">✕</button>
            
            {/* 3. Mise à jour de l'affichage Avant/Après du Lightbox */}
            <div className="flex gap-4 mb-6 h-48">
              <div className="relative flex-1 bg-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-end pb-3">
                <img src={selected.before} alt="Avant" className="absolute inset-0 w-full h-full object-cover" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-wide text-white bg-black/60 px-3 py-1.5 rounded-full">{lang === 'fr' ? 'Avant' : 'Before'}</span>
              </div>
              <div className="relative flex-1 bg-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-end pb-3">
                <img src={selected.after} alt="Après" className="absolute inset-0 w-full h-full object-cover" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-wide text-white bg-blue-deslud/80 px-3 py-1.5 rounded-full">{lang === 'fr' ? 'Après' : 'After'}</span>
              </div>
            </div>

            <h3 className="font-display font-black text-xl text-navy uppercase mb-2">{lang === 'en' ? selected.title_en : selected.title_fr}</h3>
            <p className="text-sm text-gray-400 mb-6">📍 {selected.loc}</p>
            <button onClick={() => { setSelected(null); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="w-full py-3.5 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold uppercase tracking-wide rounded-xl transition-colors">
              {lang === 'fr' ? 'Demander ce service →' : 'Request this service →'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


