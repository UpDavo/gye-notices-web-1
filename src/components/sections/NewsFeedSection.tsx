import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useArticles, useCategories } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { EmptyState, ErrorState, GridSkeleton } from '../news/States';
import { Eyebrow, Reveal } from '../ui/ScrollMotion';

/* Un solo flujo de noticias con badges para filtrar.

   Antes esto eran cinco franjas, una por sección, apiladas. Leía como cinco
   listas cortas en vez de como un periódico, y obligaba a bajar mucho para ver
   poco. Ahora es una sola rejilla y la sección se elige con un badge.

   El filtro NO navega: cambia el estado y vuelve a pedir. Los enlaces de
   sección permanentes siguen existiendo en `/seccion/:slug`, que es lo que se
   comparte y lo que indexa un buscador; esto es para hojear.

   Los esqueletos salen solos al cambiar de badge: `useArticles` está cacheado
   por la clave de la consulta, así que al cambiar el filtro la clave deja de
   coincidir y el hook vuelve a `loading` hasta que llega la respuesta. Sin eso
   la rejilla se quedaría con las notas de la sección anterior mientras carga y
   parecería que el badge no hizo nada. */

const PAGE_SIZE = 9;

export function NewsFeedSection() {
  const [active, setActive] = useState<string | null>(null);
  const { data: categories } = useCategories();
  const { data, loading, error, reload } = useArticles({
    category: active ?? undefined,
    page_size: PAGE_SIZE,
  });

  // Una sección sin notas es un badge que solo puede decepcionar.
  const withContent = (categories ?? []).filter((c) => (c.article_count ?? 0) > 0);
  const articles = data?.results ?? [];

  const badgeClass = (isActive: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-sm border cursor-pointer transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? 'bg-accent text-white border-accent font-semibold'
        : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
    }`;

  return (
    <section id="secciones" className="pt-16 md:pt-20 pb-24 md:pb-32 px-6 md:px-12 lg:px-20 bg-background scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <Eyebrow>Al día</Eyebrow>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-foreground tracking-tight leading-tight m-0">
              Por dónde va la ciudad.
            </h2>
          </div>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent no-underline hover:gap-2.5 transition-all duration-200"
          >
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        {/* Botones reales, no enlaces: esto filtra en la misma página. */}
        <div
          role="group"
          aria-label="Filtrar por sección"
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-10"
        >
          <button type="button" onClick={() => setActive(null)} aria-pressed={active === null}
                  className={badgeClass(active === null)}>
            Todas
          </button>
          {withContent.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActive(category.slug)}
              aria-pressed={active === category.slug}
              className={badgeClass(active === category.slug)}
            >
              {category.name}
              <span className="ml-1.5 opacity-60 text-xs">{category.article_count}</span>
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} onRetry={reload} />}

        {!error && loading && <GridSkeleton count={PAGE_SIZE} />}

        {!error && !loading && articles.length === 0 && (
          <EmptyState message="En cuanto los medios publiquen algo de esta sección, aparecerá aquí." />
        )}

        {!error && !loading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Reveal key={article.slug} y={24} delay={Math.min(i, 5) * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
