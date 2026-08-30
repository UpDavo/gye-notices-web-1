import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useArticles, useFeatured } from '../../hooks/useNews';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton, EmptyState, ErrorState } from '../news/States';
import { Eyebrow, Reveal } from '../ui/ScrollMotion';

/* La portada: una nota principal y el resto alrededor.

   Las destacadas las marca un editor desde el admin. Si todavía no hay
   ninguna, la portada se arma sola con lo más reciente en vez de quedarse
   vacía — un periódico sin portada no es una opción. */

export function FrontPageSection() {
  const featured = useFeatured();
  const latest = useArticles({ page_size: 7 });

  const loading = featured.loading || latest.loading;
  const error = latest.error;

  const pool = featured.data?.results?.length ? featured.data.results : (latest.data?.results ?? []);

  /* La nota principal ocupa media pantalla, así que se prefiere una que traiga
     foto: sin ella el bloque queda como un rectángulo de color enorme. Si
     ninguna tiene imagen se usa la primera igual, que es mejor que una portada
     sin nota principal. */
  const leadIndex = Math.max(0, pool.findIndex((article) => article.image_url));
  const lead = pool[leadIndex];
  const rest = pool.filter((_, i) => i !== leadIndex);

  /* La columna lateral se completa con lo más reciente que no esté ya arriba,
     para que la portada nunca muestre la misma nota dos veces. */
  const used = new Set([lead?.slug, ...rest.slice(0, 3).map((a) => a.slug)].filter(Boolean));
  const aside = (latest.data?.results ?? []).filter((a) => !used.has(a.slug)).slice(0, 4);

  /* El aire de abajo lo pone la sección siguiente: sumar `pb` aquí y `pt`
     allí dejaba casi tres pantallas de fondo vacío entre un titular y otro. */
  return (
    <section id="portada" className="pt-20 md:pt-28 px-6 md:px-12 lg:px-20 bg-background scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <Eyebrow>Portada</Eyebrow>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-foreground tracking-tight leading-tight m-0">
              Lo principal de hoy.
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

        {error && <ErrorState message={error} onRetry={latest.reload} />}

        {!error && loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CardSkeleton variant="lead" />
            </div>
            <div className="flex flex-col gap-6">
              <CardSkeleton variant="compact" />
              <CardSkeleton variant="compact" />
              <CardSkeleton variant="compact" />
            </div>
          </div>
        )}

        {!error && !loading && !lead && (
          <EmptyState
            title="La portada está vacía"
            message="Todavía no se ha traído ninguna nota. Corre `python manage.py scrape_news` en el backend para llenarla."
          />
        )}

        {!error && !loading && lead && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Reveal className="lg:col-span-2" y={24}>
                <ArticleCard article={lead} variant="lead" eager />
              </Reveal>

              <Reveal className="flex flex-col gap-5 lg:pl-2" y={24} delay={0.1}>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground m-0">
                  También hoy
                </p>
                {aside.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </Reveal>
            </div>

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.slice(0, 3).map((article, i) => (
                  <Reveal key={article.slug} y={24} delay={i * 0.08}>
                    <ArticleCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
