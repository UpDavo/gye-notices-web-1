# Guayas Hoy — Sistema de Diseño

**Edición deportiva en blanco y azul noche.** Una sola familia (Inter) en
negrita apretada, tarjetas sin borde donde la foto redondeada manda, un
bloque de tinta para el hero, la salida al medio y el pie, y píldoras para
todo lo que se pulsa. La referencia es una portada de noticias deportivas:
bloque de color + foto arriba, rejilla de piezas, tabla, listas con
miniatura, tarjeta gris de tendencias, foto grande con titular encima, franja
ancha y pie oscuro con la palabra gigante.

Stack: Vite + React + TS + Tailwind v4 + framer-motion.

---

## 1. Las tres decisiones que hacen el look

1. **Todo en Inter, y el titular en `.display`.** Peso 800, tracking −0.03em,
   eje óptico forzado a 32. Es lo que hace que los h2 de sección, el hero y
   los h1 se vean como rótulos y no como texto. El hero y las tarjetas con
   foto a sangre van además en versales.
2. **La estructura la ponen las fotos y el aire, no las cajas ni las reglas.**
   Una tarjeta es: foto `rounded-xl` en 4:3, fila de metadatos, titular en
   negrita, dos líneas de extracto. Sin borde, sin fondo, sin filete. Las
   únicas superficies con fondo son la tabla de secciones, Tendencias y la
   columna lateral de la nota (`bg-surface`, `rounded-[var(--radius-card-lg)]`).
3. **Un bloque de tinta por pantalla.** `--ink` (azul noche) es el hero en la
   portada, el crédito de salida en la nota, el CTA de contacto en Medios y
   el pie en todas. Es el equivalente del verde de la referencia; el celeste
   de marca queda para viñetas, enlaces activos y el «Hoy» del wordmark.

| Decisión | Valor | Por qué |
|---|---|---|
| Superficie base | Blanco `#fff` | Un periódico se lee de día y en pantallas malas |
| Superficie de tarjeta | `hsl(210 24% 96%)` | El «crema» de la referencia, enfriado para amarrarlo al celeste |
| Tinta | `hsl(203 82% 13%)` (≈ `#06283d`) | Bloque de marca: hero, salida, pie |
| Acento | `hsl(200 98% 39%)` (≈ `#0284C7`) | Celeste de marca, AA sobre blanco |
| Tipografía | Inter variable, autoalojada | Una familia; la CSP solo permite `font-src 'self'` |
| Radios | `--radius-card: 1rem`, `--radius-card-lg: 1.25rem`, píldoras `999px` | Tarjetas y bloques redondos; botones y pestañas en píldora |
| Modo por defecto | Claro; oscuro con `html.dark` guardado | Ambos temas se prueban |

---

## 2. Tokens de color

Ver `src/index.css` para los bloques completos `:root` / `html.dark`.

- `--ink` / `--ink-soft` / `--ink-foreground`: el bloque oscuro y su texto.
  En oscuro la tinta sube un escalón sobre el fondo para seguir siendo bloque.
- `--accent` sube de luminosidad en oscuro (39% → 60%): sobre oscuro emite,
  sobre claro marca. `--accent-bright` es para chips y el «hoy.» sobre tinta.
- Neutrales con tinte 203–210 (frío); nunca un `#333` genérico.
- Sobre tinta el texto secundario va en `text-white/70`–`/75` y los bordes en
  `border-white/10`–`/25`.

---

## 3. Tipografía

```css
--font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-body:    "Inter", ui-sans-serif, system-ui, sans-serif;
```

Un solo archivo: `public/fonts/Inter-Variable.woff2` (latín, 400–900 + opsz),
precargado en `index.html`.

