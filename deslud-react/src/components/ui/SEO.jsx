// src/components/ui/SEO.jsx
import { useEffect } from 'react';

const defaults = {
  title: 'Deslud Plomberie — Votre Confort, Notre Expertise | Yaoundé, Cameroun',
  description: 'Plombier professionnel à Yaoundé : installation sanitaire, entretien, dépannage rapide. Service rapide, propre et efficace dans tout le Cameroun. ☎ 683 90 62 25',
  keywords: 'plombier Yaoundé, plomberie Cameroun, dépannage fuite eau, installation sanitaire, entretien plomberie, plombier urgence Yaoundé, dépannage plomberie Cameroun',
  image: '/og-image.png',
};

export default function SEO({ title, description, keywords, path = '' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Deslud Plomberie` : defaults.title;
    document.title = fullTitle;

    const setMeta = (name, content, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        prop ? el.setAttribute('property', name) : el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description || defaults.description);
    setMeta('keywords', keywords || defaults.keywords);
    setMeta('robots', 'index, follow');
    setMeta('author', 'Deslud Plomberie');
    setMeta('geo.region', 'CM-CE');
    setMeta('geo.placename', 'Yaoundé');

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description || defaults.description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', `https://deslud-plomberie.cm${path}`, true);
    setMeta('og:image', defaults.image, true);
    setMeta('og:locale', 'fr_CM', true);
    setMeta('og:site_name', 'Deslud Plomberie', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description || defaults.description);

    // Structured data (JSON-LD)
    let ld = document.getElementById('ld-json');
    if (!ld) { ld = document.createElement('script'); ld.id = 'ld-json'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Plumber',
      name: 'Deslud Plomberie',
      description: defaults.description,
      telephone: ['+237683906225', '+237658518788'],
      email: 'ludovicnono83@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Yaoundé', addressCountry: 'CM' },
      areaServed: 'Cameroun',
      priceRange: '5000-50000 FCFA',
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '20:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '18:00' },
      ],
      url: 'https://deslud-plomberie.cm',
      sameAs: ['https://wa.me/237683906225'],
    });
  }, [title, description, keywords, path]);

  return null;
}
