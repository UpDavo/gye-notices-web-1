/* La píldora de sección, compartida por las pestañas con URL (`CategoryTabs`)
   y los botones de filtro de la portada (`NewsFeedSection`): mismo aspecto,
   distinto elemento. La activa se rellena de tinta; el resto va sobre la
   superficie gris. */
export const pillTabClass = (isActive: boolean) =>
  `shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 h-10 text-[13px] font-semibold no-underline border cursor-pointer transition-colors duration-150 whitespace-nowrap ${
    isActive
      ? 'bg-ink text-ink-foreground border-ink'
      : 'bg-surface border-transparent text-foreground/80 hover:bg-muted hover:text-foreground'
  }`;
