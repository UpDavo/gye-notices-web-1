# Guayas Hoy — Sistema de Diseño

**Editorial moderna en celeste y blanco.** Serif de display, reglas y filetes en
vez de cajas, versalitas celestes y radios contenidos. Es la tercera vía entre
el estándar de la casa (píldoras, vidrio, tarjetas opacas) y el diario clásico
de [`../web2`](../web2/DESIGN_SYSTEM.md) (papel crema, Georgia, radio 0): toma
del segundo el vocabulario de imprenta —reglas, kickers, columna con filete— y
lo compone sobre blanco, con celeste, con fotos a color y con el movimiento del
primero.

Stack: Vite + React + TS + Tailwind v4 + framer-motion.

---

## 1. Las tres decisiones que hacen el look

1. **El titular va en serif moderna (Fraunces).** Es lo que separa la edición de
   un feed. El cuerpo sigue en Atkinson Hyperlegible: la serif es voz, no texto.
2. **La estructura la ponen las reglas, no las cajas.** Una nota abre con una
   regla gruesa (`border-t-2 border-foreground/85`) y cierra con un filete fino
   (`border-t border-border`) sobre el crédito. No hay tarjetas con fondo y
   borde alrededor.
3. **Radios contenidos.** `--radius: 0.5rem`. Lo redondo queda para imágenes
   (`rounded-lg`/`rounded-xl`) y controles; **no hay `rounded-full` en botones
   ni pestañas** — solo en círculos de icono (tema, menú, flechas del carrusel).

| Decisión | Valor | Por qué |
|---|---|---|
| Superficie base | Blanco `#fff` | Un periódico se lee de día y en pantallas malas |
| Acento | `hsl(200 98% 39%)` (≈ `#0284C7`) | Celeste de marca, AA sobre blanco |
| Display | Fraunces (Google Fonts, variable 400–700) | Serif moderna: editorial sin caer en lo clásico |
| Cuerpo | Atkinson Hyperlegible local | Elección de accesibilidad |
| Estructura | Regla gruesa + filete fino | La firma del sistema; el hover tiñe la regla de celeste |
| Modo por defecto | Oscuro (`html.dark`), claro guardado | Decisión previa del sitio; ambos temas se prueban |
| Vidrio | Solo la mancheta (`blur(20px) saturate(1.6)`) | El contenido pasa por debajo sin volverse niebla |

---

## 2. Tokens de color

Sin cambios de paleta: los neutrales llevan tinte 203–213 (frío) que los amarra
al celeste; nunca un `#333` genérico. Ver `src/index.css` para los bloques
completos `:root` / `html.dark`. Reglas que se mantienen:

- En oscuro el acento **sube** de luminosidad (39% → 60%): sobre oscuro emite,
  sobre claro marca.
- Los degradados arrancan de `--accent-deep`, nunca del propio acento.
- Escalera de opacidad del acento: `/[0.04]` fondo hover · `/10` chip · `/20`
  chip hover · `/40`–`/50` borde hover, anillo de foco.

---

## 3. Tipografía

```css
--font-display: "Fraunces", Georgia, "Iowan Old Style", serif;
--font-body: "AtkinsonHyperlegible", ui-sans-serif, system-ui, sans-serif;
```

Fraunces se carga desde Google Fonts en `index.html` (preconnect + `swap`);
Atkinson sigue local en 4 archivos.

| Rol | Clases |
|---|---|
| Section h2 | `font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05]` |
| Page h1 | `font-display font-bold text-4xl md:text-5xl leading-[1.05]` |
| Titular de nota | `font-display font-bold text-3xl md:text-5xl leading-[1.08]` |
| Tarjeta lead | `font-display font-bold text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.08]` |
| Tarjeta estándar | `font-display font-bold text-xl leading-snug` |
| Tarjeta compacta | `font-display font-bold text-[15px] leading-snug` |
| Kicker | clase `.kicker` (11px, 700, uppercase, tracking 0.2em, celeste) |
| Nav de la mancheta | `text-[12px] font-semibold uppercase tracking-[0.14em]` |
| Lead / extracto | `text-lg md:text-xl text-foreground/85 leading-relaxed` |
| Micro-etiqueta | `text-[11px] uppercase tracking-widest` |

### Reglas duras

- **La serif no lleva `tracking-tight`.** Una serif ya viene ajustada; apretarla
  la ensucia. (El `tracking-tight` era del sistema anterior, con sans.)
- **Las versalitas mandan en lo pequeño:** kicker, navegación, firma y pestañas
  van en mayúsculas con tracking abierto. Es lo que da el aire editorial.
- Peso binario: 400 y 700.
- Todo texto de terceros lleva `line-clamp`.

### El kicker

`.kicker` (en `index.css`) es la firma tipográfica. Sobre un titular de sección
va precedido de un filete corto:

```jsx
<p className="kicker flex items-center gap-3 m-0 mb-4">
  <span className="h-[2px] w-8 bg-accent" aria-hidden="true" />
  Portada
</p>
```

La categoría de una tarjeta es un `.kicker` a secas, sin píldora de fondo.

---

## 4. La anatomía de una nota

```jsx
/* Tarjeta estándar: regla, foto, kicker, titular, extracto, filete + crédito */
<Link className="group flex flex-col h-full border-t-2 border-foreground/85
                 hover:border-accent pt-5 no-underline transition-colors duration-300">
  <Cover className="h-44 rounded-lg" />          {/* la foto sí es redondeada */}
  <div className="pt-4 flex flex-col gap-2.5 flex-1">
    <span className="kicker">{categoría}</span>
    <h3 className="font-display font-bold text-xl leading-snug line-clamp-3
                   group-hover:text-accent transition-colors">…</h3>
    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">…</p>
    <div className="pt-3 border-t border-border">{/* crédito + hora */}</div>
  </div>
</Link>
```

