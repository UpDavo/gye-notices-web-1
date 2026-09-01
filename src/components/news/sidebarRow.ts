/* La fila de la columna de secciones, al modo de una faceta de tienda.

   La comparten la columna con URL (`CategorySidebar`, en /noticias y
   /seccion/:slug) y la columna de filtro de la portada (`NewsFeedSection`):
   mismo aspecto, distinto elemento — enlace allí, botón aquí. La activa se
   posa sobre la superficie gris y engorda; el resto va en gris de texto. */
export const sidebarRowClass = (isActive: boolean) =>
  `group flex items-center justify-between gap-3 w-full text-left rounded-lg px-3 h-10 text-[14px] no-underline border-0 bg-transparent cursor-pointer transition-colors duration-150 ${
    isActive
      ? 'bg-surface text-foreground font-semibold'
      : 'text-muted-foreground font-medium hover:bg-surface hover:text-foreground'
  }`;

/* El número de notas: dato al margen, nunca una insignia. */
export const sidebarCountClass = 'text-[12px] text-muted-foreground tabular-nums shrink-0';
