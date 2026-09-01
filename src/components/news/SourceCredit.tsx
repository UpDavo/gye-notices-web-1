import { ExternalLink } from 'lucide-react';
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
      <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <span className="h-1.5 w-1.5 bg-accent shrink-0" aria-hidden="true" />
        <span className="font-semibold text-foreground/75">{source.name}</span>
      </span>
    );
  }

  if (variant === 'link') {
    return (
      <a
        href={article.canonical_url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-accent no-underline hover:underline ${className}`}
      >
        {source.name}
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    );
  }

  /* El bloque de salida abre con la regla gruesa del sistema: es el elemento
     principal de la página de nota y se compone como una pieza más. */
  return (
    <div className={`border-t-2 border-foreground/85 bg-surface rounded-b-lg p-5 ${className}`}>
      <p className="kicker m-0 mb-2">Publicado originalmente por</p>
      <p className="font-display font-bold text-xl text-foreground m-0 mb-1">{source.name}</p>
      <p className="text-sm text-muted-foreground m-0 mb-4">
        Guayas Hoy resume y enlaza. El artículo completo, las fotos y los
        derechos son de {source.name}.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={article.canonical_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold bg-accent text-white no-underline hover:opacity-90 transition-opacity"
        >
          Leer la nota completa
          <ExternalLink size={14} aria-hidden="true" />
        </a>
        <a
          href={source.homepage_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm text-muted-foreground no-underline hover:text-foreground transition-colors"
        >
          {source.domain}
        </a>
      </div>
    </div>
  );
}
