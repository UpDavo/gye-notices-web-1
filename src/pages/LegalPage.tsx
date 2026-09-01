import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

/* Marco compartido por las dos páginas legales: mismo ritmo tipográfico, un
   solo sitio donde tocarlo. Cabecera ancha con el titular grande y la fecha,
   y el texto en medida de lectura con los apartados numerados a la
   izquierda. */

type Section = { title: string; body: ReactNode };

type Props = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  path: string;
  seoTitle: string;
  seoDescription: string;
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
  path,
  seoTitle,
  seoDescription,
}: Props) {
  usePageSeo({ title: seoTitle, description: seoDescription, path });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 pt-10 md:pt-14 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <header className="max-w-3xl mb-12 md:mb-16">
            <p className="kicker m-0 mb-3">{eyebrow}</p>
            <h1 className="display text-4xl md:text-6xl text-foreground m-0 mb-4">{title}</h1>
            <p className="text-sm text-muted-foreground m-0 mb-8">Última actualización: {updated}</p>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed m-0">{intro}</p>
          </header>

          <div className="max-w-3xl flex flex-col divide-y divide-border">
            {sections.map((section) => (
              <section key={section.title} className="py-8 first:pt-0">
                <h2 className="font-bold text-lg md:text-xl text-foreground tracking-[-0.01em] m-0 mb-3">
                  {section.title}
                </h2>
                <div className="text-base text-muted-foreground leading-relaxed flex flex-col gap-3">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
