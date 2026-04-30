// src/components/sections/StatsBand.jsx
import { useLang } from '../../hooks/useLang.jsx';

export default function StatsBand() {
  const { t } = useLang();
  const stats = [
    { icon: '', count: 138, suffix: '+', label: t('stats.interventions') },
    { icon: '', count: 30, suffix: 'min', label: t('stats.delai') },
    { icon: '', count: 94, suffix: '%', label: t('stats.satisfaits') },
    { icon: '', num: 'Tout', label: t('stats.couverture') },
  ];
  return (
    <div id="stats-band" className="bg-blue-deslud py-7">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center">
        {stats.map((s, i) => (
          <div key={i} className={`flex items-center gap-4 px-10 py-4 ${i < stats.length - 1 ? 'border-r border-white/20 max-sm:border-r-0 max-sm:border-b max-sm:border-white/20' : ''}`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="font-display font-black text-2xl text-white leading-none"
                data-count={s.count} data-suffix={s.suffix || ''}>
                {s.num || `${s.count}${s.suffix}`}
              </div>
              <div className="text-xs font-semibold tracking-[0.1em] uppercase text-white/70 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
