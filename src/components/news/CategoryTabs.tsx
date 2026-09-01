import { NavLink } from 'react-router-dom';
import type { Category } from '../../lib/api';
import { pillTabClass } from './pillTab';

/* Barra de secciones en píldoras.

   Son `NavLink` y no botones: cada sección es una URL propia, que se puede
   compartir, marcar e indexar. En móvil la barra se desplaza de lado. */

type Props = {
  categories: Category[];
  /* `all` es el destino de la pestaña «Todas». */
  allTo?: string;
  className?: string;
};

export function CategoryTabs({ categories, allTo = '/noticias', className = '' }: Props) {
  return (
    <nav aria-label="Secciones" className={`w-full ${className}`}>
      <ul className="flex gap-2 list-none m-0 p-0 overflow-x-auto no-scrollbar pb-1">
        <li>
          <NavLink to={allTo} end className={({ isActive }) => pillTabClass(isActive)}>
            Todas
          </NavLink>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <NavLink to={`/seccion/${category.slug}`} className={({ isActive }) => pillTabClass(isActive)}>
              {category.name}
              {typeof category.article_count === 'number' && category.article_count > 0 && (
                <span className="text-[11px] opacity-60 tabular-nums">{category.article_count}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
