import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Search, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

/* Cabecera: barra blanca pegajosa, marca a la izquierda y búsqueda a la
   derecha. Nada más.

   Las secciones salieron de aquí: ahora viven en la columna de filtro de la
   portada y de `/noticias`, que es donde el lector las busca, y en el pie
   como enlaces permanentes. Una cabecera con menos cosas hace que el único
   control que queda —la búsqueda— se vea.

   La barra es `sticky` y no `fixed`: ocupa su sitio en el flujo y las
   páginas no tienen que reservar un hueco a mano. */

export function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  /* En móvil no cabe el campo, así que la lupa despliega una fila debajo. */
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 8 : false,
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) mobileSearchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    setSearchOpen(false);
    setSearch('');
    navigate(`/noticias?q=${encodeURIComponent(term)}`);
  }

  const iconButton =
    'flex items-center justify-center w-11 h-11 rounded-full bg-transparent border-0 cursor-pointer text-foreground hover:bg-surface transition-colors';

  return (
    <header className="sticky top-0 z-50 font-body">
      <div
        className={`bg-background/92 border-b transition-[box-shadow,border-color] duration-300 ${
          scrolled || searchOpen
            ? 'border-border shadow-[0_10px_40px_-18px_rgba(6,40,61,0.25)]'
            : 'border-transparent'
        }`}
        style={{
          backdropFilter: 'blur(16px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-4 md:px-6 gap-4">
          {/* El wordmark, tipográfico: hereda el color del tema y no hay dos
              versiones que mantener. */}
          <Link
            to="/"
            className="display uppercase tracking-[0.1em] text-[1.05rem] md:text-xl leading-none no-underline text-foreground whitespace-nowrap"
            aria-label="Guayas Hoy — portada"
          >
            Guayas<span className="text-accent">Hoy</span>
          </Link>

          <div className="flex items-center gap-1">
            {/* Escritorio: el campo está siempre abierto; es lo único que
                hay que hacer en esta barra. */}
            <form onSubmit={submitSearch} role="search" className="hidden md:flex items-center">
              <label htmlFor="nav-search" className="sr-only">
                Buscar noticias
              </label>
              <div className="flex items-center gap-2 rounded-full bg-surface pl-4 pr-2 h-10 w-64 focus-within:ring-2 focus-within:ring-accent/40 transition-shadow">
                <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                <input
                  id="nav-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar noticias"
                  className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>

            {/* Móvil: la lupa despliega la fila de búsqueda. */}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar'}
              aria-expanded={searchOpen}
              className={`md:hidden ${iconButton}`}
            >
              <Search size={20} />
            </button>

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
          {searchOpen && (
            <motion.div
              key="mobile-search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.21, 0.65, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <form onSubmit={submitSearch} role="search" className="border-t border-border px-4 py-4">
                <label htmlFor="nav-search-mobile" className="sr-only">
                  Buscar noticias
                </label>
                <div className="flex items-center gap-2 rounded-full bg-surface pl-4 pr-1.5 h-12 w-full">
                  <Search size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                  <input
                    ref={mobileSearchRef}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
