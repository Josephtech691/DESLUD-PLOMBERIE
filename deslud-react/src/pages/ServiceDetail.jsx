// src/pages/ServiceDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useLang } from '../hooks/useLang.jsx';

const details = {
  installation: {
    icon: '🔧', price: 15000,
    fr: { name: 'Installation Sanitaire', desc: 'Installation complète de vos équipements sanitaires par des techniciens qualifiés. Conformité aux normes camerounaises garantie.', features: ['Robinets & mitigeurs', 'Lavabos, éviers, WC', 'Baignoires & douches', 'Chauffe-eau & ballons', 'Tuyauterie PVC/cuivre', 'Garantie 6 mois'] },
    en: { name: 'Sanitary Installation', desc: 'Complete installation of your sanitary equipment by qualified technicians. Compliance with Cameroonian standards guaranteed.', features: ['Faucets & mixers', 'Sinks, toilets', 'Bathtubs & showers', 'Water heaters', 'PVC/copper piping', '6-month guarantee'] },
    steps_fr: ['Évaluation du chantier', 'Devis gratuit détaillé', 'Commande du matériel', 'Installation professionnelle', 'Tests & vérifications', 'Nettoyage & livraison'],
    steps_en: ['Site assessment', 'Detailed free quote', 'Material ordering', 'Professional installation', 'Tests & checks', 'Cleanup & handover'],
  },
  entretien: {
    icon: '⚙️', price: 10000,
    fr: { name: 'Entretien & Maintenance', desc: "Entretien régulier et maintenance préventive de vos installations pour éviter les pannes et prolonger leur durée de vie.", features: ['Inspection complète', 'Nettoyage canalisations', 'Vérification fuites', 'Remplacement pièces usées', 'Rapport d\'intervention', 'Contrats annuels'] },
    en: { name: 'Maintenance', desc: 'Regular maintenance to prevent breakdowns and extend the life of your plumbing systems.', features: ['Full inspection', 'Pipe cleaning', 'Leak checks', 'Worn part replacement', 'Intervention report', 'Annual contracts'] },
    steps_fr: ['Diagnostic initial', 'Nettoyage canalisations', 'Vérification pressions', 'Remplacement si nécessaire', 'Rapport complet', 'Planification prochain entretien'],
    steps_en: ['Initial diagnosis', 'Pipe cleaning', 'Pressure checks', 'Replacement if needed', 'Full report', 'Next maintenance planning'],
  },
  depannage: {
    icon: '⚡', price: 5000,
    fr: { name: 'Dépannage Rapide', desc: 'Intervention d\'urgence rapide 7j/7, 24h/24. Fuite, bouchon, casse de tuyau — nous arrivons en moins de 30 minutes à Yaoundé.', features: ['Disponible 7j/7 24h/24', 'Arrivée < 30 min Yaoundé', 'Fuites & inondations', 'Débouchage urgent', 'Casse de tuyaux', 'Devis immédiat sur place'] },
    en: { name: 'Emergency Repair', desc: '24/7 emergency response. Leak, blockage, broken pipe — we arrive in under 30 minutes in Yaoundé.', features: ['Available 24/7', 'Arrival < 30 min Yaoundé', 'Leaks & flooding', 'Urgent unblocking', 'Broken pipes', 'Immediate on-site quote'] },
    steps_fr: ['Appel d\'urgence', 'Départ immédiat du technicien', 'Diagnostic sur place', 'Intervention rapide', 'Test de résolution', 'Facture transparente'],
    steps_en: ['Emergency call', 'Technician dispatched immediately', 'On-site diagnosis', 'Fast repair', 'Resolution test', 'Transparent invoice'],
  },
  fuites: {
    icon: '💧', price: 8000,
    fr: { name: 'Dépannage de Fuites', desc: 'Détection et réparation de fuites visibles ou cachées. Nos méthodes modernes permettent de localiser sans démolition inutile.', features: ['Détection sans démolition', 'Fuites visibles & cachées', 'Compteurs qui tournent', 'Humidité dans les murs', 'Réparation durable', 'Rapport photographique'] },
    en: { name: 'Leak Repair', desc: 'Detection and repair of visible or hidden leaks. Our modern methods locate leaks without unnecessary demolition.', features: ['No-demolition detection', 'Visible & hidden leaks', 'Running meters', 'Wall moisture', 'Lasting repair', 'Photo report'] },
    steps_fr: ['Localisation de la fuite', 'Isolation du réseau', 'Réparation ciblée', 'Test d\'étanchéité', 'Vérification compteur', 'Rapport final'],
    steps_en: ['Leak location', 'Network isolation', 'Targeted repair', 'Sealing test', 'Meter check', 'Final report'],
  },
  tuyauterie: {
    icon: '🔩', price: 12000,
    fr: { name: 'Réparation Tuyauterie', desc: 'Réparation et remplacement de tuyaux endommagés ou rouillés. Tous types : PVC, acier galvanisé, cuivre, PER.', features: ['PVC, Cuivre, PER, Galva', 'Remplacement complet', 'Soudure professionnelle', 'Raccords certifiés', 'Isolation thermique', 'Garantie travaux'] },
    en: { name: 'Pipe Repair', desc: 'Repair and replacement of damaged or corroded pipes. All types: PVC, galvanized steel, copper, PEX.', features: ['PVC, Copper, PEX, Steel', 'Full replacement', 'Professional welding', 'Certified fittings', 'Thermal insulation', 'Work guarantee'] },
    steps_fr: ['Diagnostic canalisations', 'Devis matériaux', 'Coupure réseau', 'Remplacement tuyaux', 'Soudure & raccords', 'Mise en service & test'],
    steps_en: ['Pipe diagnosis', 'Materials quote', 'Network shutdown', 'Pipe replacement', 'Welding & fittings', 'Commissioning & test'],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const svc = details[slug];

  if (!svc) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🔍</div>
        <div className="font-display font-black text-3xl uppercase mb-4">Service non trouvé</div>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-deslud rounded-xl font-display font-bold uppercase text-white">← Accueil</button>
      </div>
    </div>
  );

  const info = lang === 'en' ? svc.en : svc.fr;
  const steps = lang === 'en' ? svc.steps_en : svc.steps_fr;
  const scrollContact = () => { navigate('/'); setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 300); };

  return (
    <>
      <SEO title={info.name} description={info.desc} path={`/services/${slug}`} />
      <div className="pt-24">
        {/* Hero */}
        <div className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(20,100,220,0.15)_0%,transparent_60%)]" />
          <div className="container mx-auto px-6 relative z-10">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-display font-bold text-sm uppercase tracking-[0.1em]">
              ← {lang === 'fr' ? 'Retour' : 'Back'}
            </button>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-2xl flex items-center justify-center text-4xl shadow-glow-blue">{svc.icon}</div>
              <div>
                <div className="font-display text-xs font-bold tracking-[0.25em] uppercase text-cyan-deslud mb-2">Deslud Plomberie</div>
                <h1 className="font-display font-black text-[clamp(36px,5vw,64px)] text-white uppercase leading-[1.0]">{info.name}</h1>
              </div>
            </div>
            <p className="text-white/60 text-lg leading-[1.75] max-w-2xl mb-8">{info.desc}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={scrollContact} className="px-8 py-4 bg-cyan-deslud hover:bg-cyan-deslud-2 text-navy font-display font-bold text-lg uppercase tracking-wide rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-glow">
                {lang === 'fr' ? 'Demander ce service →' : 'Request this service →'}
              </button>
              <a href="tel:+237683906225" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-bold text-lg uppercase tracking-wide rounded-xl transition-all">
                📞 683 90 62 25
              </a>
            </div>
          </div>
        </div>

        {/* Features + Steps */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h2 className="font-display font-black text-3xl text-navy uppercase mb-8">{lang === 'fr' ? 'Ce qui est inclus' : 'What is included'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {info.features.map(f => (
                  <div key={f} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-deslud/30 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-full flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="10" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="font-medium text-navy text-[15px]">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-blue-deslud/5 border border-blue-deslud/20 rounded-2xl">
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">{lang === 'fr' ? 'À partir de' : 'Starting at'}</div>
                <div className="font-display font-black text-4xl text-blue-deslud">{svc.price.toLocaleString()} FCFA</div>
                <p className="text-sm text-gray-400 mt-2">{lang === 'fr' ? 'Devis gratuit et personnalisé sur demande.' : 'Free personalized quote on request.'}</p>
              </div>
            </div>
            <div>
              <h2 className="font-display font-black text-3xl text-navy uppercase mb-8">{lang === 'fr' ? 'Comment ça se passe' : 'How it works'}</h2>
              <div className="flex flex-col gap-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-full flex items-center justify-center font-display font-black text-white flex-shrink-0">{i + 1}</div>
                    <span className="font-medium text-navy">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-navy text-center">
          <h2 className="font-display font-black text-3xl text-white uppercase mb-4">
            {lang === 'fr' ? 'Prêt à démarrer ?' : 'Ready to start?'}
          </h2>
          <p className="text-white/50 mb-8">{lang === 'fr' ? 'Obtenez votre devis gratuit maintenant.' : 'Get your free quote now.'}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={scrollContact} className="px-8 py-4 bg-cyan-deslud text-navy font-display font-bold uppercase text-lg tracking-wide rounded-xl hover:bg-cyan-deslud-2 transition-all hover:shadow-glow">
              {lang === 'fr' ? 'Devis gratuit →' : 'Free quote →'}
            </button>
            <a href={`https://wa.me/237683906225?text=${encodeURIComponent('Bonjour, je souhaite un devis pour: ' + info.name)}`} target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white font-display font-bold uppercase text-lg tracking-wide rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(37,211,102,0.4)]">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
