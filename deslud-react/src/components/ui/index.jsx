// src/components/ui/index.jsx
import { useEffect, useState } from 'react';

/* ── BUTTON ─────────────────────────────────────────── */
export const Btn = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2.5 font-display font-bold uppercase tracking-wide rounded transition-all duration-300 cursor-pointer border-0 relative overflow-hidden';
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-lg',
    lg: 'px-10 py-5 text-xl',
  };
  const variants = {
    primary: 'bg-blue-deslud text-white hover:bg-blue-deslud-2 hover:-translate-y-0.5 shadow-glow-blue hover:shadow-[0_12px_40px_rgba(20,100,220,0.45)]',
    outline: 'bg-transparent text-white border-2 border-white/50 hover:border-cyan-deslud hover:text-cyan-deslud hover:-translate-y-0.5',
    cyan: 'bg-cyan-deslud text-navy font-black hover:bg-cyan-deslud-2 hover:-translate-y-0.5 hover:shadow-glow',
    ghost: 'bg-white/5 text-white border border-white/20 hover:bg-white/10',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/* ── SECTION LABEL ──────────────────────────────────── */
export const SectionLabel = ({ children, light = false }) => (
  <span className={`font-display text-xs font-bold tracking-[0.25em] uppercase block mb-3 ${light ? 'text-cyan-deslud' : 'text-blue-deslud'}`}>
    {children}
  </span>
);

/* ── BADGE ──────────────────────────────────────────── */
export const Badge = ({ children }) => (
  <div className="inline-flex items-center gap-2 bg-cyan-deslud/10 border border-cyan-deslud/30 rounded-full px-4 py-2 mb-8 font-display text-[13px] font-bold tracking-[0.15em] uppercase text-cyan-deslud animate-fade-down">
    <span className="w-2 h-2 bg-cyan-deslud rounded-full animate-pulse-dot" />
    {children}
  </div>
);

/* ── TOAST CONTAINER ────────────────────────────────── */
export const ToastContainer = ({ toasts }) => (
  <div className="fixed bottom-8 right-8 z-[5000] flex flex-col gap-3">
    {toasts.map((t) => (
      <div
        key={t.id}
        className="flex items-center gap-3 bg-navy-2 border border-blue-deslud/30 rounded-xl px-5 py-4 shadow-card max-w-sm animate-fade-up"
      >
        <span className="text-2xl flex-shrink-0">{t.icon}</span>
        <div>
          <div className="font-display font-bold text-[15px] uppercase tracking-wide text-white">{t.title}</div>
          <div className="text-sm text-white/60 mt-0.5">{t.message}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ── PAGE LOADER ────────────────────────────────────── */
export const PageLoader = ({ hidden }) => (
  <div className={`fixed inset-0 bg-navy z-[9999] flex flex-col items-center justify-center gap-6 transition-all duration-500 ${hidden ? 'opacity-0 invisible' : ''}`}>
    <div className="font-display text-3xl font-black text-white uppercase tracking-widest">
      DESLUD <span className="text-cyan-deslud">PLOMBERIE</span>
    </div>
    <div className="w-48 h-0.5 bg-white/10 rounded overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-deslud to-cyan-deslud rounded animate-load-fill" />
    </div>
  </div>
);

/* ── STAR RATING ────────────────────────────────────── */
export const StarRating = ({ value, onChange, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const sz = size === 'lg' ? 'text-4xl' : 'text-2xl';
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${sz} cursor-pointer transition-all duration-150 select-none`}
          style={{ color: n <= (hover || value) ? '#FFB800' : 'transparent', WebkitTextStroke: '1.5px #FFB800' }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >★</span>
      ))}
    </div>
  );
};

/* ── FORM FIELD ─────────────────────────────────────── */
export const FormField = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold tracking-[0.12em] uppercase text-navy font-display">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

/* ── ALERT ──────────────────────────────────────────── */
export const Alert = ({ type, children }) => {
  if (!children) return null;
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    error: 'bg-red-500/10 border-red-500/30 text-red-500',
  };
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 border rounded-lg text-sm font-medium mb-5 ${styles[type]}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span dangerouslySetInnerHTML={{ __html: children }} />
    </div>
  );
};