| Rol | Clases |
|---|---|
| h2 de sección | `display text-[1.75rem] md:text-[2.125rem]` (vía `SectionHeader`) |
| h1 de página | `display text-4xl md:text-6xl` |
| Titular del hero | `display uppercase text-[clamp(1.7rem,5vw,2.6rem)] leading-[0.98] line-clamp-4` |
| Titular de la nota | `display text-[2rem] md:text-5xl leading-[1.02]` |
| Tarjeta estándar | `font-bold text-[1.05rem] leading-snug tracking-[-0.015em] line-clamp-2` |
| Tarjeta compacta | `font-semibold text-[14px] leading-snug line-clamp-2` |
| Tarjeta con foto a sangre | `display uppercase text-xl md:text-2xl line-clamp-3` |
| Metadatos | `.tag-dot` (11px, viñeta celeste) + fecha con `Calendar` 11px |
| Rótulo | `.kicker` (11px, 600, versalitas, tracking 0.16em, gris) |
| Wordmark | `display uppercase tracking-[0.1em]`, «Hoy» en acento |
| Frase del pie | `display text-[2.75rem] md:text-6xl lg:text-7xl` |
| Palabra gigante | `.giant-word`, recortada a `h-[0.55em]` |

### Reglas duras

- **`.display` solo en titulares de bloque.** Un párrafo o una fila de lista
  nunca lleva tracking negativo.
- **Versales solo sobre foto o tinta** (hero, overlay, franja). Un titular
  largo de tarjeta en versales no se lee.
- **Cuerpo ≥ 13px.** Los 11px son solo para metadatos y rótulos.

---

## 4. Componentes

| Pieza | Dónde | Forma |
|---|---|---|
| `HeroLead` | Portada | Tarjeta 2 columnas: panel de tinta con `hero-slant` (corte diagonal en md+) + foto a sangre. Respaldo: foto del Malecón |
| `ArticleCard` `standard` | Rejillas | Foto 4:3 `rounded-xl`, `Meta`, titular, extracto |
| `ArticleCard` `compact` | Lo último, columna lateral | Miniatura 64px `rounded-lg`, `.tag-dot`, titular 14px |
| `ArticleCard` `media` | Tendencias | Miniatura 128×88 `rounded-xl`, `Meta`, titular, extracto |
| `ArticleCard` `overlay` | Foto grande | Foto a sangre, velo de tinta por abajo, sección–fecha y titular en versales |
| `SectionsTable` | Portada | Tarjeta gris con filas numeradas, barra de proporción y cifra tabular; pagina de 5 en 5 |
| `PromoBanner` | Portada | Franja ancha con la pieza de `banners.ts`, velo y titular en versales |
| `SourceCredit` `block` | Nota | Tarjeta de tinta con halo celeste y `pill-light` de salida |
| `SectionHeader` | Todas | h2 `.display` + «Ver todas →» (`.link-more`) |
| Píldoras | Botones, pestañas, filtros | `.pill` (`-light`, `-ink`, `-ghost`) y `pillTabClass` |
| `CookieBanner` | Global | Tarjeta de tinta flotante abajo a la izquierda |

### Cabecera

`sticky top-0`, 64px, tres zonas en `grid-cols-[1fr_auto_1fr]`: secciones (lg)
o menú (móvil) · wordmark centrado · búsqueda desplegable y tema. Sin sombra
hasta que hay scroll. Las páginas no reservan hueco: la barra ocupa su sitio.

### Pie

Bloque de tinta: frase grande + píldora de correo (no hay boletín ni
formulario: el correo es el único canal), marca con su línea, columnas de
secciones y sitio, línea legal, y la palabra gigante recortada al final.

---

## 5. Movimiento

- `Reveal`: fade-up de 20px en 0.55s, sin desenfoque, `once`. Escalonado de
  50–60ms por tarjeta, tope en la sexta.
- Hover de tarjeta: la foto escala a 1.04 en 500ms y el titular pasa a
  acento en 150ms. Nada más se mueve.
- Píldoras: `scale(0.97)` al pulsar.
- `prefers-reduced-motion`: `Reveal` nace visible y el scroll deja de ser suave.

---

## 6. Rejilla y espacios

- Contenedor `max-w-[1200px]` con `px-4 md:px-6`.
- Entre bloques de portada: `pt-16 md:pt-20`. Entre cabecera de bloque y su
  contenido: `mb-8`.
- Rejillas de tarjetas: `gap-x-6 gap-y-10`; 4 columnas en Última hora y
  Relacionadas, 3 en el resto.
- Filas de dos columnas (`Secciones`/`Lo último`, `Tendencias`/foto grande):
  `lg:grid-cols-[5fr_7fr]`.
- Objetivos táctiles: 44px (`h-11`) en iconos y paginación, 40px en píldoras
  de filtro, 48px en campos de búsqueda.
