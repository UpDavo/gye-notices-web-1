import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleFeed } from '../components/news/ArticleFeed';
import { CategorySidebar } from '../components/news/CategorySidebar';
import { AdSpace } from '../components/ads/AdSpace';
import { useArticles, useCategories } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { SITE_URL } from '../lib/api';

export function SectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const { data, loading, error, reload } = useArticles({ category: slug, page, page_size: 12 });

  const category = (categories ?? []).find((c) => c.slug === slug);
  const name = category?.name ?? 'Sección';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, slug]);

  const setPage = useCallback(
    (next: number) => {
      const updated = new URLSearchParams(params);
      if (next <= 1) updated.delete('page');
      else updated.set('page', String(next));
      setParams(updated);
    },
    [params, setParams],
  );

  usePageSeo({
    title: `${name} — Guayas Hoy`,
    description:
      category?.description ||
      `Noticias de ${name} publicadas por los medios de Guayaquil, con crédito y enlace al original.`,
    path: `/seccion/${slug}`,
    jsonLd: data?.results?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${name} — Guayas Hoy`,
          url: `${SITE_URL}/seccion/${slug}`,
          inLanguage: 'es-EC',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: data.results.slice(0, 10).map((article, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${SITE_URL}/noticia/${article.slug}`,
              name: article.title,
            })),
          },
        }
      : undefined,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 pt-10 md:pt-14 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="kicker m-0 mb-3">Sección</p>
              <h1 className="display text-4xl md:text-6xl text-foreground m-0 mb-3">{name}</h1>
              {category?.description && (
                <p className="text-muted-foreground text-base md:text-lg m-0 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
            <p className="text-muted-foreground m-0 tabular-nums shrink-0">
              {typeof data?.count === 'number'
                ? `${data.count} ${data.count === 1 ? 'nota' : 'notas'}`
                : ''}
            </p>
          </header>

          {/* Patrocinio de sección: encima de la rejilla, bajo el titular. */}
          <AdSpace slot="section-top" className="mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-10">
            <CategorySidebar categories={categories ?? []} activeSlug={slug} />

            <div>
              <ArticleFeed
                data={data}
                loading={loading}
                error={error}
                onRetry={reload}
                onPageChange={setPage}
                emptyTitle={`Nada en ${name} por ahora`}
                emptyMessage="En cuanto los medios publiquen algo de esta sección, aparecerá aquí."
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
