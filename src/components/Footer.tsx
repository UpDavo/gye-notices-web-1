import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useCategories } from '../hooks/useNews';

const YEAR = new Date().getFullYear();

/* El pie: navegación y poco más.

   Antes cargaba con la declaración de origen entera —la lista de medios, el
   aviso de agregador— y ocupaba pantalla y media. Eso ya lo dice cada nota, en
   su propio crédito y con el enlace al medio, que es donde el lector lo mira.
   Repetirlo aquí no informaba a nadie: solo alargaba la página.

   Queda el bloque oscuro con el halo de marca, dos columnas de enlaces y la
   línea legal. */

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 m-0 mb-5">{children}</p>
  );
}

const linkClass = 'text-base text-white/85 hover:text-white no-underline transition-colors';

export function Footer() {
  const { data: categories } = useCategories();

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="relative overflow-hidden bg-[hsl(213_44%_8%)] text-white rounded-t-[2.5rem] md:rounded-t-[3rem] mt-24">
      {/* Halo de marca, con fundido superior para que no haya corte duro */}
      <div
        className="absolute inset-x-0 top-0 h-[80%] pointer-events-none"
        style={{
          background:
            'radial-gradient(130% 110% at 50% 8%, hsl(199 95% 55% / 0.30) 0%, hsl(200 98% 39% / 0.14) 42%, transparent 76%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative px-6 md:px-12 lg:px-20 pt-16 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            <div className="max-w-sm">
              <img
                src="/img/logo-white.svg"
                alt="Noticias Guayaquil"
                className="h-9 w-auto max-w-[190px] select-none mb-4"
              />
              <p className="text-base text-white/50 leading-relaxed m-0">
                Lo que publican los medios de la ciudad, con el crédito y el enlace al
                original en cada nota.
              </p>
            </div>

            <div className="flex gap-12 sm:gap-16">
              <div>
                <ColumnTitle>Secciones</ColumnTitle>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                  {(categories ?? []).slice(0, 5).map((category) => (
                    <li key={category.slug}>
                      <Link to={`/seccion/${category.slug}`} className={linkClass}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <ColumnTitle>Sitio</ColumnTitle>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                  <li><Link to="/noticias" className={linkClass}>Todas las notas</Link></li>
                  <li><Link to="/privacidad" className={linkClass}>Privacidad</Link></li>
                  <li><Link to="/terminos" className={linkClass}>Términos</Link></li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollTop}
              aria-label="Volver arriba"
              className="hidden md:inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-[hsl(213_44%_8%)] hover:border-white text-white transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-14 pt-6 border-t border-white/10 text-[11px] uppercase tracking-[0.14em] text-white/45">
            <p className="m-0">© {YEAR} Noticias Guayaquil</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
