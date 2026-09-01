import type { Article } from '../../lib/api';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton } from '../news/States';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* Tendencias: la tarjeta gris con tres piezas a la izquierda y una foto
   grande con el titular encima a la derecha. `feature` es la pieza de la
   foto; `items` las tres de la lista. */

export function TrendingSection({
  items,
  feature,
  loading,
}: {
  items: Article[];
  feature: Article | undefined;
  loading: boolean;
}) {
  if (!loading && items.length === 0 && !feature) return null;

  return (
    <section className="px-4 md:px-6 pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8">
        <Reveal>
          <div className="rounded-[var(--radius-card-lg)] bg-surface p-6 md:p-7 h-full">
            <SectionHeader as="h3" size="md" className="mb-6">
              Tendencias
            </SectionHeader>
            <div className="flex flex-col divide-y divide-border">
              {loading
                ? Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="py-4 first:pt-0 last:pb-0">
                      <CardSkeleton variant="media" />
                    </div>
                  ))
                : items.slice(0, 3).map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      variant="media"
                      className="py-4 first:pt-0 last:pb-0"
                    />
                  ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          {loading || !feature ? (
            <CardSkeleton variant="overlay" />
          ) : (
            <ArticleCard article={feature} variant="overlay" className="h-full" />
          )}
        </Reveal>
      </div>
    </section>
  );
}
