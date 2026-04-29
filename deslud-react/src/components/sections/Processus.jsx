// src/components/sections/Processus.jsx
import { useLang } from '../../hooks/useLang.jsx';

export default function Processus() {
  const { lang } = useLang();
  const steps = lang === 'fr'
    ? [
        { n: '01', icon: '📞', title: 'Vous appelez', desc: 'Contactez-nous par téléphone, WhatsApp ou via le formulaire en ligne. Disponible 7j/7.' },
        { n: '02', icon: '📋', title: 'Devis gratuit', desc: 'Nous évaluons votre problème et proposons un devis clair, sans frais ni engagement.' },
        { n: '03', icon: '🔧', title: 'Intervention', desc: 'Nos techniciens interviennent rapidement avec le matériel adapté.' },
        { n: '04', icon: '✅', title: 'Satisfaction', desc: 'Travail propre, nettoyage et garantie sur l\'intervention. Votre satisfaction prime.' },
      ]
    : [
        { n: '01', icon: '📞', title: 'You call us', desc: 'Contact us by phone, WhatsApp or via the online form. Available 24/7.' },
        { n: '02', icon: '📋', title: 'Free quote', desc: 'We assess your problem and provide a clear, no-obligation quote.' },
        { n: '03', icon: '🔧', title: 'Intervention', desc: 'Our technicians arrive quickly with the right tools.' },
        { n: '04', icon: '✅', title: 'Satisfaction', desc: 'Clean work, site cleanup and guaranteed results. Your satisfaction is our priority.' },
      ];

  return (
    <section id="processus" className="py-28 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(20,100,220,0.08)_0%,transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 reveal">
          <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-cyan-deslud block mb-3">
            {lang === 'fr' ? 'Simple & efficace' : 'Simple & effective'}
          </span>
          <h2 className="font-display font-black text-[clamp(32px,4vw,52px)] uppercase text-white leading-[1.05] mb-4">
            {lang === 'fr' ? <>Comment ça <span className="text-cyan-deslud">marche</span></> : <>How it <span className="text-cyan-deslud">works</span></>}
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            {lang === 'fr' ? 'En 4 étapes simples, nous résolvons votre problème de plomberie.' : 'In 4 simple steps, we solve your plumbing problem.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+26px)] right-[calc(12.5%+26px)] h-[2px] bg-gradient-to-r from-blue-deslud via-cyan-deslud to-blue-deslud" />

          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col items-center text-center reveal reveal-delay-${i + 1}`}>
              <div className="w-[60px] h-[60px] bg-navy-3 border-2 border-blue-deslud rounded-full flex items-center justify-center font-display font-black text-xl text-cyan-deslud mb-6 relative z-10 hover:bg-blue-deslud hover:text-white hover:scale-110 hover:shadow-glow-blue transition-all duration-300 cursor-default">
                {s.n}
              </div>
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-display font-bold text-[18px] text-white uppercase tracking-[0.05em] mb-3">{s.title}</h3>
              <p className="text-[13px] text-white/40 leading-[1.7]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
