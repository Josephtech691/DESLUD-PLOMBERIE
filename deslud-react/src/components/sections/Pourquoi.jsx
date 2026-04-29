// src/components/sections/Pourquoi.jsx
import { useLang } from '../../hooks/useLang.jsx';

const avantages = [
  { icon: '⚡', fr: ['Intervention rapide', 'Moins de 30 min à Yaoundé pour toute urgence. Réactivité maximale.'], en: ['Fast response', 'Under 30 min in Yaoundé for any emergency. Maximum reactivity.'] },
  { icon: '✨', fr: ['Travail propre', 'Nous respectons votre espace et nettoyons après chaque intervention.'], en: ['Clean work', 'We respect your space and clean up after every job.'] },
  { icon: '💰', fr: ['Prix transparents', 'Devis gratuit et sans surprise. Tarifs clairs avant intervention.'], en: ['Transparent pricing', 'Free quote, no surprises. Clear rates before every job.'] },
  { icon: '🛡️', fr: ['Travail garanti', 'Toutes nos interventions sont garanties. Retour gratuit si problème.'], en: ['Guaranteed work', 'All our jobs are guaranteed. Free return if issue persists.'] },
  { icon: '📞', fr: ['Disponible 7j/7', 'Joignez-nous à tout moment, même week-end et jours fériés.'], en: ['Available 24/7', 'Reach us at any time, even weekends and holidays.'] },
  { icon: '🏆', fr: ['Techniciens qualifiés', 'Équipe formée et expérimentée sur tous types d\'installations.'], en: ['Qualified technicians', 'Trained and experienced team on all types of installations.'] },
];

export default function Pourquoi() {
  const { t, lang } = useLang();
  return (
    <section id="pourquoi" className="py-28 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:50px_50px] opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(20,100,220,0.08)_0%,transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-cyan-deslud block mb-3 reveal">
              {lang === 'fr' ? 'Pourquoi nous choisir' : 'Why choose us'}
            </span>
            <h2 className="font-display font-black text-[clamp(36px,4.5vw,58px)] text-white uppercase leading-[1.0] mb-5 reveal">
              {lang === 'fr' ? <>LA SOLUTION À VOS PROBLÈMES DE <span className="text-cyan-deslud">PLOMBERIE</span></> : <>THE SOLUTION TO YOUR <span className="text-cyan-deslud">PLUMBING</span> PROBLEMS</>}
            </h2>
            <p className="text-white/55 text-base leading-[1.8] mb-10 max-w-md reveal">
              {lang === 'fr' ? "Deslud Plomberie, c'est une équipe de professionnels engagés à vous fournir le meilleur service au meilleur prix, avec un résultat propre et durable."
                : "Deslud Plomberie is a team of dedicated professionals committed to delivering the best service at the best price, with clean and lasting results."}
            </p>
            <div className="flex items-start gap-5 p-7 bg-white/[0.04] border border-white/[0.08] rounded-2xl reveal">
              <span className="text-4xl mt-1">📍</span>
              <div>
                <h4 className="font-display font-bold text-lg text-white uppercase tracking-[0.05em] mb-2">
                  {lang === 'fr' ? 'Basé à Yaoundé' : 'Based in Yaoundé'}
                </h4>
                <p className="text-sm text-white/50 leading-[1.7]">
                  {lang === 'fr' ? "Notre équipe est basée à Yaoundé avec une capacité d'intervention dans tout le territoire camerounais."
                    : "Our team is based in Yaoundé with the ability to operate across all of Cameroon."}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {avantages.map((a, i) => (
              <div key={i} className={`p-6 bg-white/[0.03] border border-blue-deslud/20 rounded-xl hover:bg-blue-deslud/10 hover:border-blue-deslud hover:-translate-y-1 transition-all duration-300 reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="text-3xl mb-3">{a.icon}</div>
                <h4 className="font-display font-bold text-[17px] text-white uppercase tracking-[0.03em] mb-2">{lang === 'en' ? a.en[0] : a.fr[0]}</h4>
                <p className="text-[13px] text-white/45 leading-[1.7]">{lang === 'en' ? a.en[1] : a.fr[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
