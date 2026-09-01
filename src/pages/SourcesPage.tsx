import { ArrowUpRight, Mail } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSources } from '../hooks/useNews';
import { usePageSeo } from '../hooks/usePageSeo';
import { environment } from '../environments/environment';

/* La página donde el proyecto explica su trato con los medios.

   Está enlazada desde el pie a propósito: si el sitio vive de contenido
   ajeno, las reglas con las que lo usa tienen que ser fáciles de encontrar,
   no letra chica. */

const RULES = [
  {
    title: 'Solo titular y extracto',
    body: 'Guardamos el titular, un extracto de unas pocas líneas y la imagen de portada que el propio medio publica en su feed. Nunca el cuerpo del artículo.',
  },
  {
    title: 'El enlace al original, siempre',
    body: 'Cada nota lleva el nombre del medio y un enlace directo a su página. El lector que quiere leer completo termina en el sitio del medio, que es donde debe estar.',
  },
  {
    title: 'Feeds antes que scraping',
    body: 'Preferimos el RSS que cada medio publica para ser sindicado. Solo leemos HTML cuando no hay feed, y siempre respetando lo que diga su robots.txt.',
  },
  {
    title: 'Ritmo y presentación',
    body: 'Espaciamos las peticiones y respetamos el Crawl-delay que declare cada sitio. Nos identificamos con un User-Agent propio y un contacto, nunca disfrazados de navegador.',
  },
  {
    title: 'Salir es inmediato',
    body: 'Si un medio pide no aparecer, lo retiramos el mismo día y sin condiciones. También ajustamos la frecuencia si el ritmo actual le resulta alto.',
  },
];

export function SourcesPage() {
  const { data: sources } = useSources();

  usePageSeo({
    title: 'Medios y cómo trabajamos — Guayas Hoy',
    description:
      'De qué medios sale el contenido de Guayas Hoy y con qué reglas se agrega: solo titular y extracto, enlace al original y salida inmediata a petición.',
    path: '/medios',
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />

      <main className="flex-1 pt-10 md:pt-14 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <header className="max-w-3xl mb-14">
            <p className="kicker m-0 mb-3">Fuentes</p>
            <h1 className="display text-4xl md:text-6xl text-foreground m-0 mb-5">
              De dónde sale todo esto.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed m-0">
              Guayas Hoy no produce noticias. Reúne lo que publican los medios de la ciudad y
              del país, y manda al lector de vuelta a ellos.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="display text-2xl md:text-3xl text-foreground m-0 mb-6">Medios que agregamos</h2>
            <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(sources ?? []).map((source) => (
                <li key={source.slug}>
                  <a
                    href={source.homepage_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] bg-surface px-6 py-5 no-underline hover:bg-ink hover:text-white transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-base text-foreground group-hover:text-white m-0 truncate transition-colors">
                        {source.name}
                      </p>
                      <p className="text-sm text-muted-foreground group-hover:text-white/70 m-0 truncate transition-colors">
                        {source.domain}
                      </p>
                    </div>
                    <span className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-background text-foreground group-hover:bg-white group-hover:text-ink transition-colors">
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-16 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-14">
            <div>
              <h2 className="display text-2xl md:text-3xl text-foreground m-0 mb-4">Las reglas</h2>
              <p className="text-muted-foreground leading-relaxed m-0 max-w-sm">
                Cinco reglas fijas. No hay excepciones por medio ni por sección.
              </p>
            </div>
            <ol className="list-none m-0 p-0 flex flex-col divide-y divide-border">
              {RULES.map((rule, i) => (
                <li key={rule.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6 first:pt-0">
                  <span className="display text-3xl text-accent tabular-nums leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-foreground m-0 mb-2">{rule.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed m-0">{rule.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Único canal de contacto del sitio: un `mailto:` y nada más. */}
          <section className="relative overflow-hidden rounded-[var(--radius-card-lg)] bg-ink text-white p-8 md:p-12">
            <div
              className="absolute -right-20 -top-20 h-80 w-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(var(--accent-bright) / 0.35), transparent 65%)' }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="display text-3xl md:text-5xl text-white m-0 mb-4">¿Eres de un medio?</h2>
                <p className="text-white/75 leading-relaxed m-0">
                  Escríbenos si quieres que dejemos de mostrar tu contenido, si prefieres otra
                  frecuencia, o si quieres que tu medio aparezca aquí.
                </p>
              </div>
              <a href={`mailto:${environment.contactEmail}`} className="pill pill-light shrink-0">
                <Mail size={16} aria-hidden="true" />
                {environment.contactEmail}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
