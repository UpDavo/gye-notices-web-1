import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroLead, HeroSkeleton } from '../components/HeroLead';
import { PromoBanner } from '../components/PromoBanner';
import { BreakingSection } from '../components/sections/BreakingSection';
import { LatestSection } from '../components/sections/LatestSection';
import { TrendingSection } from '../components/sections/TrendingSection';
import { NewsFeedSection } from '../components/sections/NewsFeedSection';
import { EmptyState, ErrorState } from '../components/news/States';
import { useCategories, useFeatured, useLatest } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';

const TITLE = 'Guayas Hoy | Lo que pasa en la ciudad, hoy';
const DESCRIPTION =
  'Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en un solo lugar. Titulares, extracto y enlace directo al medio que las publicó.';

/* La portada.

   Cuatro peticiones, las mismas de antes: destacadas, últimas, secciones y
   la rejilla filtrable. Las destacadas se reparten entre el hero (1), última
   hora (4), tendencias (3) y la foto grande (1); el backend ya devuelve lo
   más reciente si nadie marcó destacadas, así que la portada nunca queda
   vacía. Ninguna nota sale dos veces: el reparto es por posición. */

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

  const featured = useFeatured(9);
  const latest = useLatest(6);
  const { data: categories } = useCategories();

  const pool = featured.data?.results ?? [];

  /* El hero ocupa media pantalla, así que se prefiere una nota con foto; si
     ninguna la trae se usa la primera y el hero cae a la foto propia. */
  const leadIndex = Math.max(0, pool.findIndex((article) => article.image_url));
  const lead = pool[leadIndex];
  const rest = pool.filter((_, i) => i !== leadIndex);

  const breaking = rest.slice(0, 4);
  const trending = rest.slice(4, 7);
  /* La foto grande necesita foto de verdad: se busca la primera con imagen
     entre lo que queda y, si no hay, se toma la primera de tendencias. */
  const tail = rest.slice(7);
  const feature = tail.find((a) => a.image_url) ?? tail[0] ?? trending.find((a) => a.image_url);
  const trendingItems = feature ? trending.filter((a) => a.slug !== feature.slug) : trending;

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

        {!featured.error && (
          <>
            <BreakingSection articles={breaking} loading={featured.loading} />
            <LatestSection
              articles={latest.data?.results ?? []}
              loading={latest.loading}
              categories={categories ?? []}
            />
            <TrendingSection items={trendingItems} feature={feature} loading={featured.loading} />
          </>
        )}

        <PromoBanner />
        <NewsFeedSection />
      </main>
      <Footer />
    </div>
  );
}
