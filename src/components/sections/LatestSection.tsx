import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Article, Category } from '../../lib/api';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton } from '../news/States';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* Fila central: la tabla de secciones a la izquierda y «Lo último» a la
   derecha.

   La tabla es el equivalente de la clasificación de la referencia: filas
   numeradas, cifras alineadas, y cada fila es un enlace a la sección. Con
   más de cinco secciones se pagina con las flechas de la cabecera; cada
   página son cinco filas para que la tabla mida siempre lo mismo. */

const ROWS = 5;

function SectionsTable({ categories }: { categories: Category[] }) {
  const [page, setPage] = useState(0);
  const withContent = categories.filter((c) => (c.article_count ?? 0) > 0);
  const pages = Math.max(1, Math.ceil(withContent.length / ROWS));
  const rows = withContent.slice(page * ROWS, page * ROWS + ROWS);
  const total = withContent.reduce((sum, c) => sum + (c.article_count ?? 0), 0);

  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground cursor-pointer hover:bg-ink hover:text-white hover:border-ink transition-colors disabled:opacity-30 disabled:pointer-events-none';

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="display text-[1.75rem] md:text-[2.125rem] text-foreground m-0">Secciones</h2>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Secciones anteriores"
              className={arrow}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page >= pages - 1}
              aria-label="Más secciones"
              className={arrow}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="rounded-[var(--radius-card)] bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 pt-5 pb-3">
          <p className="font-bold text-lg text-foreground m-0">Por sección</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground m-0 tabular-nums">
            Notas · {total}
          </p>
        </div>
        <ul className="list-none m-0 p-0">
          {rows.map((category, i) => {
            const index = page * ROWS + i + 1;
            const share = total ? Math.round(((category.article_count ?? 0) / total) * 100) : 0;
            return (
              <li key={category.slug} className={i % 2 === 0 ? 'bg-background/60' : ''}>
                <Link
                  to={`/seccion/${category.slug}`}
                  className="group grid grid-cols-[2rem_1fr_auto_1.5rem] items-center gap-3 px-5 md:px-6 h-14 no-underline text-foreground hover:bg-accent/[0.07] transition-colors"
                >
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">{index}</span>
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-[15px] truncate">{category.name}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className="hidden sm:block h-1.5 w-20 rounded-full bg-muted overflow-hidden"
                      aria-hidden="true"
                    >
                      <span className="block h-full rounded-full bg-ink" style={{ width: `${share}%` }} />
                    </span>
                    <span className="text-sm font-semibold tabular-nums w-8 text-right">
                      {category.article_count}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="px-6 py-10 text-sm text-muted-foreground text-center">Sin secciones todavía.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function LatestSection({
  articles,
  loading,
  categories,
}: {
  articles: Article[];
  loading: boolean;
  categories: Category[];
}) {
  return (
    <section className="px-4 md:px-6 pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-14">
        <Reveal>
          <SectionsTable categories={categories} />
        </Reveal>

        <Reveal delay={0.08}>
          <SectionHeader to="/noticias" className="mb-8">
            Lo último
          </SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} variant="compact" />)
              : articles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
