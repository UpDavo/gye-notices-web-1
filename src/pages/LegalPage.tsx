import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

/* Marco compartido por las dos páginas legales: mismo ritmo tipográfico, un
   solo sitio donde tocarlo. */

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

      <main className="flex-1 pt-32 md:pt-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto pb-8">
          <header className="mb-12">
            <p className="kicker flex items-center gap-3 m-0 mb-4">
              <span className="h-[2px] w-8 bg-accent" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-[1.05] m-0 mb-4">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground m-0 mb-6">Última actualización: {updated}</p>
            <p className="text-lg text-foreground/85 leading-relaxed border-l-2 border-accent pl-6 m-0">
              {intro}
            </p>
          </header>

          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display font-bold text-xl md:text-2xl text-foreground m-0 mb-3">
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
