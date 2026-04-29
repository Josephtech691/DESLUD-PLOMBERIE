// src/pages/Blog.jsx
import { useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useLang } from '../hooks/useLang.jsx';

export const posts = [
  { slug: 'reparer-fuite-eau', cat: 'tutorial', read: 5, date: '2024-02-15',
    fr: { title: "Comment réparer une fuite d'eau chez soi ?", excerpt: "Une fuite d'eau peut sembler anodine mais elle peut rapidement causer des dégâts importants. Voici les étapes pour identifier et réparer une fuite simple.", content: `Une fuite d'eau non traitée peut augmenter votre facture d'eau de 20 à 30% et causer des dégâts structurels. Voici comment réagir.\n\n**1. Identifier la source**\nLocalisez la fuite en vérifiant sous les éviers, autour des toilettes et le long des tuyaux visibles. Un compteur d'eau qui tourne sans utilisation indique une fuite cachée.\n\n**2. Couper l'eau**\nFermez le robinet d'arrêt le plus proche de la fuite. Si vous ne le trouvez pas, fermez le robinet général à l'entrée de la maison.\n\n**3. Réparer selon le type**\n- Joint défaillant : remplacer le joint\n- Fissure sur tuyau : utiliser un collier de réparation ou du ruban téflon pour une solution temporaire\n- Raccord lâche : resserrer avec une clé\n\n**4. Quand appeler un professionnel ?**\nSi la fuite est dans un mur, dans les fondations, ou si vous ne trouvez pas la source, appelez immédiatement Deslud Plomberie au 683 90 62 25.` },
    en: { title: "How to fix a water leak at home?", excerpt: "A water leak may seem minor but can quickly cause major damage. Here are the steps to identify and repair a simple leak.", content: "Water leaks can increase your water bill by 20-30% and cause structural damage. Here's how to react.\n\n**1. Identify the source**\nLocate the leak by checking under sinks, around toilets and along visible pipes.\n\n**2. Shut off the water**\nClose the nearest stop valve. If you can't find it, close the main valve at the house entrance.\n\n**3. Repair based on type**\n- Faulty seal: replace the seal\n- Pipe crack: use a repair clamp or teflon tape as a temporary fix\n- Loose fitting: tighten with a wrench\n\n**4. When to call a professional?**\nIf the leak is inside a wall or you can't find the source, call Deslud Plomberie at 683 90 62 25." },
  },
  { slug: 'pourquoi-robinet-fuit', cat: 'advice', read: 4, date: '2024-02-08',
    fr: { title: "Pourquoi votre robinet fuit et comment y remédier ?", excerpt: "Un robinet qui goutte semble anodin, mais cela peut gaspiller des centaines de litres d'eau par jour. Découvrez les causes et solutions.", content: "Un robinet qui fuit goutte à goutte peut gaspiller jusqu'à 120 litres d'eau par jour. Voici les causes les plus fréquentes.\n\n**Causes principales :**\n- Joint usé ou endommagé\n- Siège de robinet abîmé\n- Cartouche défectueuse (mitigeur)\n- Pression d'eau trop élevée\n\n**Solutions :**\n1. Changer le joint : démontez le robinet, remplacez le joint en caoutchouc\n2. Remplacer la cartouche : pour les mitigeurs modernes\n3. Réguler la pression : installez un réducteur de pression\n\nSi le problème persiste, nos techniciens Deslud Plomberie interviennent rapidement." },
    en: { title: "Why does your faucet drip and how to fix it?", excerpt: "A dripping faucet seems harmless but can waste hundreds of liters of water per day. Discover the causes and solutions.", content: "A dripping faucet can waste up to 120 liters of water per day. Here are the most common causes.\n\n**Main causes:**\n- Worn or damaged washer\n- Damaged valve seat\n- Faulty cartridge (mixer)\n- Too high water pressure\n\n**Solutions:**\n1. Change the washer: disassemble the faucet, replace the rubber washer\n2. Replace the cartridge: for modern mixer faucets\n3. Regulate pressure: install a pressure reducer" },
  },
  { slug: 'quand-appeler-plombier', cat: 'advice', read: 3, date: '2024-01-25',
    fr: { title: "Quand faut-il absolument appeler un plombier ?", excerpt: "Certains problèmes de plomberie peuvent sembler mineurs mais nécessitent l'intervention d'un professionnel. Voici les situations urgentes.", content: "Certaines situations de plomberie requièrent l'intervention urgente d'un professionnel. Voici les signes qui ne doivent pas être ignorés.\n\n**Appelez immédiatement si :**\n- Une fuite importante inonde votre maison\n- Le compteur d'eau tourne sans utilisation\n- Vous entendez des bruits dans les tuyaux (coups de bélier)\n- Une odeur de gaz ou d'égout dans la maison\n- Les toilettes se bouchent régulièrement\n- L'eau chaude est insuffisante ou absente\n- Des taches d'humidité apparaissent sur les murs\n\n**N'attendez pas !**\nPour toute urgence plomberie à Yaoundé, Deslud Plomberie intervient en moins de 30 minutes." },
    en: { title: "When should you absolutely call a plumber?", excerpt: "Some plumbing problems may seem minor but require professional intervention. Here are the urgent situations.", content: "Some plumbing situations require immediate professional intervention. Here are the signs that must not be ignored.\n\n**Call immediately if:**\n- A major leak is flooding your home\n- The water meter runs without usage\n- You hear noises in pipes (water hammer)\n- Gas or sewer smell in the house\n- Toilets regularly get blocked\n- Hot water is insufficient or absent\n- Moisture stains appear on walls\n\n**Don't wait!**\nFor any plumbing emergency in Yaoundé, Deslud Plomberie responds in under 30 minutes." },
  },
  { slug: 'entretien-plomberie', cat: 'tips', read: 6, date: '2024-01-15',
    fr: { title: "Guide complet d'entretien de votre plomberie", excerpt: "Un entretien régulier de votre plomberie vous évite des pannes coûteuses. Voici nos conseils professionnels pour chaque saison.", content: "Entretenir sa plomberie régulièrement permet d'éviter des réparations coûteuses. Voici nos conseils saisonniers.\n\n**Chaque mois :**\n- Vérifier l'absence de fuites sous les éviers\n- Tester les robinets d'arrêt\n- Nettoyer les siphons\n\n**Chaque année :**\n- Faire purger le chauffe-eau\n- Inspecter les joints de baignoire et douche\n- Vérifier la pression d'eau\n- Nettoyer les canalisations\n\n**Avant la saison des pluies :**\n- Vérifier les évacuations\n- Inspecter les toitures et gouttières\n- Contrôler les raccords extérieurs" },
    en: { title: "Complete plumbing maintenance guide", excerpt: "Regular plumbing maintenance avoids costly breakdowns. Here are our professional tips for each season.", content: "Regular plumbing maintenance prevents expensive repairs. Here are our seasonal tips.\n\n**Every month:**\n- Check for leaks under sinks\n- Test stop valves\n- Clean traps\n\n**Every year:**\n- Drain the water heater\n- Inspect bath and shower seals\n- Check water pressure\n- Clean drains\n\n**Before rainy season:**\n- Check drainage systems\n- Inspect roofs and gutters\n- Check external fittings" },
  },
];

