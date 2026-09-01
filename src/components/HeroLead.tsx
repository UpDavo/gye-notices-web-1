import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Article } from '../lib/api';
import { shortDate } from '../lib/format';
import { HERO_BANNERS } from '../data/banners';

/* El hero: la nota principal como tarjeta de tinta y foto.

   Mitad izquierda, panel azul noche con la sección, el titular en versales
   grandes, el extracto y el botón blanco; mitad derecha, la foto de la nota a
   sangre. Si la nota no trae foto —o su CDN falla— el hueco lo cubre la foto
   propia del Malecón, que es lo que la portada enseñaba antes: nunca se
   queda un hero a medias. */

export function HeroLead({ article }: { article: Article }) {
  const [failed, setFailed] = useState(false);
  const fallback = HERO_BANNERS[0];
  const useOwnImage = Boolean(article.image_url) && !failed;

  return (
    <section aria-label="Nota principal" className="px-4 md:px-6 pt-4 md:pt-6">
      <div className="max-w-[1200px] mx-auto">
        <Link
          to={`/noticia/${article.slug}`}
          className="group grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[var(--radius-card-lg)] text-white no-underline md:min-h-[30rem]"
        >
          {/* Panel de texto. En móvil va debajo de la foto (order-2). */}
          <div className="hero-slant order-2 md:order-1 bg-ink flex flex-col justify-center gap-5 px-6 py-9 md:px-12 md:py-16 lg:px-14">
            <p className="kicker text-white/70 m-0">
              {article.category?.name ?? 'Portada'} · {shortDate(article.published_at)}
            </p>
            <h1 className="display uppercase text-white m-0 text-[clamp(1.7rem,5vw,2.6rem)] leading-[0.98] line-clamp-4">
              {article.title}
            </h1>
            <p className="text-[15px] md:text-base text-white/75 leading-relaxed m-0 max-w-md line-clamp-3">
              {article.excerpt}
            </p>
            <div className="pt-2">
              <span className="pill pill-light">
                Leer la nota
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </span>
            </div>
          </div>

          {/* Foto */}
          <div className="order-1 md:order-2 relative bg-ink-soft overflow-hidden min-h-[15rem] sm:min-h-[19rem] md:min-h-0">
            {useOwnImage ? (
              <img
                src={article.image_url}
                alt=""
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={() => setFailed(true)}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
            ) : (
              <picture>
                {fallback.image_url_mobile && (
                  <source media="(max-width: 640px)" srcSet={fallback.image_url_mobile} />
                )}
                <img
                  src={fallback.image_url}
                  alt={fallback.alt}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </picture>
            )}
            {/* Velo hacia el panel para que la foto entre en la tinta sin corte. */}
            <div
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{ background: 'linear-gradient(to right, hsl(var(--ink) / 0.55), transparent 30%)' }}
              aria-hidden="true"
            />
            <p className="absolute bottom-3 right-4 m-0 text-[11px] text-white/70 drop-shadow">
              {useOwnImage ? article.image_credit || article.source.name : 'Guayaquil'}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="px-4 md:px-6 pt-4 md:pt-6" aria-hidden="true">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[var(--radius-card-lg)] bg-surface animate-pulse md:min-h-[30rem]">
          <div className="flex flex-col justify-center gap-4 px-6 py-9 md:px-12 order-2 md:order-1">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-9 rounded bg-muted w-full" />
            <div className="h-9 rounded bg-muted w-5/6" />
            <div className="h-9 rounded bg-muted w-2/3" />
            <div className="h-3 rounded bg-muted w-full mt-2" />
            <div className="h-3 rounded bg-muted w-4/5" />
            <div className="h-11 w-36 rounded-full bg-muted mt-2" />
          </div>
          <div className="order-1 md:order-2 bg-muted min-h-[15rem] sm:min-h-[19rem] md:min-h-0" />
        </div>
      </div>
    </section>
  );
}
