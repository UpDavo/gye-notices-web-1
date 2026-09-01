import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Mail } from 'lucide-react';
import { environment } from '../environments/environment';
import { useCategories } from '../hooks/useNews';

/* El pie: bloque de tinta, como el hero.

   Arriba, la frase grande y el contacto: no hay boletín ni formulario —no
   existe backend que reciba envíos— así que el sitio del «suscríbete» de la
   referencia lo ocupa el correo, que es el único canal real. Debajo, la marca
   con su línea, las columnas de secciones y sitio, y la línea legal. Cierra
   la palabra gigante recortada, que es textura y no rótulo. */

const YEAR = new Date().getFullYear();

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold text-white m-0 mb-4">{children}</p>;
}

const linkClass = 'text-[13px] text-white/60 hover:text-white no-underline transition-colors';

export function Footer() {
  const { data: categories } = useCategories();

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="relative overflow-hidden bg-ink text-white mt-24 md:mt-32">
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-8 pt-16 md:pt-20">
        {/* Frase y contacto */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <h2 className="display text-[2.75rem] md:text-6xl lg:text-7xl text-white m-0 max-w-xl">
            La ciudad, <span className="text-accent-bright">hoy.</span>
          </h2>

          <div className="md:max-w-sm w-full">
            <p className="text-[13px] text-white/70 m-0 mb-3">Escríbenos</p>
            <a
              href={`mailto:${environment.contactEmail}`}
              className="group flex items-center gap-3 rounded-full border border-white/25 bg-white/5 hover:bg-white hover:text-ink pl-5 pr-1.5 h-13 no-underline text-white transition-colors"
            >
              <Mail size={16} aria-hidden="true" className="shrink-0 opacity-70" />
              <span className="text-sm font-medium flex-1 truncate">{environment.contactEmail}</span>
              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-ink group-hover:bg-ink group-hover:text-white transition-colors">
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-14">
          <div>
            <Link
              to="/"
              className="display uppercase tracking-[0.1em] text-xl leading-none no-underline text-white"
              aria-label="Guayas Hoy — portada"
            >
              Guayas<span className="text-accent-bright">Hoy</span>
            </Link>
            <p className="text-[13px] text-white/60 leading-relaxed m-0 mt-4 max-w-xs">
              Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en un
              solo lugar y enlazadas siempre al original.
            </p>
          </div>

          <div>
            <ColumnTitle>Secciones</ColumnTitle>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {(categories ?? []).slice(0, 6).map((category) => (
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
              <li><Link to="/noticias" className={linkClass}>Todas las noticias</Link></li>
              <li><Link to="/medios" className={linkClass}>Medios y reglas</Link></li>
              <li><Link to="/privacidad" className={linkClass}>Privacidad</Link></li>
              <li><Link to="/terminos" className={linkClass}>Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex items-center justify-between gap-6 text-[12px] text-white/50">
          <p className="m-0">© {YEAR} Guayas Hoy · Todos los derechos de las notas son de cada medio.</p>
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Volver arriba"
            className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-white/20 bg-transparent hover:bg-white hover:text-ink text-white transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Palabra gigante recortada por abajo */}
      <div className="relative mt-6 h-[0.55em] overflow-hidden giant-word text-center" aria-hidden="true">
        GUAYASHOY
      </div>
    </footer>
  );
}
