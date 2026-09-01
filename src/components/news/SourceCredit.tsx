import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Article } from '../../lib/api';

/* El crédito al medio.

   Va en cada tarjeta y en cada nota, y siempre enlaza al original. No es
   decoración: es la contraparte de agregar contenido ajeno, así que este
   componente no tiene un modo "sin enlace". */

type Props = {
  article: Article;
  /* `inline` es la versión de tarjeta (una línea, sin enlace propio para no
     anidar un <a> dentro del <a> de la tarjeta). */
  variant?: 'inline' | 'link' | 'block';
  className?: string;
};

export function SourceCredit({ article, variant = 'inline', className = '' }: Props) {
  const { source } = article;

  if (variant === 'inline') {
    return (
      <span className={`tag-dot ${className}`}>
        <span className="font-semibold text-foreground/80">{source.name}</span>
      </span>
    );
  }

  if (variant === 'link') {
    return (
      <a
        href={article.canonical_url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`inline-flex items-center gap-1.5 text-sm font-semibold text-foreground no-underline hover:text-accent transition-colors ${className}`}
      >
        {source.name}
        <ExternalLink size={13} aria-hidden="true" />
      </a>
    );
  }

  /* El bloque de salida es una tarjeta de tinta: es el elemento principal de
     la página de nota —aquí no hay más texto que leer— y se compone con el
     mismo bloque oscuro del hero para que se lea como «lo importante». */
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-card-lg)] bg-ink text-ink-foreground p-7 md:p-9 ${className}`}
    >
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent-bright) / 0.35), transparent 65%)' }}
        aria-hidden="true"
      />
      <p className="relative kicker text-white/60 m-0 mb-3">Publicado originalmente por</p>
      <p className="relative display text-2xl md:text-3xl text-white m-0 mb-3">{source.name}</p>
      <p className="relative text-sm text-white/75 leading-relaxed m-0 mb-6 max-w-md">
        Guayas Hoy resume y enlaza. El artículo completo, las fotos y los derechos son de{' '}
        {source.name}.
      </p>
      <div className="relative flex flex-wrap items-center gap-4">
        <a
          href={article.canonical_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="pill pill-light"
        >
          Leer la nota completa
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          href={source.homepage_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm text-white/70 no-underline hover:text-white transition-colors"
        >
          {source.domain}
        </a>
      </div>
    </div>
  );
}
