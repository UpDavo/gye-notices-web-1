import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useArticles, useCategories } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { sidebarCountClass, sidebarRowClass } from '../news/sidebarRow';
import { EmptyState, ErrorState, GridSkeleton } from '../news/States';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* Un solo flujo de noticias con una columna de secciones para filtrar.

   El filtro NO navega: cambia el estado y vuelve a pedir. Los enlaces de
   sección permanentes siguen existiendo en `/seccion/:slug`, que es lo que
   se comparte y lo que indexa un buscador; esto es para hojear.

   Los esqueletos salen solos al cambiar de píldora: `useArticles` está
   cacheado por la clave de la consulta, así que al cambiar el filtro la
   clave deja de coincidir y el hook vuelve a `loading`. */

const PAGE_SIZE = 9;

export function NewsFeedSection() {
  const [active, setActive] = useState<string | null>(null);
  // El plegable de móvil: en escritorio la columna está siempre a la vista.
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { data, loading, error, reload } = useArticles({
    category: active ?? undefined,
    page_size: PAGE_SIZE,
  });

  // Una sección sin notas es una fila que solo puede decepcionar.
  const withContent = (categories ?? []).filter((c) => (c.article_count ?? 0) > 0);
  const articles = data?.results ?? [];
  const activeName = withContent.find((c) => c.slug === active)?.name ?? 'Todas';

  /* La misma lista sirve a la columna de escritorio y al plegable de móvil. */
  function pick(slug: string | null) {
    setActive(slug);
    setOpen(false);
  }

  const filterList = (
    <div role="group" aria-label="Filtrar por sección" className="flex flex-col gap-0.5">
      <button type="button" onClick={() => pick(null)} aria-pressed={active === null} className={sidebarRowClass(active === null)}>
        <span>Todas</span>
      </button>
      {withContent.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => pick(category.slug)}
          aria-pressed={active === category.slug}
          className={sidebarRowClass(active === category.slug)}
        >
          <span className="truncate">{category.name}</span>
          <span className={sidebarCountClass}>{category.article_count}</span>
        </button>
      ))}
    </div>
  );

  return (
    <section id="secciones" className="px-4 md:px-6 pt-16 md:pt-20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <Reveal className="mb-8">
          <SectionHeader to="/noticias">Explora la ciudad</SectionHeader>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-10">
          {/* Botones reales, no enlaces: esto filtra en la misma página. */}
          <div>
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex items-center justify-between w-full h-12 px-4 rounded-xl bg-surface border-0 text-foreground text-[14px] font-semibold cursor-pointer"
              >
                <span>
                  Secciones
                  <span className="text-muted-foreground font-medium"> · {activeName}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {open && <div className="mt-2">{filterList}</div>}
            </div>

            <div className="hidden md:block sticky top-24">
              <p className="kicker m-0 mb-3 px-3">Secciones</p>
              {filterList}
            </div>
          </div>

          <div>
            {error && <ErrorState message={error} onRetry={reload} />}

            {!error && loading && <GridSkeleton count={PAGE_SIZE} />}

            {!error && !loading && articles.length === 0 && (
              <EmptyState message="En cuanto los medios publiquen algo de esta sección, aparecerá aquí." />
            )}

            {!error && !loading && articles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {articles.map((article, i) => (
                  <Reveal key={article.slug} delay={Math.min(i, 5) * 0.05}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
