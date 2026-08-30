import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useCategories } from '../hooks/useNews';

/* Píldora flotante de vidrio, la receta canónica del sistema.

   El ingrediente que la hace vidrio y no niebla es `saturate(1.6)`. Sobre el
   hero (imagen oscura) el texto va en blanco; en cuanto la barra se vuelve
   sólida pasa a seguir los tokens del tema activo. */

const POLICY_ROUTES = ['/privacidad', '/terminos'];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  /* El menú se guarda como «abierto en esta ruta» en vez de como un booleano:
     así navegar a otra página lo cierra por sí solo, sin un efecto que
     reaccione al cambio de ruta. */
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === location.pathname;
  /* El valor inicial se lee al montar y no dentro del efecto: al entrar a una
     página ya desplazada (una recarga a media página) la barra debe nacer
     sólida, sin un parpadeo transparente en el primer pintado. */
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 20 : false,
  );
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { data: categories } = useCategories();

  const isLegalPage = POLICY_ROUTES.includes(location.pathname);

  /* La píldora va SIEMPRE sólida.
     Antes tenía un segundo estado translúcido con texto blanco, para cuando
     flotaba sobre el hero de video oscuro. Ese hero ya no existe: ahora
     encabeza banners que pueden ser claros, o nada. Mantener el estado
     transparente dejaría texto blanco sobre fondo blanco. Lo que sí cambia con
     el scroll es la sombra, que es lo que la despega del contenido. */
  const linkClass = 'text-foreground/70 hover:text-foreground';
  const iconClass = 'text-foreground hover:bg-foreground/10';
  const logoSrc = theme === 'light' ? '/img/logo.svg' : '/img/logo-white.svg';

  /* Las cinco primeras secciones caben en la barra; el resto vive en el menú
     móvil y en el pie. Una barra de navegación con nueve enlaces no la lee
     nadie. */
  const navSections = (categories ?? []).filter((c) => c.show_in_nav).slice(0, 5);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    setMenuOpenAt(null);
    setSearch('');
    navigate(`/noticias?q=${encodeURIComponent(term)}`);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-body px-4 md:px-6 pt-4">
      <div
        className={`max-w-6xl mx-auto rounded-[1.75rem] border border-border bg-surface/85 transition-shadow duration-300 overflow-hidden ${
          scrolled || menuOpen ? 'shadow-[0_8px_40px_-12px_rgba(15,23,42,0.18)]' : 'shadow-none'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
        }}
      >
        <div className="flex items-center justify-between pl-4 pr-2.5 md:pl-6 md:pr-3 py-2.5 gap-4">
          <Link to="/" className="flex items-center no-underline shrink-0">
            <img src={logoSrc} alt="Guayas Hoy" className="h-9 md:h-10 w-auto select-none" />
          </Link>

          <ul className="hidden lg:flex items-center gap-6 list-none m-0 p-0">
            {navSections.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/seccion/${category.slug}`}
                  className={`text-sm ${linkClass} transition-colors duration-150 no-underline`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <form onSubmit={submitSearch} className="hidden md:flex items-center" role="search">
              <label htmlFor="nav-search" className="sr-only">
                Buscar noticias
              </label>
              <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
                <Search size={15} className="text-muted-foreground" aria-hidden="true" />
                <input
                  id="nav-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar"
                  className="bg-transparent border-0 outline-none text-sm w-24 lg:w-32 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className={`flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-0 cursor-pointer transition-colors ${iconClass}`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/noticias"
              className="hidden md:inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity duration-150 no-underline"
            >
              Ver todo
            </Link>

            {!isLegalPage && (
              <button
                type="button"
                className={`lg:hidden flex items-center justify-center p-2 rounded-full transition-colors bg-transparent border-0 cursor-pointer ${iconClass}`}
                onClick={() => setMenuOpenAt(menuOpen ? null : location.pathname)}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.21, 0.65, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-border px-6 pb-5 pt-4 flex flex-col gap-4">
                <form onSubmit={submitSearch} className="flex items-center gap-2" role="search">
                  <label htmlFor="nav-search-mobile" className="sr-only">
                    Buscar noticias
                  </label>
                  <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 w-full">
                    <Search size={15} className="text-muted-foreground" aria-hidden="true" />
                    <input
                      id="nav-search-mobile"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar noticias"
                      className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </form>

                {(categories ?? []).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/seccion/${category.slug}`}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-150 no-underline"
                  >
                    {category.name}
                  </Link>
                ))}

                <Link
                  to="/noticias"
                  className="mt-1 self-start rounded-full px-5 py-2 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity duration-150 no-underline"
                >
                  Ver todo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
