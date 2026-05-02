// src/components/sections/Actualites.jsx
import { useEffect, useState, useRef } from 'react';
import { useLang } from '../../hooks/useLang';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatDate = (dateStr, lang) =>
  new Date(dateStr).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

const isVideo = (url) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);
const isImage = (url) => url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

export default function Actualites() {
  const { lang } = useLang();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const trackRef    = useRef(null);
  const autoRef     = useRef(null);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

  // Charger les actualités
  useEffect(() => {
    fetch(`${API}/actualites`)
      .then(r => r.json())
      .then(j => { if (j.success) setItems(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Mettre à jour les boutons selon la position du scroll
  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;
    el.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
    return () => el.removeEventListener('scroll', updateButtons);
  }, [items]);

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    if (items.length < 2) return;
    autoRef.current = setInterval(() => {
      const el = trackRef.current;
      if (!el || isDragging.current) return;
      const cardW = el.querySelector('article')?.offsetWidth + 16 || 320;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardW, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, [items]);

  // Boutons manuels
  const scroll = (dir) => {
    clearInterval(autoRef.current);
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.querySelector('article')?.offsetWidth + 16 || 320;
    el.scrollBy({ left: dir === 'left' ? -cardW : cardW, behavior: 'smooth' });
  };

  // Drag sur desktop
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  if (loading) return (
    <div className="py-8 bg-navy-3 flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/40">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="font-display font-bold text-sm uppercase tracking-widest text-white/40">
          {lang === 'fr' ? 'Chargement...' : 'Loading...'}
        </span>
      </div>
    </div>
  );

  if (items.length === 0) return null;

  return (
    <>
      <section id="actualites" className="py-10 bg-navy-3 relative overflow-hidden">
        {/* Lignes dégradées */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-deslud to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-deslud/40 to-transparent" />

        {/* Flous latéraux pour indiquer le scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-navy-3 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-navy-3 to-transparent z-10 pointer-events-none" />

        <div className="px-6 mb-5 flex items-center justify-between max-w-[1400px] mx-auto">
          {/* Titre */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-cyan-deslud rounded-full animate-pulse-dot flex-shrink-0" />
            <span className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-[0.1em]">
              {lang === 'fr' ? '📰 Actualités' : '📰 News'}
            </span>
            <span className="hidden sm:inline font-display text-xs font-bold text-white/25 uppercase tracking-[0.12em]">
              — {items.length} {lang === 'fr' ? 'publication(s)' : 'post(s)'}
            </span>
          </div>

          {/* Boutons navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canLeft}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-blue-deslud disabled:opacity-20 disabled:cursor-not-allowed transition-all text-white font-bold text-sm"
            >←</button>
            <button
              onClick={() => scroll('right')}
              disabled={!canRight}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-blue-deslud disabled:opacity-20 disabled:cursor-not-allowed transition-all text-white font-bold text-sm"
            >→</button>
          </div>
        </div>

        {/* ── Piste de défilement horizontal ── */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-3 px-6"
          style={{
            cursor: 'grab',
            scrollbarWidth: 'none',        // Firefox
            msOverflowStyle: 'none',       // IE/Edge
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Masquer la scrollbar sur webkit */}
          <style>{`.no-sb::-webkit-scrollbar{display:none}`}</style>

          {items.map((item) => (
            <article
              key={item.id}
              onClick={() => !isDragging.current && setSelected(item)}
              className="group flex-shrink-0 w-72 sm:w-80 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-blue-deslud/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(20,100,220,0.25)] select-none"
            >
              {/* Media */}
              {item.media_url && (
                <div className="relative w-full h-44 bg-navy overflow-hidden">
                  {isVideo(item.media_url) ? (
                    <>
                      <video src={item.media_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl">▶</div>
                      </div>
                    </>
                  ) : isImage(item.media_url) ? (
                    <img
                      src={item.media_url}
                      alt={item.titre || ''}
                      draggable="false"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  ) : null}
                  {/* Overlay gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-3/80 to-transparent" />
                  {/* Badge catégorie sur l'image */}
                  {item.categorie && (
                    <div className="absolute top-3 left-3 font-display font-bold text-[10px] uppercase tracking-[0.15em] text-white bg-blue-deslud/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {item.categorie}
                    </div>
                  )}
                </div>
              )}

              <div className="p-5">
                {/* Catégorie (si pas d'image) */}
                {item.categorie && !item.media_url && (
                  <span className="inline-block font-display font-bold text-[10px] uppercase tracking-[0.15em] text-cyan-deslud bg-cyan-deslud/10 border border-cyan-deslud/20 px-2.5 py-1 rounded-full mb-3">
                    {item.categorie}
                  </span>
                )}

                {/* Titre */}
                {item.titre && (
                  <h3 className="font-display font-black text-[16px] text-white uppercase leading-[1.2] mb-2 group-hover:text-cyan-deslud transition-colors line-clamp-2">
                    {item.titre}
                  </h3>
                )}

                {/* Texte */}
                {item.texte && (
                  <p className="text-[13px] text-white/45 leading-relaxed line-clamp-3">
                    {item.texte}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                  <span className="text-[11px] text-white/25">
                    📅 {formatDate(item.created_at, lang)}
                  </span>
                  <span className="font-display font-bold text-[11px] text-blue-deslud uppercase tracking-[0.08em] group-hover:text-cyan-deslud transition-colors">
                    {lang === 'fr' ? 'Voir →' : 'View →'}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {/* Spacer pour que le dernier item soit bien visible */}
          <div className="flex-shrink-0 w-6" />
        </div>

        {/* Indicateurs de position (points) */}
        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4 px-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  clearInterval(autoRef.current);
                  const el = trackRef.current;
                  if (!el) return;
                  const cardW = el.querySelector('article')?.offsetWidth + 16 || 320;
                  el.scrollTo({ left: i * cardW, behavior: 'smooth' });
                }}
                className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-cyan-deslud transition-all"
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Modal / Lightbox ── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[3000] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-navy-2 border border-blue-deslud/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card"
            onClick={e => e.stopPropagation()}
          >
            {/* Media plein format */}
            {selected.media_url && (
              <div className="w-full aspect-video bg-black rounded-t-3xl overflow-hidden">
                {isVideo(selected.media_url)
                  ? <video src={selected.media_url} controls autoPlay className="w-full h-full object-contain" />
                  : isImage(selected.media_url)
                    ? <img src={selected.media_url} alt={selected.titre || ''} className="w-full h-full object-contain" />
                    : null
                }
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  {selected.categorie && (
                    <span className="font-display font-bold text-[10px] uppercase tracking-[0.15em] text-cyan-deslud bg-cyan-deslud/10 border border-cyan-deslud/20 px-2.5 py-1 rounded-full inline-block mb-3">
                      {selected.categorie}
                    </span>
                  )}
                  {selected.titre && (
                    <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase leading-[1.15]">
                      {selected.titre}
                    </h2>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex-shrink-0 transition-colors"
                >✕</button>
              </div>

              {selected.texte && (
                <p className="text-white/60 leading-relaxed text-[15px] whitespace-pre-wrap mb-6">
                  {selected.texte}
                </p>
              )}

              <div className="flex items-center justify-between pt-5 border-t border-white/[0.06] flex-wrap gap-3">
                <span className="text-sm text-white/30">
                  📅 {formatDate(selected.created_at, lang)}
                </span>
                <a
                  href="tel:+237683906225"
                  className="px-5 py-2.5 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-sm uppercase tracking-wide rounded-xl transition-colors"
                >
                  📞 {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
  }
