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

/* La foto, o nada.

   Un medio puede no traer imagen —media docena de los feeds del catálogo no la
   publican— y una foto de terceros puede fallar por motivos que este sitio no
   controla. En los dos casos la tarjeta se queda sin ella y punto: la nota se
   pinta como nota de texto.

   Antes había un relleno con degradado y el nombre del medio. Ocupaba el mismo
   sitio que una foto sin ser una, así que la rejilla se llenaba de cajas
   decorativas que no informaban de nada y competían con las fotos de verdad.
   Una nota sin foto es una nota corta, no una nota rota.

   Devolver `null` y no una caja vacía es lo que deja que el titular suba a
   ocupar el hueco: cada variante ya es un flex o una columna, así que el
   elemento que falta simplemente no reserva espacio. */
export function Cover({
  article,
  className,
  eager,
}: {
  article: Article;
  className: string;
  eager?: boolean;
  label?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!article.image_url || failed) return null;

  return (
    <div className={`overflow-hidden bg-muted ${className}`}>
      <img
        src={article.image_url}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
      />
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

  /* `overlay` es la única variante cuyo diseño ES la foto: el titular va en
     blanco encima de ella. Sin imagen quedaría un rectángulo de tinta con
     texto, que es justo el relleno que se acaba de quitar, así que la nota
     sin foto cae a la tarjeta normal. */
  if (variant === 'overlay' && article.image_url) {
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
