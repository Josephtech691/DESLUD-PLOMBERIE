// src/pages/BlogPost.jsx
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useLang } from '../hooks/useLang.jsx';
import { posts } from './Blog';

export default function BlogPost() {
  const { slug } = useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const post = posts.find(p => p.slug === slug);

  if (!post) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">📄</div>
        <div className="font-display font-black text-3xl uppercase mb-4">Article non trouvé</div>
        <button onClick={() => navigate('/blog')} className="px-6 py-3 bg-blue-deslud rounded-xl font-display font-bold uppercase text-white">← Blog</button>
      </div>
    </div>
  );

  const info = lang === 'en' ? post.en : post.fr;

  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i} className="font-display font-black text-xl text-navy uppercase mt-8 mb-4">{line.replace(/\*\*/g, '')}</h3>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 text-gray-500 leading-relaxed list-disc">{line.slice(2)}</li>;
      if (/^\d+\./.test(line)) return <li key={i} className="ml-6 text-gray-500 leading-relaxed list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      if (!line.trim()) return <div key={i} className="h-2" />;
      return <p key={i} className="text-gray-500 leading-[1.85] text-[15px]">{line}</p>;
    });

  return (
    <>
      <SEO title={info.title} description={info.excerpt} path={`/blog/${slug}`} keywords={`plomberie Yaoundé, ${slug.replace(/-/g, ' ')}`} />
      <div className="pt-24">
        <div className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-[size:60px_60px]" />
          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-display font-bold text-sm uppercase tracking-[0.1em]">
              ← {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
            </button>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-deslud">{lang === 'fr' ? 'Deslud Plomberie' : 'Deslud Plomberie'}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/50 text-sm">{post.read} {lang === 'fr' ? 'min de lecture' : 'min read'}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/50 text-sm">{new Date(post.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
            </div>
            <h1 className="font-display font-black text-[clamp(32px,5vw,60px)] text-white uppercase leading-[1.0] mb-6">{info.title}</h1>
            <p className="text-white/60 text-lg leading-relaxed">{info.excerpt}</p>
          </div>
        </div>

        <div className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <article className="lg:col-span-2 prose max-w-none">
                <div className="space-y-2">{renderContent(info.content)}</div>
              </article>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-navy rounded-2xl p-6 sticky top-28">
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-[0.05em] mb-4">{lang === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-5">{lang === 'fr' ? "Nos experts sont disponibles 7j/7 pour vous aider avec votre problème de plomberie." : "Our experts are available 24/7 to help with your plumbing issue."}</p>
                  <div className="flex flex-col gap-3">
                    <a href="tel:+237683906225" className="flex items-center gap-3 p-3 bg-blue-deslud/20 rounded-xl hover:bg-blue-deslud/30 transition-colors">
                      <span className="text-xl">📞</span>
                      <div><div className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-bold">Appeler</div><div className="font-display font-bold text-white">683 90 62 25</div></div>
                    </a>
                    <a href={`https://wa.me/237683906225?text=${encodeURIComponent(lang === 'fr' ? "Bonjour, j'ai lu votre article et j'ai besoin d'aide en plomberie." : "Hello, I read your article and need plumbing help.")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#25D366]/20 rounded-xl hover:bg-[#25D366]/30 transition-colors">
                      <span className="text-xl">💬</span>
                      <div><div className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-bold">WhatsApp</div><div className="font-display font-bold text-white">{lang === 'fr' ? 'Message direct' : 'Direct message'}</div></div>
                    </a>
                    <button onClick={() => navigate('/#contact')} className="w-full py-3 bg-cyan-deslud hover:bg-cyan-deslud-2 text-navy font-display font-bold uppercase tracking-wide rounded-xl transition-colors text-sm">
                      {lang === 'fr' ? 'Devis gratuit' : 'Free quote'}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-display font-black text-base text-navy uppercase tracking-[0.05em] mb-4">{lang === 'fr' ? 'Autres articles' : 'More articles'}</h3>
                  {posts.filter(p => p.slug !== slug).slice(0, 3).map(p => {
                    const pi = lang === 'en' ? p.en : p.fr;
                    return (
                      <button key={p.slug} onClick={() => navigate(`/blog/${p.slug}`)}
                        className="block text-left w-full py-3 border-b border-gray-200 last:border-0 hover:text-blue-deslud transition-colors">
                        <div className="font-display font-bold text-[13px] text-navy uppercase tracking-[0.03em] leading-[1.3]">{pi.title}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{p.read} {lang === 'fr' ? 'min' : 'min'}</div>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
