import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroBanners } from '../components/HeroBanners';
import { TickerSection } from '../components/sections/TickerSection';
import { FrontPageSection } from '../components/sections/FrontPageSection';
import { NewsFeedSection } from '../components/sections/NewsFeedSection';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';

const TITLE = 'Guayas Hoy | Lo que pasa en la ciudad, hoy';
const DESCRIPTION =
  'Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en un solo lugar. Titulares, extracto y enlace directo al medio que las publicó.';

export function HomePage() {
  usePageSeo({
    title: TITLE,
    description: DESCRIPTION,
    path: '/',
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Guayas Hoy',
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: 'es-EC',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/noticias?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  });

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      {/* Sin `pt`: la barra flota sobre el banner, que empieza pegado al borde
          superior. El hueco que la barra necesita cuando no hay banner lo
          reserva `HeroBanners`, que es quien sabe si hay uno. */}
      <main>
        <HeroBanners />
        <TickerSection />
        <FrontPageSection />
        <NewsFeedSection />
      </main>
      <Footer />
    </div>
  );
}
