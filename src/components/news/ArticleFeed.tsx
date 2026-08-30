import { ArticleCard } from './ArticleCard';
import { Pagination } from './Pagination';
import { EmptyState, ErrorState, GridSkeleton } from './States';
import { Reveal } from '../ui/ScrollMotion';
import type { Article, Paginated } from '../../lib/api';

/* Rejilla paginada de notas.

   La usan por igual /noticias, /seccion/:slug y la búsqueda; los tres tienen
   exactamente la misma lista con distintos filtros, así que la lista vive en
   un solo sitio. */

type Props = {
  data: Paginated<Article> | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptyMessage?: string;
};

export function ArticleFeed({
  data,
  loading,
  error,
  onRetry,
  onPageChange,
  emptyTitle,
  emptyMessage,
}: Props) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading) return <GridSkeleton count={6} />;

  const articles = data?.results ?? [];
  if (articles.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <Reveal key={article.slug} y={24} delay={Math.min(i, 5) * 0.06}>
            <ArticleCard article={article} eager={i < 3} />
          </Reveal>
        ))}
      </div>

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.total_pages ?? 1}
        onChange={onPageChange}
      />
    </>
  );
}
