import { useState } from 'react';
import { useArticles, useCategories } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { pillTabClass } from '../news/pillTab';
import { EmptyState, ErrorState, GridSkeleton } from '../news/States';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* Un solo flujo de noticias con píldoras para filtrar.

   El filtro NO navega: cambia el estado y vuelve a pedir. Los enlaces de
   sección permanentes siguen existiendo en `/seccion/:slug`, que es lo que
   se comparte y lo que indexa un buscador; esto es para hojear.

   Los esqueletos salen solos al cambiar de píldora: `useArticles` está
   cacheado por la clave de la consulta, así que al cambiar el filtro la
   clave deja de coincidir y el hook vuelve a `loading`. */

const PAGE_SIZE = 9;

export function NewsFeedSection() {
  const [active, setActive] = useState<string | null>(null);
  const { data: categories } = useCategories();
  const { data, loading, error, reload } = useArticles({
    category: active ?? undefined,
    page_size: PAGE_SIZE,
  });

  // Una sección sin notas es una píldora que solo puede decepcionar.
  const withContent = (categories ?? []).filter((c) => (c.article_count ?? 0) > 0);
  const articles = data?.results ?? [];

  return (
    <section id="secciones" className="px-4 md:px-6 pt-16 md:pt-20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <Reveal className="mb-6">
          <SectionHeader to="/noticias">Explora la ciudad</SectionHeader>
        </Reveal>

        {/* Botones reales, no enlaces: esto filtra en la misma página. */}
        <div
          role="group"
          aria-label="Filtrar por sección"
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-10"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={pillTabClass(active === null)}
          >
            Todas
          </button>
          {withContent.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActive(category.slug)}
              aria-pressed={active === category.slug}
              className={pillTabClass(active === category.slug)}
            >
              {category.name}
              <span className="text-[11px] opacity-60 tabular-nums">{category.article_count}</span>
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={reload} />}

        {!error && loading && <GridSkeleton count={PAGE_SIZE} />}

        {!error && !loading && articles.length === 0 && (
          <EmptyState message="En cuanto los medios publiquen algo de esta sección, aparecerá aquí." />
        )}

        {!error && !loading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {articles.map((article, i) => (
              <Reveal key={article.slug} delay={Math.min(i, 5) * 0.05}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
