// src/pages/About.jsx
import SEO from '../components/ui/SEO';
import { useLang } from '../hooks/useLang.jsx';

export default function About() {
  const { lang } = useLang();
  const vals = lang === 'fr'
    ? [['⚡','Rapidité','Nous intervenons en moins de 30 minutes pour toute urgence à Yaoundé.'],
       ['✨','Propreté','Nous respectons votre espace et nettoyons après chaque intervention.'],
       ['🛡️','Efficacité','Nos solutions sont durables et garanties. Travail bien fait du premier coup.'],
       ['💰','Honnêteté','Devis transparents, sans frais cachés. Ce que nous disons, nous le faisons.']]
    : [['⚡','Speed','We respond in under 30 minutes for any emergency in Yaoundé.'],
       ['✨','Cleanliness','We respect your space and clean up after every job.'],
       ['🛡️','Efficiency','Our solutions are lasting and guaranteed. Done right the first time.'],
       ['💰','Honesty','Transparent quotes, no hidden fees. We do what we say.']];

  return (
    <>
      <SEO title={lang === 'fr' ? 'À propos' : 'About'} description="Deslud Plomberie — plombier professionnel à Yaoundé depuis 5 ans." path="/about" />
      <div className="pt-24">
        {/* Hero */}
        <div className="bg-navy py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(20,100,220,0.15)_0%,transparent_60%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-cyan-deslud block mb-4">{lang === 'fr' ? 'Notre histoire' : 'Our story'}</span>
            <h1 className="font-display font-black text-[clamp(40px,6vw,80px)] text-white uppercase leading-[0.95] mb-6">
              {lang === 'fr' ? <>À propos de<br /><span className="text-cyan-deslud">Deslud Plomberie</span></> : <>About<br /><span className="text-cyan-deslud">Deslud Plomberie</span></>}
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-[1.75]">
              {lang === 'fr' ? "Depuis 5 ans, nous aidons les familles et entreprises de Yaoundé à résoudre leurs problèmes de plomberie avec professionnalisme et rigueur."
                : "For 5 years, we have been helping families and businesses in Yaoundé solve their plumbing problems with professionalism and rigor."}
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-black text-4xl text-navy uppercase mb-6">{lang === 'fr' ? 'Qui sommes-nous ?' : 'Who are we?'}</h2>
              <div className="space-y-4 text-gray-500 leading-[1.85] text-[15px]">
                <p>{lang === 'fr' ? "Deslud Plomberie est une entreprise de plomberie basée à Yaoundé, Cameroun. Fondée avec la passion du travail bien fait, nous avons grandi pour devenir l'une des références de la plomberie dans la région." : "Deslud Plomberie is a plumbing company based in Yaoundé, Cameroon. Founded with a passion for quality work, we have grown to become a reference in plumbing in the region."}</p>
                <p>{lang === 'fr' ? "Notre équipe de techniciens qualifiés est formée sur les dernières techniques et équipements. Nous intervenons aussi bien pour les particuliers que pour les entreprises, dans tout Yaoundé et à travers le Cameroun." : "Our team of qualified technicians is trained on the latest techniques and equipment. We work for both individuals and businesses, throughout Yaoundé and across Cameroon."}</p>
                <p>{lang === 'fr' ? "Notre engagement : un service rapide, propre et efficace, avec des prix transparents et un travail garanti." : "Our commitment: fast, clean and efficient service, with transparent pricing and guaranteed work."}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[['500+', lang === 'fr' ? 'Clients' : 'Clients'],['5ans', lang === 'fr' ? 'Expérience' : 'Experience'],['98%', lang === 'fr' ? 'Satisfaits' : 'Satisfied']].map(([n,l]) => (
                  <div key={l} className="text-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="font-display font-black text-3xl text-blue-deslud">{n}</div>
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-[0.1em] mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-navy to-navy-4 rounded-3xl p-10 text-center border border-blue-deslud/20">
              <div className="text-8xl mb-6">👷</div>
              <h3 className="font-display font-black text-3xl text-white uppercase mb-4">Ludovic Nono</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{lang === 'fr' ? "Fondateur & Maître Plombier — 10 ans d'expérience dans la plomberie résidentielle et commerciale au Cameroun." : "Founder & Master Plumber — 10 years of experience in residential and commercial plumbing in Cameroon."}</p>
              <div className="flex flex-col gap-2">
                {(lang === 'fr' ? ['✅ Certifié en plomberie sanitaire','✅ Formation continue','✅ +500 interventions réussies','✅ Zone: Tout le Cameroun']
                  : ['✅ Certified sanitary plumber','✅ Ongoing training','✅ +500 successful jobs','✅ Area: All Cameroon']).map(c => (
                  <div key={c} className="text-white/70 text-sm text-left">{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="font-display font-black text-4xl text-navy uppercase text-center mb-12">{lang === 'fr' ? 'Nos valeurs' : 'Our values'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {vals.map(([icon, title, desc]) => (
                <div key={title} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-deslud/30 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,100,220,0.1)] transition-all text-center">
                  <div className="text-5xl mb-5">{icon}</div>
                  <h3 className="font-display font-black text-xl text-navy uppercase tracking-[0.05em] mb-3">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
