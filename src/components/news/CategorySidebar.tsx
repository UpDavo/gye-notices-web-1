import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { Category } from '../../lib/api';
import { sidebarCountClass, sidebarRowClass } from './sidebarRow';

/* Columna de secciones, al modo de un filtro de tienda.

   Sustituye a la fila de píldoras: una lista vertical se lee de un vistazo,
   no se corta en el borde de la pantalla y deja el número de notas alineado
   a la derecha, como una faceta de catálogo. Siguen siendo `NavLink`: cada
   sección es una URL propia, compartible e indexable.

   En móvil no hay sitio para una columna, así que la lista se pliega detrás
   de un botón que muestra la sección activa. */

type Props = {
  categories: Category[];
  /* Destino de «Todas»: la portada del archivo. */
  allTo?: string;
  /* Slug activo, si la página es una sección. Sirve para el rótulo del
     botón plegable en móvil. */
  activeSlug?: string;
  className?: string;
};

function CategoryList({
  categories,
  allTo,
  onNavigate,
}: {
  categories: Category[];
  allTo: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
      <li>
        <NavLink to={allTo} end onClick={onNavigate} className={({ isActive }) => sidebarRowClass(isActive)}>
          <span>Todas</span>
        </NavLink>
      </li>
      {categories.map((category) => (
        <li key={category.slug}>
          <NavLink
            to={`/seccion/${category.slug}`}
            onClick={onNavigate}
            className={({ isActive }) => sidebarRowClass(isActive)}
          >
            <span className="truncate">{category.name}</span>
            {typeof category.article_count === 'number' && category.article_count > 0 && (
              <span className={sidebarCountClass}>{category.article_count}</span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function CategorySidebar({
  categories,
  allTo = '/noticias',
  activeSlug,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const activeName = categories.find((c) => c.slug === activeSlug)?.name ?? 'Todas';

  return (
    <div className={className}>
      {/* Móvil: la lista se pliega y el botón dice dónde estás. */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center justify-between w-full h-12 px-4 rounded-xl bg-surface border-0 text-foreground text-[14px] font-semibold cursor-pointer"
        >
          <span>
            Secciones
            <span className="text-muted-foreground font-medium"> · {activeName}</span>
          </span>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <nav aria-label="Secciones" className="mt-2">
            <CategoryList categories={categories} allTo={allTo} onNavigate={() => setOpen(false)} />
          </nav>
        )}
      </div>

      {/* Escritorio: columna fija que acompaña al scroll de la rejilla. */}
      <nav aria-label="Secciones" className="hidden md:block sticky top-24">
        <p className="kicker m-0 mb-3 px-3">Secciones</p>
        <CategoryList categories={categories} allTo={allTo} />
      </nav>
    </div>
  );
}
