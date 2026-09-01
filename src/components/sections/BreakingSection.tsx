import type { Article } from '../../lib/api';
import { ArticleCard } from '../news/ArticleCard';
import { CardSkeleton } from '../news/States';
import { Reveal, SectionHeader } from '../ui/ScrollMotion';

/* Última hora: cuatro piezas en fila, justo debajo del hero. */

export function BreakingSection({ articles, loading }: { articles: Article[]; loading: boolean }) {
  if (!loading && articles.length === 0) return null;

  return (
    <section id="ultima-hora" className="px-4 md:px-6 pt-16 md:pt-20 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader to="/noticias" className="mb-8">
          Última hora
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
            : articles.slice(0, 4).map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.06}>
                  <ArticleCard article={article} eager={i < 2} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