El hover es doble: la regla superior y el titular se tiñen de celeste, y la
foto escala un 5%. No hay fondo de tarjeta ni sombra.

En listas laterales (portada, página de nota) las compactas se separan con
filetes finos y la columna entera se separa de la principal con un filete
vertical: `lg:border-l lg:border-border lg:pl-8`.

---

## 5. Vidrio y la mancheta

La mancheta es una barra fija de ancho completo con filete inferior
(`border-b border-border bg-background/90` + `blur(20px) saturate(1.6)`), marca
en serif y navegación en versalitas. Siempre sólida; con el scroll solo cambia
la sombra. El vidrio existe **solo aquí**.

El banner de portada empieza debajo de ella: `HeroBanners` reserva su altura
con `pt-[57px]` (y un hueco `h-24 md:h-28` cuando no hay banners). Las páginas
internas libran la barra con `pt-32 md:pt-36`.

---

## 6. Botones y controles

Rectángulos de radio pequeño. Sin gradiente, sin sombra.

```jsx
/* Primario */
"rounded-md px-7 py-3 text-sm font-semibold bg-accent text-white hover:opacity-90"

/* Secundario */
"rounded-md px-6 py-3 text-sm font-semibold border border-border text-foreground
 hover:border-accent/50 hover:text-accent transition-colors"

/* Pestaña de sección (activa / inactiva) */
"rounded-sm px-3.5 py-1.5 text-[12px] uppercase tracking-[0.1em] border
 bg-accent text-white border-accent font-bold"
"… border-border text-muted-foreground hover:text-accent hover:border-accent/50"
```

`rounded-full` queda solo para círculos de icono. Las viñetas (`SourceCredit`,
cintillo) son **cuadradas**: `h-1.5 w-1.5 bg-accent`.

**Foco visible global** (en `index.css`): outline celeste de 2px con
`border-radius: 4px`.

---

## 7. Layout

Sin cambios: secciones a `py-24 md:py-32 px-6 md:px-12 lg:px-20`, contenedor
`max-w-6xl` (portada, rejillas, mancheta) / `max-w-3xl` (legales, fuentes).
Las rejillas de notas suben a `gap-8`: las tarjetas planas necesitan más aire
que las cajas.

Portada: `grid lg:grid-cols-3` — lead a 2 columnas + lateral con filete
vertical. Página de nota: `lg:grid-cols-[minmax(0,1fr)_320px]` con lateral
pegajosa (`lg:top-24`) y filete vertical.

---

## 8. El pie

Bloque azul noche **plano** (sin esquinas redondeadas) que abre con un filete
grueso celeste (`border-t-4 border-accent`) y conserva el halo de marca. Cierra
con la palabra gigante en serif casi fundida con el fondo:

```jsx
"font-display font-bold text-white/[0.07] leading-[0.8] whitespace-nowrap
 text-[14vw] lg:text-[10.5rem]"   /* aria-hidden: es colofón, no contenido */
```

---

## 9. Movimiento

Sin cambios respecto del estándar: `<MotionConfig reducedMotion="user">`,
easing de marca `[0.21, 0.65, 0.36, 1]`, primitiva `Reveal` (fade-up +
desenfoque, stagger acotado a los 6 primeros), cintillo con lista duplicada y
máscara de fundido, y el idioma `reduced ? undefined : {…}` en todo lo que se
mueve.

---

## 10. Reglas propias de un agregador

Estas no cambian con el rediseño; nacen de que el contenido es de otros.

- **El crédito nunca es opcional.** `SourceCredit` no tiene modo sin enlace.
- **La página de una nota no tiene cuerpo de artículo.** El elemento principal
  es el bloque de salida al medio (abre con la regla gruesa del sistema).
- **Toda foto es de terceros y puede fallar:** `onError` en toda `<img>`, caída
  al motivo de olas de la marca.
- **Todo titular puede ser larguísimo:** `line-clamp`, nunca alturas fijas.
- **La lista puede venir vacía:** esqueleto (con la anatomía real de la
  tarjeta: regla + bloques), vacío con explicación y error con reintento.

---

## 11. Checklist

- [ ] Titular en `font-display` (Fraunces), **sin** `tracking-tight`
- [ ] Notas con regla gruesa arriba y filete fino sobre el crédito; sin cajas
- [ ] Kickers y navegación en versalitas con tracking abierto
- [ ] `rounded-md`/`rounded-sm` en botones y pestañas; `rounded-full` solo en
      círculos de icono
- [ ] Viñetas cuadradas, no puntos redondos
- [ ] Vidrio solo en la mancheta; `blur(20px) saturate(1.6)`
- [ ] Foco visible global; `line-clamp` y `onError` en todo lo de terceros
- [ ] Los tres estados en todo listado
- [ ] Ambos temas probados (el sitio nace en oscuro)

### Errores comunes

| No | Sí |
|---|---|
| Píldoras `rounded-full` en botones | `rounded-md`, rectángulo editorial |
| Tarjetas con borde y fondo | Regla gruesa + filete fino |
| Serif con `tracking-tight` | Serif con tracking natural |
| Kicker con píldora de fondo | Kicker tipográfico a secas |
| Sombras para separar | Reglas para separar |
| Grises neutros `#333` | Neutrales tintados `hsl(205 …)` |
| Puntos redondos de viñeta | Cuadrados de acento |
| Animar sin comprobar `reduced` | Idioma `reduced ? undefined : {…}` |