export default function Blog() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const cats = { tutorial: lang === 'fr' ? 'Tutoriel' : 'Tutorial', advice: lang === 'fr' ? 'Conseil' : 'Advice', tips: lang === 'fr' ? 'Astuces' : 'Tips' };
  const catColors = { tutorial: 'bg-blue-deslud/10 text-blue-deslud', advice: 'bg-cyan-deslud/10 text-cyan-700', tips: 'bg-green-100 text-green-700' };

  return (
    <>
      <SEO title={lang === 'fr' ? 'Blog Plomberie — Conseils et Astuces' : 'Plumbing Blog — Tips & Advice'}
        description={lang === 'fr' ? 'Conseils et astuces de plomberie par Deslud Plomberie Yaoundé. Réparer une fuite, entretien, dépannage.' : 'Plumbing tips by Deslud Plomberie Yaoundé. Fix leaks, maintenance, repairs.'} path="/blog" keywords="blog plomberie Yaoundé, conseils plomberie, réparer fuite eau" />
      <div className="pt-24">
        <div className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-[size:60px_60px]" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-cyan-deslud block mb-4">{t('blog.label')}</span>
            <h1 className="font-display font-black text-[clamp(40px,6vw,80px)] text-white uppercase leading-[0.95] mb-4">
              <span className="text-cyan-deslud">{t('blog.title')}</span> {t('blog.title2')}
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">{lang === 'fr' ? 'Conseils professionnels pour entretenir et réparer votre plomberie' : 'Professional advice to maintain and repair your plumbing'}</p>
          </div>
        </div>

        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {posts.map(post => {
                const info = lang === 'en' ? post.en : post.fr;
                return (
                  <article key={post.slug} onClick={() => navigate(`/blog/${post.slug}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-deslud/30 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(20,100,220,0.1)] transition-all duration-300 cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-navy to-navy-4 flex items-center justify-center">
                      <span className="text-7xl opacity-60">{post.cat === 'tutorial' ? '🔧' : post.cat === 'advice' ? '💡' : '⭐'}</span>
                    </div>
                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full ${catColors[post.cat]}`}>{cats[post.cat]}</span>
                        <span className="text-xs text-gray-400">{post.read} {t('blog.min')}</span>
                        <span className="text-xs text-gray-300 ml-auto">{new Date(post.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}</span>
                      </div>
                      <h2 className="font-display font-black text-[22px] text-navy uppercase leading-[1.15] mb-3">{info.title}</h2>
                      <p className="text-sm text-gray-400 leading-relaxed mb-5">{info.excerpt}</p>
                      <div className="flex items-center gap-2 font-display font-bold text-sm text-blue-deslud uppercase tracking-[0.08em] hover:gap-3 transition-all">
                        {t('blog.read')} <span>→</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
