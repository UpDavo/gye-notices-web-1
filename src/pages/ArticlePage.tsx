import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArticleCard } from '../components/news/ArticleCard';
import { SourceCredit } from '../components/news/SourceCredit';
import { CardSkeleton, ErrorState } from '../components/news/States';
import { SectionHeader } from '../components/ui/ScrollMotion';
import { AdSpace } from '../components/ads/AdSpace';
import { useArticle, useArticles, useLatest } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { formatDateTime, shortDate, singleLine, timeAgo } from '../lib/format';
import { SITE_URL } from '../lib/api';

/* La página de una nota.

   Muestra titular, extracto e imagen, y manda al medio. No hay cuerpo del
   artículo aquí, y no es un descuido: el texto completo es del medio que lo
   escribió, así que el enlace de salida es el elemento principal de la
   página, no un pie de foto.

   Se compone como la portada: titular ancho arriba, dos columnas debajo
   —la nota y la tarjeta gris con lo último— y una fila de relacionadas al
   pie, con las mismas tarjetas de la portada. */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <Shell>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28">
        <p className="display text-7xl md:text-8xl text-surface m-0 mb-2 [-webkit-text-stroke:1.5px_hsl(var(--foreground))]">
          404
        </p>
        <h1 className="display text-3xl md:text-4xl text-foreground m-0 mb-4">Esa nota ya no está aquí</h1>
        <p className="text-muted-foreground max-w-md m-0 mb-8">
          Puede que la hayamos retirado o que el enlace esté mal escrito.
        </p>
        <Link to="/noticias" className="pill pill-ink">
          Ver todas las noticias
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </main>
    </Shell>
  );
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  /* Se guarda el slug que falló y no un booleano: así al navegar a otra nota
     el estado caduca solo, sin un efecto que lo reinicie. */
  const [imageFailedFor, setImageFailedFor] = useState<string | null>(null);
  const imageFailed = imageFailedFor === slug;
  const { data: article, loading, error, errorCode, reload } = useArticle(slug);

  /* Relacionadas: misma sección, sin repetir la que se está leyendo. La
     columna lateral trae lo último de toda la provincia. */
  const related = useArticles(
    article?.category ? { category: article.category.slug, page_size: 5 } : { page_size: 5 },
  );
  const latest = useLatest(6);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  usePageSeo(
    article
      ? {
          title: `${article.title} — Guayas Hoy`,
          description: singleLine(article.excerpt),
          path: `/noticia/${article.slug}`,
          image: article.image_url || undefined,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: singleLine(article.excerpt),
            datePublished: article.published_at,
            image: article.image_url || `${SITE_URL}/img/og.png`,
            articleSection: article.category?.name,
            inLanguage: 'es-EC',
            /* El autor y el editor son del medio, no de este sitio. */
            author: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
            publisher: { '@type': 'Organization', name: article.source.name, url: article.source.homepage_url },
            isBasedOn: article.canonical_url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/noticia/${article.slug}` },
          },
        }
      : null,
  );

  if (!loading && (error || !article)) {
    if (error && errorCode !== 'not_found') {
      return (
        <Shell>
          <main className="flex-1 pt-16 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <ErrorState message={error} onRetry={reload} />
            </div>
          </main>
        </Shell>
      );
    }
    return <NotFound />;
  }

  const relatedArticles = (related.data?.results ?? []).filter((item) => item.slug !== slug).slice(0, 4);
  const latestArticles = (latest.data?.results ?? []).filter((item) => item.slug !== slug).slice(0, 5);

  return (
    <Shell>
      <main className="flex-1 px-4 md:px-6 pt-8 md:pt-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Cabecera a todo el ancho */}
          <header className="max-w-4xl mb-8 md:mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                to="/noticias"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-surface text-[13px] font-semibold text-foreground no-underline hover:bg-muted transition-colors"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Noticias
              </Link>
              {article?.category && (
                <Link
                  to={`/seccion/${article.category.slug}`}
                  className="inline-flex items-center h-9 px-3.5 rounded-full bg-ink text-white text-[13px] font-semibold no-underline hover:bg-accent transition-colors"
                >
                  {article.category.name}
                </Link>
              )}
            </div>

            {loading || !article ? (
              <div className="animate-pulse flex flex-col gap-4" aria-hidden="true">
                <div className="h-10 rounded bg-muted w-full" />
                <div className="h-10 rounded bg-muted w-3/4" />
                <div className="h-3 rounded bg-muted w-48 mt-2" />
              </div>
            ) : (
              <>
                <h1 className="display text-[2rem] md:text-5xl text-foreground m-0 mb-5 leading-[1.02]">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <SourceCredit article={article} variant="link" />
                  <time
                    dateTime={article.published_at}
                    title={formatDateTime(article.published_at)}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Calendar size={13} aria-hidden="true" />
                    {shortDate(article.published_at)}
                    <span className="opacity-60">· {timeAgo(article.published_at)}</span>
                  </time>
                  {article.author && article.author !== article.source.name && (
                    <span>Por {article.author}</span>
                  )}
                </div>
              </>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-14">
            <div className="min-w-0">
              {article?.image_url && !imageFailed && (
                <figure className="m-0 mb-8">
                  <img
                    src={article.image_url}
                    alt=""
                    fetchPriority="high"
                    onError={() => setImageFailedFor(slug ?? null)}
                    className="w-full aspect-[16/9] object-cover rounded-[var(--radius-card-lg)] bg-muted"
                  />
                  <figcaption className="text-xs text-muted-foreground mt-3">
                    {article.image_credit || `Imagen: ${article.source.name}`}
                  </figcaption>
                </figure>
              )}

              {article && (
                <article>
                  {/* El extracto se queda en medida de lectura aunque la
                      columna sea ancha. `whitespace-pre-line` respeta los
                      párrafos que trajo el scraper. */}
                  <p className="whitespace-pre-line text-lg md:text-[1.2rem] text-foreground/90 leading-relaxed m-0 mb-10 max-w-[64ch]">
                    {article.excerpt}
                  </p>

                  <SourceCredit article={article} variant="block" className="mb-5" />

                  {/* Después de la salida al medio: el lector ya terminó de
                      leer y el anuncio no se interpone con la nota. */}
                  <AdSpace slot="article-end" className="mt-10" />
                </article>
              )}
            </div>

            {/* Columna lateral: la tarjeta gris con lo último. Se queda pegada
                al hacer scroll: la nota es corta y la lista sigue siendo útil
                al llegar al final. */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-card-lg)] bg-surface p-6">
                <SectionHeader as="h2" size="md" className="mb-6">
                  Lo último
                </SectionHeader>
                {latest.loading ? (
                  <div className="flex flex-col gap-5">
                    {Array.from({ length: 4 }, (_, i) => (
                      <CardSkeleton key={i} variant="compact" />
                    ))}
                  </div>
                ) : (
                  <ul className="list-none m-0 p-0 flex flex-col divide-y divide-border">
                    {latestArticles.map((item) => (
                      <li key={item.slug} className="py-4 first:pt-0 last:pb-0">
                        <ArticleCard article={item} variant="compact" />
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/noticias" className="pill pill-ink mt-6 w-full justify-center">
                  Ver todas las noticias
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <AdSpace slot="rail" className="mt-8" />
            </aside>
          </div>

          {/* Relacionadas: misma sección, con las tarjetas de la portada. */}
          {(related.loading || relatedArticles.length > 0) && (
            <section className="pt-16 md:pt-20">
              <SectionHeader
                to={article?.category ? `/seccion/${article.category.slug}` : '/noticias'}
                linkLabel={article?.category ? `Más de ${article.category.name}` : 'Ver todas'}
                className="mb-8"
              >
                Relacionadas
              </SectionHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {related.loading
                  ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
                  : relatedArticles.map((item) => <ArticleCard key={item.slug} article={item} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </Shell>
  );
}
