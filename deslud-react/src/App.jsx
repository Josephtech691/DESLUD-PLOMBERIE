// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LangProvider, useLang } from './hooks/useLang.jsx';
import { useReveal, useCounter } from './hooks/useReveal';
import { useToast } from './hooks/useToast';
import { PageLoader, ToastContainer } from './components/ui';
import { useState } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/ui/WhatsApp';

import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';

/* ── Language switcher ── */
function LangSwitcher() {
  const { lang, switchLang } = useLang();
  return (
    <button
      onClick={() => switchLang(lang === 'fr' ? 'en' : 'fr')}
      className="fixed top-[88px] right-6 z-50 flex items-center gap-1.5 bg-navy-2/90 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 hover:border-blue-deslud/40 transition-all group"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span className="text-base">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
      <span className="font-display font-bold text-[12px] text-white/60 group-hover:text-white transition-colors uppercase tracking-[0.1em]">
        {lang === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
}

/* ── Layout wrapper (with nav + footer) ── */
function Layout({ children, showToast }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

/* ── App inner with hooks ── */
function AppInner() {
  const location = useLocation();
  const { toasts, showToast } = useToast();
  const [loaderHidden, setLoaderHidden] = useState(false);

  useReveal();
  useCounter();

  useEffect(() => { setTimeout(() => setLoaderHidden(true), 1400); }, []);

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  // Re-run reveal on route change
  useEffect(() => {
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
      );
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <PageLoader hidden={loaderHidden} />
      <ToastContainer toasts={toasts} />
      {!isAdmin && <LangSwitcher />}

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <Layout showToast={showToast}>
            <Routes>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={
                <div className="min-h-screen bg-navy flex items-center justify-center text-center pt-24">
                  <div>
                    <div className="text-8xl mb-6">🔧</div>
                    <h1 className="font-display font-black text-5xl text-white uppercase mb-4">404</h1>
                    <p className="text-white/50 mb-8">Page non trouvée</p>
                    <a href="/" className="px-8 py-4 bg-blue-deslud text-white font-display font-bold uppercase text-lg rounded-xl hover:bg-blue-deslud-2 transition-colors">← Accueil</a>
                  </div>
                </div>
              } />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
