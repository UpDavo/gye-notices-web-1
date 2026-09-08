import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleFeed } from '../components/news/ArticleFeed';
import { CategorySidebar } from '../components/news/CategorySidebar';
import { AdSpace } from '../components/ads/AdSpace';
import { useArticles, useCategories } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';

/* Todas las notas, con búsqueda y paginación.

   El estado vive en la URL (`?q=`, `?page=`) y no en el componente: así la
   página se puede compartir, se recarga igual y el botón atrás del navegador
   hace lo que el lector espera. */

export function NewsPage() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useCategories();

  const query = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);

  const { data, loading, error, reload } = useArticles({ q: query, page, page_size: 12 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, query]);

  const setPage = useCallback(
    (next: number) => {
      const updated = new URLSearchParams(params);
      if (next <= 1) updated.delete('page');
      else updated.set('page', String(next));
      setParams(updated);
    },
    [params, setParams],
  );

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    const updated = new URLSearchParams();
    if (term) updated.set('q', term);
    setParams(updated);
  }

  const title = query ? `Búsqueda: ${query} — Guayas Hoy` : 'Todas las noticias — Guayas Hoy';

  usePageSeo({
    title,
    description: query
      ? `Resultados de "${query}" en las noticias del Guayas.`
      : 'Todas las noticias del Guayas publicadas por los medios de la provincia, con crédito y enlace al original.',
    path: query ? `/noticias?q=${encodeURIComponent(query)}` : '/noticias',
    // Una página de resultados no aporta nada a un buscador y compite con las
    // notas reales por presupuesto de rastreo.
    noIndex: Boolean(query),
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 pt-10 md:pt-14 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="kicker m-0 mb-3">{query ? 'Búsqueda' : 'Archivo'}</p>
              <h1 className="display text-4xl md:text-6xl text-foreground m-0 mb-3">
                {query ? `“${query}”` : 'Todas las noticias'}
              </h1>
              <p className="text-muted-foreground m-0 tabular-nums">
                {typeof data?.count === 'number'
                  ? `${data.count} ${data.count === 1 ? 'nota' : 'notas'}`
                  : 'Cargando…'}
              </p>
            </div>

            <form onSubmit={submitSearch} role="search" className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="page-search" className="sr-only">
                Buscar noticias
              </label>
              <div className="flex items-center gap-2 rounded-full bg-surface pl-4 pr-1.5 h-12 flex-1 md:w-80 focus-within:ring-2 focus-within:ring-accent/40 transition-shadow">
                <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                <input
                  id="page-search"
                  name="q"
                  type="search"
                  defaultValue={query}
                  key={query}
                  placeholder="Buscar en las noticias"
                  className="bg-transparent border-0 outline-none text-base w-full text-foreground placeholder:text-muted-foreground"
                />
                <button type="submit" className="pill pill-ink !py-2.5 !px-4 text-[13px]">
                  Buscar
                </button>
              </div>
              {query && (
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams())}
                  aria-label="Limpiar búsqueda"
                  className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors bg-transparent cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-10">
            <div>
              <CategorySidebar categories={categories ?? []} />
              {/* El rectángulo acompaña a la columna de secciones; en móvil
                  queda encima de la rejilla, donde sí se ve. */}
              <AdSpace slot="rail" className="mt-6 md:mt-8" />
            </div>

            <div>
              <ArticleFeed
                data={data}
                loading={loading}
                error={error}
                onRetry={reload}
                onPageChange={setPage}
                emptyTitle={query ? 'Sin resultados' : undefined}
                emptyMessage={
                  query
                    ? `No encontramos notas que mencionen “${query}”. Prueba con otra palabra.`
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
