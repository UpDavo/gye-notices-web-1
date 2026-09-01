import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleFeed } from '../components/news/ArticleFeed';
import { CategoryTabs } from '../components/news/CategoryTabs';
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

      <main className="flex-1 pt-32 md:pt-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <p className="kicker flex items-center gap-3 m-0 mb-4">
              <span className="h-[2px] w-8 bg-accent" aria-hidden="true" />
              Sección
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.05] m-0 mb-3">
              {name}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground text-lg m-0 max-w-2xl">{category.description}</p>
            )}
          </header>

          <CategoryTabs categories={categories ?? []} className="mb-10" />

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
      </main>

      <Footer />
    </div>
  );
}
