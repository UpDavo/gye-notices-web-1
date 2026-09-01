import { Link } from 'react-router-dom';
import type { Article } from '../../lib/api';
import { timeAgo } from '../../lib/format';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* En breve: las notas que llegaron sin foto.

   No es una sección de segunda: es el sitio donde una nota sin material
   gráfico se lee bien. Puesta en la rejilla de tarjetas dejaría un hueco
   donde las de al lado tienen imagen; aquí, en columnas de titulares, el
   texto es lo único que hay y no le falta nada.

   Va en columnas y no en tarjetas a propósito. Sin foto que fije la altura,
   las cajas quedarían de tamaños distintos y la fila se desalinearía sola;
   una lista de titulares separados por filete no tiene ese problema y cabe
   el triple de notas en el mismo alto.

   El orden es el que trae el backend, `-published_at`: lo más reciente
   arriba, igual que en el resto de la portada. */

export function BriefsSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section id="en-breve" className="px-4 md:px-6 pt-16 md:pt-20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader to="/noticias" className="mb-8">
          En breve
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
          {articles.map((article, i) => (
            <Reveal key={article.slug} delay={Math.min(i, 5) * 0.04}>
              <Link
                to={`/noticia/${article.slug}`}
                className="group flex flex-col gap-1.5 no-underline border-t border-border py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="tag-dot truncate">
                    {article.category?.name ?? article.source.name}
                  </span>
                  <time
                    dateTime={article.published_at}
                    className="text-[11px] text-muted-foreground shrink-0"
                  >
                    {timeAgo(article.published_at)}
                  </time>
                </div>
                <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[-0.01em] m-0 line-clamp-3 group-hover:text-accent transition-colors duration-150">
                  {article.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
