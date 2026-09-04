import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroLead, HeroSkeleton } from '../components/HeroLead';
import { PromoBanner } from '../components/PromoBanner';
import { BreakingSection } from '../components/sections/BreakingSection';
import { LatestSection } from '../components/sections/LatestSection';
import { TrendingSection } from '../components/sections/TrendingSection';
import { BriefsSection } from '../components/sections/BriefsSection';
import { NewsFeedSection } from '../components/sections/NewsFeedSection';
import { AdBand } from '../components/ads/AdSpace';
import { EmptyState, ErrorState } from '../components/news/States';
import { useCategories, useFeatured, useLatest } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';
import { splitByImage } from '../lib/articles';

const TITLE = 'Guayas Hoy | Lo que pasa en la ciudad, hoy';
const DESCRIPTION =
  'Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en un solo lugar. Titulares, extracto y enlace directo al medio que las publicó.';

/* La portada.

   Cuatro peticiones: destacadas, últimas, secciones y la rejilla filtrable.
   El backend ya devuelve lo más reciente si nadie marcó destacadas, así que
   la portada nunca queda vacía. Ninguna nota sale dos veces: el reparto es
   por posición sobre una lista ya repartida.

   Ese reparto empieza por la foto. El hero, última hora, tendencias y la
   pieza a sangre son bloques ilustrados —la última es literalmente el titular
   encima de la imagen—, así que salen todos de las notas que traen foto. Las
   que no la traen no se descartan ni se rellenan con un dibujo: bajan a «En
   breve», que es una lista de titulares y no necesita imagen para estar
   bien compuesta.

   Dentro de cada bloque el orden lo sigue dando la fecha: `-published_at`
   llega del backend y filtrar por foto no lo altera. */

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

  /* Se pide de más —14 y no 9— porque ahora la lista se parte en dos y los
     bloques ilustrados solo se sirven de una mitad. */
  const featured = useFeatured(14);
  const latest = useLatest(6);
  const { data: categories } = useCategories();

  const pool = featured.data?.results ?? [];
  const { withImage, withoutImage } = splitByImage(pool);

  const lead = withImage[0];
  const breaking = withImage.slice(1, 5);
  const trendingItems = withImage.slice(5, 8);
  const feature = withImage[8];

  /* «En breve» recoge lo que llegó sin foto. Si una corrida no trae ninguna,
     la sección no se pinta: `BriefsSection` devuelve null con la lista
     vacía. */
  const briefs = withoutImage;

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main>
        {featured.error && (
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-8">
            <ErrorState message={featured.error} onRetry={featured.reload} />
          </div>
        )}

        {!featured.error && featured.loading && <HeroSkeleton />}

        {!featured.error && !featured.loading && !lead && (
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-8">
            <EmptyState
              title="La portada está vacía"
              message="Todavía no se ha traído ninguna nota. Corre `python manage.py scrape_news` en el backend para llenarla."
            />
          </div>
        )}

        {!featured.error && lead && <HeroLead article={lead} />}

        {/* Billboard bajo el hero: el hueco más visto del sitio. Los espacios
            se definen en `src/data/ads.ts`; libres o vendidos, siempre ocupan
            su altura, así que la portada no salta al entrar una campaña. */}
        <AdBand slot="home-top" />

        {!featured.error && (
          <>
            <BreakingSection articles={breaking} loading={featured.loading} />
            <LatestSection
              articles={latest.data?.results ?? []}
              loading={latest.loading}
              categories={categories ?? []}
            />
            <TrendingSection items={trendingItems} feature={feature} loading={featured.loading} />
            <BriefsSection articles={briefs} />
          </>
        )}

        <AdBand slot="home-mid" />
        <PromoBanner />
        <NewsFeedSection />
        {/* Y la franja ancha de cierre, ya rotulada: la portada se lee
            primero y se monetiza después. */}
        <AdBand slot="home-end" />
      </main>
      <Footer />
    </div>
  );
}
