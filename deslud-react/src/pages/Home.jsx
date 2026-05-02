// src/pages/Home.jsx
import SEO from '../components/ui/SEO';
import Hero from '../components/sections/Hero';
import Actualite from '../components/sections/Actualite';
import Services from '../components/sections/Services';
import Pourquoi from '../components/sections/Pourquoi';
import Processus from '../components/sections/Processus';
import Gallery from '../components/sections/Gallery';
import Temoignages from '../components/sections/Temoignages';
import CTABand from '../components/sections/CTABand';
import MapSection from '../components/sections/MapSection';
import Contact from '../components/sections/Contact';
import { useLang } from '../hooks/useLang.jsx';

export default function Home({ showToast }) {
  const { lang } = useLang();
  return (
    <>
      <SEO
        title={lang === 'fr' ? undefined : 'Deslud Plomberie — Your Comfort, Our Expertise | Yaoundé, Cameroon'}
        description={lang === 'fr'
          ? 'Plombier professionnel à Yaoundé : installation sanitaire, entretien, dépannage rapide 7j/7. ☎ 683 90 62 25'
          : 'Professional plumber in Yaoundé: sanitary installation, maintenance, 24/7 emergency repairs. ☎ 683 90 62 25'}
      />
      <Hero />
      <Actualite />
      <Services />
      <Pourquoi />
      <Processus />
      <Gallery />
      <Temoignages />
      <CTABand />
      <MapSection />
      <Contact showToast={showToast} />
    </>
  );
}
