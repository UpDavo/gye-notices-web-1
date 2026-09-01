import { Link } from 'react-router-dom';
import { useLatest } from '../../hooks/useNews';

/* Cintillo de titulares.

   Requisitos de la banda deslizante del sistema: lista DUPLICADA (el -50% de
   la animación depende de ello), la copia con `aria-hidden` para que un lector
   de pantalla no lea todo dos veces, y máscara de fundido en los bordes para
   que no haya corte duro. */

export function TickerSection() {
  const { data } = useLatest(12);
  const articles = data?.results ?? [];

  if (articles.length < 4) return null;

  const items = articles.map((article) => (
    <Link
      key={article.slug}
      to={`/noticia/${article.slug}`}
      className="flex items-center gap-3 px-6 py-3 text-sm text-foreground/80 hover:text-accent no-underline transition-colors whitespace-nowrap"
    >
      {/* Viñeta cuadrada: el vocabulario editorial es de filetes y cuadrados,
          no de puntos redondos. */}
      <span className="h-1.5 w-1.5 bg-accent shrink-0" aria-hidden="true" />
      <span className="max-w-[26rem] truncate">{article.title}</span>
      <span className="text-xs text-muted-foreground">· {article.source.name}</span>
    </Link>
  ));

  return (
    <section
      aria-label="Últimos titulares"
      className="relative border-y border-border bg-surface overflow-hidden"
    >
      <div className="flex items-center">
        <p className="hidden md:flex items-center shrink-0 bg-accent text-white text-[11px] font-bold uppercase tracking-[0.2em] px-5 self-stretch m-0">
          Último
        </p>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          }}
        >
          <div className="ticker-track">
            <div className="flex">{items}</div>
            <div className="flex" aria-hidden="true">
              {items}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
