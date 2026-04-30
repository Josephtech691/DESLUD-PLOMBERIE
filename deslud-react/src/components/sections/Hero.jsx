// src/components/sections/Hero.jsx
import { Btn, Badge } from '../ui';

const services = [
  { icon: '🔧', name: 'Installation', desc: 'Sanitaires, robinetterie, chauffe-eau' },
  { icon: '⚙️', name: 'Entretien', desc: 'Maintenance préventive & curative' },
  { icon: '⚡', name: 'Dépannage rapide', desc: 'Fuites, bouchons, urgences 7j/7' },
];

const drops = [
  { size: 'w-2 h-3', color: 'bg-blue-deslud', pos: 'top-[10%] left-[15%]', delay: 'animation-delay-0' },
  { size: 'w-1.5 h-2.5', color: 'bg-cyan-deslud', pos: 'top-[20%] left-[45%]', delay: 'animation-delay-1200' },
  { size: 'w-2.5 h-3.5', color: 'bg-blue-deslud-2', pos: 'top-[5%] left-[70%]', delay: 'animation-delay-600' },
  { size: 'w-1 h-2', color: 'bg-cyan-deslud', pos: 'top-[30%] right-[10%]', delay: 'animation-delay-2400' },
  { size: 'w-1.5 h-2.5', color: 'bg-blue-deslud', pos: 'top-[15%] left-[30%]', delay: 'animation-delay-3000' },
];

const handleNav = (href) => {
  const el = document.querySelector(href);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen bg-navy flex items-center overflow-hidden">

      {/* ─── Background layers ─── */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid bg-[size:60px_60px]" />
        {/* Diagonal panel */}
        <div className="absolute top-[-20%] right-[-5%] w-[55%] h-[140%] bg-gradient-to-br from-navy-3 to-navy-4 [transform:skewX(-8deg)] border-l border-blue-deslud/20" />
        {/* Glow orbs */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-blue-deslud/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 right-[30%] w-[400px] h-[400px] rounded-full bg-cyan-deslud/8 blur-[80px] pointer-events-none" />
        {/* Animated drops */}
        {drops.map((d, i) => (
          <div key={i} className={`absolute drop-shape ${d.size} ${d.color} ${d.pos} opacity-0 animate-drop ${d.delay}`} />
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full pt-28 pb-20">
        <div className="max-w-[1300px] mx-auto px-8 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            <Badge> Basé à Yaoundé &nbsp;·&nbsp; Et opère dans tout le Cameroun</Badge>

            <h1 className="font-display font-black uppercase leading-[0.92] text-white mb-7 text-[clamp(56px,8vw,100px)] animate-fade-up [animation-delay:0.1s]">
              VOTRE<br />
              CONFORT,<br />
              <span className="text-cyan-deslud text-shadow-cyan block">NOTRE<br />EXPERTISE</span>
            </h1>

            <p className="text-white/60 text-[17px] leading-[1.75] max-w-[480px] mb-10 animate-fade-up [animation-delay:0.2s]">
              Un service de plomberie <span className="text-cyan-deslud font-semibold">rapide, propre et efficace</span>.
              Installation, entretien et dépannage d'urgence à Yaoundé et dans tout le Cameroun.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:0.3s]">
              <Btn variant="cyan" onClick={() => handleNav('#contact')}>
                 Devis gratuit
              </Btn>
              <Btn variant="outline" as="a" href="tel:+237683906225">
                <span>📞</span> Appeler maintenant
              </Btn>
            </div>

            {/* Stats row */}
            <div className="mt-14 grid grid-cols-3 divide-x divide-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden animate-fade-up [animation-delay:0.4s]">
              {[
                { count: 138, suffix: '+', label: 'Clients satisfaits' },
                { count: 5, suffix: 'ans', label: "D'expérience" },
                { count: 24, suffix: 'h/7', label: 'Disponibilité' },
              ].map(({ count, suffix, label }) => (
                <div key={label} className="bg-white/[0.02] px-5 py-6 text-center">
                  <div className="font-display font-black text-[36px] text-cyan-deslud leading-none mb-1.5"
                    data-count={count} data-suffix={suffix}>
                    {count}{suffix}
                  </div>
                  <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Card (hidden on mobile) */}
          <div className="hidden xl:block relative animate-fade-right [animation-delay:0.2s]">
            {/* Floating badge */}
            <div className="absolute -top-5 -right-5 z-10 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-2xl px-5 py-4 text-center shadow-glow animate-float">
              <div className="font-display font-black text-2xl text-white leading-none">⭐ 4.6</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 mt-1">Note clients</div>
            </div>

            <div className="relative bg-gradient-to-br from-navy-3 to-navy-4 border border-blue-deslud/30 rounded-2xl p-9 shadow-card overflow-hidden">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-deslud to-cyan-deslud" />

              <div className="font-display text-[11px] font-bold tracking-[0.25em] uppercase text-cyan-deslud mb-5">
                Nos services de plomberie
              </div>

              <div className="flex flex-col gap-3.5 mb-7">
                {services.map(({ icon, name, desc }) => (
                  <button key={name} onClick={() => handleNav('#services')}
                    className="flex items-center gap-3.5 px-4 py-3.5 bg-blue-deslud/8 border border-blue-deslud/20 rounded-xl hover:bg-blue-deslud/15 hover:border-blue-deslud hover:translate-x-1 transition-all duration-300 group text-left">
                    <div className="w-10 h-10 bg-blue-deslud rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-glow-blue">{icon}</div>
                    <div className="flex-1">
                      <div className="font-display font-bold text-[16px] text-white uppercase tracking-[0.03em]">{name}</div>
                      <div className="text-[12px] text-white/40 mt-0.5">{desc}</div>
                    </div>
                    <span className="text-cyan-deslud opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </button>
                ))}
              </div>

              {/* Urgence indicator */}
              <div className="flex items-center gap-3 px-4 py-3.5 bg-red-500/8 border border-red-500/20 rounded-xl">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-dot flex-shrink-0" />
                <span className="font-display font-bold text-sm text-white/80 uppercase tracking-[0.05em] flex-1">Intervention d'urgence disponible</span>
                <a href="tel:+237683906225" className="font-display font-black text-[14px] text-cyan-deslud tracking-wide hover:text-cyan-deslud-2 transition-colors">683 90 62 25</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <button onClick={() => handleNav('#stats-band')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 font-display text-[11px] tracking-[0.2em] uppercase hover:text-white/60 transition-colors z-10">
        <span>Découvrir</span>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-cyan-deslud/50 to-transparent" style={{ animation: 'scrollLine 2s infinite' }} />
      </button>
    </section>
  );
}
