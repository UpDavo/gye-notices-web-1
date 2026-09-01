import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useCategories } from '../hooks/useNews';

/* Cabecera: barra blanca pegajosa con la marca centrada.

   Tres zonas: a la izquierda el menú (móvil) o las secciones (escritorio); en
   el centro el wordmark en versalitas gruesas; a la derecha la búsqueda y el
   tema. La barra es `sticky` y no `fixed`: ocupa su sitio en el flujo y las
   páginas no tienen que reservar un hueco a mano. */

const POLICY_ROUTES = ['/privacidad', '/terminos'];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  /* El menú se guarda como «abierto en esta ruta» en vez de como un booleano:
     así navegar a otra página lo cierra por sí solo. */
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === location.pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 8 : false,
  );
  const { theme, toggleTheme } = useTheme();
  const { data: categories } = useCategories();

  const isLegalPage = POLICY_ROUTES.includes(location.pathname);

  /* Las cinco primeras secciones caben en la barra; el resto vive en el menú
     y en el pie. */
  const navSections = (categories ?? []).filter((c) => c.show_in_nav).slice(0, 5);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    setMenuOpenAt(null);
    setSearchOpen(false);
    setSearch('');
    navigate(`/noticias?q=${encodeURIComponent(term)}`);
  }

  const iconButton =
    'flex items-center justify-center w-11 h-11 rounded-full bg-transparent border-0 cursor-pointer text-foreground hover:bg-surface transition-colors';

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] font-semibold no-underline transition-colors duration-150 ${
      isActive ? 'text-accent' : 'text-foreground/70 hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 font-body">
      <div
        className={`bg-background/92 border-b transition-[box-shadow,border-color] duration-300 ${
          scrolled || menuOpen
            ? 'border-border shadow-[0_10px_40px_-18px_rgba(6,40,61,0.25)]'
            : 'border-transparent'
        }`}
        style={{
          backdropFilter: 'blur(16px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
        }}
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center h-16 px-4 md:px-6 gap-4">
          {/* Izquierda */}
          <div className="flex items-center gap-1">
            {!isLegalPage && (
              <button
                type="button"
                className={`lg:hidden ${iconButton} -ml-2`}
                onClick={() => setMenuOpenAt(menuOpen ? null : location.pathname)}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
            <ul className="hidden lg:flex items-center gap-6 list-none m-0 p-0">
              {navSections.map((category) => (
                <li key={category.slug}>
                  <NavLink to={`/seccion/${category.slug}`} className={navLink}>
                    {category.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Centro: el wordmark. Tipográfico: hereda el color del tema y no
              hay dos versiones que mantener. */}
          <Link
            to="/"
            className="display uppercase tracking-[0.1em] text-[1.05rem] md:text-xl leading-none no-underline text-foreground whitespace-nowrap"
            aria-label="Guayas Hoy — portada"
          >
            Guayas<span className="text-accent">Hoy</span>
          </Link>

          {/* Derecha */}
          <div className="flex items-center justify-end gap-1">
            <form
              onSubmit={submitSearch}
              role="search"
              className="hidden md:flex items-center"
            >
              <label htmlFor="nav-search" className="sr-only">
                Buscar noticias
              </label>
              <div
                className={`flex items-center overflow-hidden rounded-full bg-surface transition-[width,opacity] duration-300 ${
                  searchOpen ? 'w-56 opacity-100 mr-1' : 'w-0 opacity-0'
                }`}
              >
                <input
                  ref={searchRef}
                  id="nav-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => {
                    if (!search) setSearchOpen(false);
                  }}
                  placeholder="Buscar noticias"
                  tabIndex={searchOpen ? 0 : -1}
                  className="bg-transparent border-0 outline-none text-sm h-10 px-4 w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                type={searchOpen && search ? 'submit' : 'button'}
                onClick={() => {
                  if (!searchOpen) setSearchOpen(true);
                }}
                aria-label="Buscar"
                className={iconButton}
              >
                <Search size={20} />
              </button>
            </form>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className={`${iconButton} -mr-2 md:mr-0`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.21, 0.65, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-border px-4 md:px-6 pb-6 pt-4 flex flex-col gap-5">
                <form onSubmit={submitSearch} role="search">
                  <label htmlFor="nav-search-mobile" className="sr-only">
                    Buscar noticias
                  </label>
                  <div className="flex items-center gap-2 rounded-full bg-surface pl-4 pr-1.5 h-12 w-full">
                    <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                    <input
                      id="nav-search-mobile"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar noticias"
                      className="bg-transparent border-0 outline-none text-base w-full text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="submit" className="pill pill-ink !py-2.5 !px-4 text-[13px]">
                      Buscar
                    </button>
                  </div>
                </form>

                <nav aria-label="Secciones" className="grid grid-cols-2 gap-x-6">
                  {(categories ?? []).map((category) => (
                    <NavLink
                      key={category.slug}
                      to={`/seccion/${category.slug}`}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-3 border-b border-border text-[15px] font-semibold no-underline ${
                          isActive ? 'text-accent' : 'text-foreground'
                        }`
                      }
                    >
                      {category.name}
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {category.article_count ?? ''}
                      </span>
                    </NavLink>
                  ))}
                </nav>

                <div className="flex flex-wrap gap-3">
                  <Link to="/noticias" className="pill pill-ink">
                    Todas las noticias
                  </Link>
                  <Link to="/medios" className="pill pill-ghost">
                    Medios
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
