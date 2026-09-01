import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { Article } from '../../lib/api';
import { shortDate, timeAgo } from '../../lib/format';

/* Tarjeta de nota en cuatro tamaños.

   Sin bordes, sin fondo, sin reglas: la pieza es la foto redondeada, una fila
   de metadatos pequeña (viñeta con la sección a la izquierda, calendario con
   la fecha a la derecha), el titular en negrita apretada y dos líneas de
   extracto en gris. Lo que separa una tarjeta de otra es el aire.

   `standard` llena las rejillas; `compact` es la fila de una lista con
   miniatura cuadrada; `media` es la fila grande del bloque de tendencias;
   `overlay` es la foto a sangre con el titular encima. */

type Variant = 'standard' | 'compact' | 'media' | 'overlay';

type Props = {
  article: Article;
  variant?: Variant;
  /* Las primeras tarjetas visibles no deben ir en lazy: retrasa el LCP. */
  eager?: boolean;
  className?: string;
};

/* Un medio puede no traer imagen, o su CDN puede fallar. En los dos casos el
   hueco se rellena con un degradado de tinta y el nombre del medio, discreto:
   mantiene la altura para que la rejilla no se desalinee, sin gritar. */
function Fallback({ article, label = true }: { article: Article; label?: boolean }) {
  return (
    <div
      className="relative h-full w-full flex items-end p-3 overflow-hidden"
      style={{
        background:
          'linear-gradient(150deg, hsl(var(--ink)) 0%, hsl(var(--ink-soft)) 55%, hsl(var(--accent-deep)) 100%)',
      }}
    >
      <svg
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-20"
        aria-hidden="true"
      >
        <path d="M0 30q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M0 44q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M0 16q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
      </svg>
      {label && (
        <span className="relative font-bold text-white/90 text-xs leading-tight">
          {article.source.name}
        </span>
      )}
    </div>
  );
}

export function Cover({
  article,
  className,
  eager,
  label = true,
}: {
  article: Article;
  className: string;
  eager?: boolean;
  label?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`overflow-hidden bg-muted ${className}`}>
      {article.image_url && !failed ? (
        <img
          src={article.image_url}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
      ) : (
        <Fallback article={article} label={label} />
      )}
    </div>
  );
}

/* La fila de metadatos: «• Sección» a la izquierda y la fecha con calendario
   a la derecha. Si la nota no tiene sección, la viñeta lleva el medio: la fila
   nunca queda coja. */
function Meta({ article, date = 'short' }: { article: Article; date?: 'short' | 'ago' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="tag-dot truncate">{article.category?.name ?? article.source.name}</span>
      <time
        dateTime={article.published_at}
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0"
      >
        <Calendar size={11} aria-hidden="true" />
        {date === 'short' ? shortDate(article.published_at) : timeAgo(article.published_at)}
      </time>
    </div>
  );
}

export function ArticleCard({ article, variant = 'standard', eager = false, className = '' }: Props) {
  const to = `/noticia/${article.slug}`;

  if (variant === 'compact') {
    return (
      <Link to={to} className={`group flex gap-3.5 items-start no-underline ${className}`}>
        <Cover article={article} className="h-16 w-16 shrink-0 rounded-lg" eager={eager} label={false} />
        <div className="flex flex-col gap-1.5 min-w-0 pt-0.5">
          <span className="tag-dot">{article.category?.name ?? article.source.name}</span>
          <h3 className="font-semibold text-[14px] text-foreground leading-snug tracking-[-0.01em] m-0 line-clamp-2 group-hover:text-accent transition-colors duration-150">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === 'media') {
    return (
      <Link to={to} className={`group flex gap-4 items-start no-underline ${className}`}>
        <Cover article={article} className="h-[5.5rem] w-32 shrink-0 rounded-xl" eager={eager} label={false} />
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <Meta article={article} />
          <h3 className="font-bold text-[15px] text-foreground leading-snug tracking-[-0.01em] m-0 line-clamp-2 group-hover:text-accent transition-colors duration-150">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed m-0 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'overlay') {
    return (
      <Link
        to={to}
        className={`group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-card-lg)] bg-ink text-white no-underline min-h-[22rem] ${className}`}
      >
        <Cover article={article} className="absolute inset-0 rounded-none" eager={eager} label={false} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, hsl(203 82% 8% / 0.92) 0%, hsl(203 82% 8% / 0.45) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <div className="relative p-6 md:p-8 flex flex-col gap-3">
          <p className="text-[12px] text-white/75 m-0">
            {article.category?.name ?? article.source.name}
            <span aria-hidden="true"> – </span>
            <time dateTime={article.published_at}>{shortDate(article.published_at)}</time>
          </p>
          <h3 className="display uppercase text-xl md:text-2xl text-white m-0 line-clamp-3 leading-[1.05]">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className={`group flex flex-col gap-3 no-underline ${className}`}>
      <Cover article={article} className="aspect-[4/3] rounded-xl" eager={eager} />
      <Meta article={article} />
      <h3 className="font-bold text-[1.05rem] text-foreground leading-snug tracking-[-0.015em] m-0 line-clamp-2 group-hover:text-accent transition-colors duration-150">
        {article.title}
      </h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed m-0 line-clamp-2">
        {article.excerpt}
      </p>
    </Link>
  );
}
