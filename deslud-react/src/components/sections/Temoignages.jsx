// src/components/sections/Temoignages.jsx
import { useEffect, useState } from 'react';
import { useLang } from '../../hooks/useLang.jsx';
import { api } from '../../utils/api';

const fallback = [
  { nom_client: 'Marie Atangana', quartier: 'Bastos', note: 5, commentaire: "Service impeccable ! L'équipe est venue rapidement pour réparer une fuite majeure. Travail propre et soigné. Je recommande fortement !", service_type: 'depannage' },
  { nom_client: 'Paul Mbarga', quartier: 'Nlongkak', note: 5, commentaire: "Excellente prestation pour l'installation de ma nouvelle salle de bain. Professionnel et dans les délais. Prix raisonnable.", service_type: 'installation' },
  { nom_client: 'Sophie Ngo Biyong', quartier: 'Melen', note: 4, commentaire: "Très bon service, intervention rapide le dimanche pour une urgence. Très satisfaite du travail effectué.", service_type: 'depannage' },
];

const Stars = ({ n }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => <span key={i} className={`text-base ${i <= n ? 'text-yellow-400' : 'text-yellow-400/20'}`}>★</span>)}
  </div>
);

export default function Temoignages() {
  const { t, lang } = useLang();
  const [items, setItems] = useState(fallback);
  const [avg, setAvg] = useState(4.9);

  useEffect(() => {
    api.getTemoignages().then(j => {
      if (j.success && j.data?.length) {
        setItems(j.data);
        if (j.meta?.moyenne) setAvg(j.meta.moyenne);
      }
    }).catch(() => {});
  }, []);

  const initials = (n) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <section id="temoignages" className="py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3">{t('temoignages.label') || (lang === 'fr' ? 'Ce que disent nos clients' : 'What our clients say')}</span>
          <h2 className="font-display font-black text-[clamp(32px,4vw,52px)] uppercase text-navy leading-[1.05] mb-4">
            {lang === 'fr' ? <>Ils nous font <span className="text-blue-deslud">confiance</span></> : <>They <span className="text-blue-deslud">trust</span> us</>}
          </h2>
        </div>

        {/* Rating banner */}
        <div className="flex flex-wrap items-center justify-center gap-10 bg-gradient-to-r from-blue-deslud to-navy-4 rounded-2xl p-8 mb-12 reveal">
          <div className="text-center">
            <div className="font-display font-black text-6xl text-white leading-none">{avg.toFixed(1)}</div>
            <div className="flex gap-1 justify-center mt-2">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xl">★</span>)}</div>
          </div>
          <div className="text-left">
            <div className="font-display font-bold text-xl text-white uppercase tracking-[0.05em]">{lang === 'fr' ? 'Excellente note' : 'Excellent rating'}</div>
            <div className="text-white/50 text-sm mt-1">{lang === 'fr' ? '+200 avis clients vérifiés' : '+200 verified client reviews'}</div>
          </div>
          <div className="text-center border-l border-white/20 pl-10">
            <div className="font-display font-black text-5xl text-white leading-none">98%</div>
            <div className="text-white/60 text-sm font-semibold uppercase tracking-[0.1em] mt-1">{lang === 'fr' ? 'Clients satisfaits' : 'Satisfied clients'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.slice(0, 6).map((tm, i) => (
            <div key={i} className={`bg-white rounded-2xl p-8 border border-blue-deslud/8 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(20,100,220,0.12)] transition-all duration-300 reveal reveal-delay-${(i % 3) + 1}`}>
              <div className="font-serif text-6xl text-blue-deslud/15 leading-[0.6] mb-3">"</div>
              <Stars n={tm.note} />
              <p className="text-[15px] text-gray-500 leading-[1.8] my-5 italic">"{tm.commentaire}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-full flex items-center justify-center font-display font-black text-white text-base flex-shrink-0">
                  {initials(tm.nom_client)}
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold text-[15px] text-navy uppercase tracking-[0.03em]">{tm.nom_client}</div>
                  <div className="text-xs text-gray-400 mt-0.5">📍 {tm.quartier || 'Yaoundé'}</div>
                </div>
                {tm.service_type && (
                  <span className="bg-blue-deslud/8 text-blue-deslud text-[11px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">
                    {tm.service_type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
