import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Article } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { SourceCredit } from './SourceCredit';

/* Tarjeta de nota en tres tamaños, en clave editorial.

   Ya no son cajas con borde y fondo: cada nota es una pieza plana que abre con
   una regla gruesa arriba —la firma del sistema— y cierra con un filete fino
   sobre la línea de crédito. La regla se tiñe de celeste al pasar el puntero,
   igual que el titular. `lead` manda en la portada, `standard` llena las
   rejillas y `compact` es la fila de una lista lateral. */

type Variant = 'lead' | 'standard' | 'compact';

type Props = {
  article: Article;
  variant?: Variant;
  /* Las primeras tarjetas visibles no deben ir en lazy: retrasa el LCP. */
  eager?: boolean;
};

function Kicker({ article }: { article: Article }) {
  if (!article.category) return null;
  return <span className="kicker">{article.category.name}</span>;
}

/* Un medio puede no traer imagen: los feeds de WordPress casi nunca la traen.

   El hueco se rellena con el motivo de olas de la marca y el nombre del medio.
   Es deliberadamente discreto — una tarjeta sin foto no debe gritar más que
   una con foto, solo mantener la altura para que la rejilla no se desalinee. */
function Fallback({ article, label = true }: { article: Article; label?: boolean }) {
  return (
    <div
      className="relative h-full w-full flex items-end p-3 overflow-hidden"
      style={{
        background:
          'linear-gradient(140deg, hsl(var(--accent-deep)) 0%, hsl(var(--accent)) 62%, hsl(var(--accent-bright)) 100%)',
      }}
    >
      <svg
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden="true"
      >
        <path d="M0 30q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M0 44q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M0 16q12.5-14 25 0t25 0 25 0 25 0 25 0 25 0 25 0" fill="none" stroke="#fff" strokeWidth="2.5" />
      </svg>
      {label && (
        <span className="relative font-display font-bold text-white/90 text-sm leading-tight">
          {article.source.name}
        </span>
      )}
    </div>
  );
}

/* Las imágenes viven en los servidores de cada medio, así que fallan por
   motivos que este sitio no controla: hotlinking bloqueado, la nota se edita y
   la foto cambia de ruta, o el CDN del medio se cae. Cuando eso pasa, un
   `<img>` roto deja un icono gris y una tarjeta mutilada, así que el error se
   captura y se cae al mismo motivo que las notas sin foto. */
function Cover({
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
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <Fallback article={article} label={label} />
      )}
    </div>
  );
}

export function ArticleCard({ article, variant = 'standard', eager = false }: Props) {
  const to = `/noticia/${article.slug}`;

  if (variant === 'compact') {
    return (
      <Link to={to} className="group flex gap-4 items-start no-underline">
        <Cover article={article} className="h-16 w-20 shrink-0 rounded-md" eager={eager} label={false} />
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="font-display font-bold text-[15px] text-foreground leading-snug m-0 line-clamp-3 group-hover:text-accent transition-colors duration-200">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SourceCredit article={article} />
            <span aria-hidden="true">·</span>
            <time dateTime={article.published_at}>{timeAgo(article.published_at)}</time>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'lead') {
    return (
      <Link
        to={to}
        className="group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 border-t-2 border-foreground/85 hover:border-accent pt-6 no-underline transition-colors duration-300"
      >
        <Cover article={article} className="h-56 md:h-full md:min-h-[22rem] rounded-xl" eager={eager} />
        <div className="flex flex-col gap-4 justify-center pb-1">
          <Kicker article={article} />
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-[2.75rem] text-foreground leading-[1.08] m-0 group-hover:text-accent transition-colors duration-200">
            {article.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed m-0 line-clamp-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border mt-2">
            <div className="flex items-center gap-2 min-w-0">
              <SourceCredit article={article} />
              <span className="text-xs text-muted-foreground" aria-hidden="true">·</span>
              <time className="text-xs text-muted-foreground shrink-0" dateTime={article.published_at}>
                {timeAgo(article.published_at)}
              </time>
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors flex items-center gap-1 shrink-0">
              Leer
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className="group flex flex-col h-full border-t-2 border-foreground/85 hover:border-accent pt-5 no-underline transition-colors duration-300"
    >
      <Cover article={article} className="h-44 rounded-lg" eager={eager} />
      <div className="pt-4 flex flex-col gap-2.5 flex-1">
        <Kicker article={article} />
        <h3 className="font-display font-bold text-xl text-foreground leading-snug m-0 line-clamp-3 group-hover:text-accent transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed m-0 line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <SourceCredit article={article} />
          <time className="text-xs text-muted-foreground shrink-0" dateTime={article.published_at}>
            {timeAgo(article.published_at)}
          </time>
        </div>
      </div>
    </Link>
  );
}
