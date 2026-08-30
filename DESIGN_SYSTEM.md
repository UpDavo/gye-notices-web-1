# Guayas Hoy — Sistema de Diseño

Derivado del estándar visual de la casa (Vite + React + TS + Tailwind v4 +
framer-motion). **La estructura es la misma; cambia la paleta y el modo por
defecto.**

Lo que se conserva tal cual: la primitiva `Reveal`, el easing de marca, la
píldora de vidrio del navbar, `rounded-full` en todo botón, tarjetas opacas,
`tracking-tight` en todo título, el ritmo de secciones y el pie con palabra
gigante.

Lo que cambia: el fondo va de negro a blanco, el acento de morado a celeste, y
el modo por defecto pasa de oscuro a claro. Un periódico se lee de día, en el
teléfono y en pantallas malas.

---

## 1. Fundamento

| Decisión | Valor | Por qué |
|---|---|---|
| Superficie base | Blanco `#fff` | Es un periódico; la lectura larga manda sobre el efecto |
| Acento | `hsl(200 98% 39%)` (≈ `#0284C7`) | Celeste de marca, bajado de luminosidad para pasar AA sobre blanco |
| Modo por defecto | Claro, oscuro con `html.dark` | Al revés que el estándar de la casa |
| Tipografía | Atkinson Hyperlegible (única familia) | Elección de accesibilidad; alta distinción entre caracteres |
| Radios | Muy redondeados; `rounded-full` domina | Igual que el estándar |
| Movimiento | Scroll-driven, no decorativo | Igual que el estándar, pero con menos hero |
| Vidrio | Escaso y quirúrgico | Solo la barra flotante. Las tarjetas son opacas |

---

## 2. Tokens de color

Los neutrales **no son grises puros**: todos llevan tinte 203–213 (frío), que es
lo que los amarra al celeste. Nunca un `#333` genérico.

### Claro (por defecto)

```css
:root {
  --accent: 200 98% 39%;          /* celeste de marca, AA sobre blanco */
  --accent-bright: 199 95% 54%;   /* solo superficies grandes y degradados */
  --accent-deep: 205 90% 26%;     /* arranque de los degradados */
  --accent-foreground: 0 0% 100%;
  --primary: 200 98% 39%;
  --ring: 200 98% 39%;

  --background: 0 0% 100%;
  --foreground: 213 34% 12%;
  --surface: 205 44% 97%;         /* ≈ #f5f8fb — tarjeta elevada */
  --secondary: 205 44% 97%;
  --muted: 205 40% 95%;
  --muted-foreground: 211 15% 42%;
  --border: 207 24% 88%;

  --radius: 1rem;
  color-scheme: light;
}
```

### Oscuro (`html.dark`)

El fondo se va a **azul noche, no a negro puro**, para no perder el parentesco
con el celeste. El acento **sube** de luminosidad: sobre oscuro el acento emite,
sobre claro marca.

```css
html.dark {
  --accent: 199 95% 60%;
  --accent-bright: 199 92% 52%;
  --accent-deep: 206 88% 22%;
  --accent-foreground: 213 44% 8%;

  --background: 213 44% 8%;
  --foreground: 205 30% 96%;
  --surface: 213 34% 13%;
  --muted: 213 30% 17%;
  --muted-foreground: 209 16% 64%;
  --border: 213 25% 22%;

  color-scheme: dark;
}
```

**Regla de conversión claro → oscuro:** el acento gana luminosidad (39% → 60%);
las superficies se invierten pero conservan el tinte 205–213; los degradados
arrancan de un azul profundo, no del propio acento — si arrancaran del acento, un
bloque de color brillaría más que las fotos reales de al lado.

### Escaleras de opacidad

Solo estos peldaños. No inventes intermedios.

**Acento:** `/[0.04]` fondo hover de tarjeta · `/10` chip, píldora de categoría ·
`/20` chip hover · `/40` borde hover, anillo de foco

**Blanco (sobre el hero):** `/[0.10]` `/25` `/30` `/40` `/55` `/75` `/80` `/90`

---

## 3. Tipografía

Una sola familia, `AtkinsonHyperlegible`, local en 400/700 + itálicas.
`--font-display` y `--font-body` apuntan a lo mismo.

> **Variante editorial:** si algún día quieres el aire de periódico impreso,
> cambia **solo** `--font-display` a una serif. El sistema está preparado para
> que sea una línea, pero mientras tanto la familia única se mantiene por
> coherencia con el estándar de la casa.

| Rol | Clases |
|---|---|
| Hero h1 | `text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight` |
| Section h2 | `text-4xl md:text-6xl tracking-tight leading-tight` |
| Page h1 | `text-4xl md:text-5xl tracking-tight leading-tight` |
| Titular de nota | `text-3xl md:text-5xl tracking-tight leading-tight` |
| Tarjeta lead | `text-2xl md:text-3xl leading-tight tracking-tight` |
| Tarjeta estándar | `text-lg leading-snug tracking-tight` |
| Tarjeta compacta | `text-sm leading-snug` |
| Eyebrow | `text-accent font-semibold text-base md:text-lg tracking-tight mb-4` |
| Lead | `text-lg md:text-xl text-foreground/85 leading-relaxed` |
| Cuerpo de tarjeta | `text-sm text-muted-foreground leading-relaxed` |
| Micro-etiqueta | `text-[11px] uppercase tracking-widest` |

**Reglas duras** (heredadas sin cambios):

- Tracking binario: `tracking-tight` en todo título y eyebrow, `tracking-widest`
  en toda micro-etiqueta en mayúsculas.
- Mayúsculas solo en micro-etiquetas, nunca en titulares.
- Peso binario: 400 y 700.
- Los display grandes bajan el leading: `leading-[0.95]`, `[1.15]`.

**Truncado.** Los titulares vienen de terceros y no se pueden acortar a mano, así
que la rejilla los recorta: `line-clamp-3` en el titular de tarjeta,
`line-clamp-3/4` en el extracto. Sin eso, un titular largo desalinea la fila
entera.

---

## 4. Vidrio

Existe **solo en la barra flotante**. El ingrediente crítico es `saturate(1.6)`:
sin él es niebla gris, no vidrio.

```jsx
<div
  className={`max-w-6xl mx-auto rounded-[1.75rem] border transition-all duration-300 overflow-hidden ${
    solid
      ? 'bg-surface/85 border-border shadow-[0_8px_40px_-12px_rgba(15,23,42,0.18)]'
      : 'bg-black/30 border-white/[0.10]'
  }`}
  style={{
    backdropFilter: 'blur(20px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
  }}
>
```

`solid = scrolled || pathname !== '/' || menuOpen`, umbral `window.scrollY > 20`.
Sobre el hero el texto va en blanco; en cuanto se vuelve sólida sigue los tokens
del tema activo.

**El vidrio necesita algo detrás.** Sobre fondo plano usa `bg-surface` opaco. El
aviso de cookies, por ejemplo, es opaco a propósito: flotando sobre contenido
claro, el translúcido dejaba el texto ilegible.

---

## 5. Botones

Todos `rounded-full`. **Ninguno lleva gradiente ni sombra.**

```jsx
/* Primario */
"rounded-full px-7 py-3 text-sm font-semibold bg-accent text-white
 hover:opacity-90 transition-opacity duration-150"

/* Secundario */
"rounded-full px-7 py-3 text-sm font-semibold border border-border text-foreground
 hover:border-accent/50 hover:text-accent transition-colors"

/* Sobre el hero */
"rounded-full px-7 py-3 text-sm font-semibold bg-white text-[hsl(206_92%_14%)]
 hover:opacity-90 transition-opacity"

/* Pestaña de sección, activa */
"rounded-full px-4 py-1.5 text-sm border bg-accent text-white border-accent font-semibold"

/* Pestaña de sección, inactiva */
"rounded-full px-4 py-1.5 text-sm border border-border text-muted-foreground
 hover:text-foreground hover:border-foreground/30"
```

**Escalera de padding:** `py-1.5` nav → `py-2.5` compacto → `py-3 px-7` estándar.

**Foco visible — resuelto aquí.** El estándar de la casa no tiene focus styling
en botones ni enlaces; es un hueco de accesibilidad conocido, notable dado que la
tipografía es una elección de accesibilidad. `src/index.css` lo cierra global:

```css
:where(a, button, [role="button"], summary, input, textarea, select):focus-visible {
  outline: 2px solid hsl(var(--accent));
  outline-offset: 2px;
  border-radius: 999px;
}
```

---

## 6. Superficies

La tarjeta estándar es **opaca**, no vidrio. El hover es doble y sutil: el borde
se tiñe de acento al 40%, el fondo al 4%.

```jsx
"rounded-3xl border border-border bg-surface
 hover:border-accent/40 hover:bg-accent/[0.04] transition-colors duration-300"
```

### Vocabulario de radios

| Valor | Uso |
|---|---|
| `rounded-full` | Botón, píldora, etiqueta, punto de paginación |
| `rounded-[1.75rem]` 28px | Píldora del navbar |
| `rounded-3xl` 24px | Tarjeta de nota, contenedor de sección, estados vacíos |
| `rounded-2xl` 16px | Tarjeta de medio, bloque de crédito, tarjeta compacta |
| `rounded-xl` 12px | Inputs, miniaturas |

Regla: **contenedor más grande → radio más grande.**

---

## 7. Layout

```jsx
<section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
  <div className="max-w-6xl mx-auto">
```

**Ritmo vertical:** `py-24 md:py-32` por defecto · `pt-32 md:pt-36` en páginas
internas, para librar la barra flotante.

**Horizontal:** `px-6 md:px-12 lg:px-20` universal.

**Contenedores:** `max-w-3xl` (nota, legales) · `max-w-4xl` (imagen de portada) ·
`max-w-5xl` (medios) · `max-w-6xl` (navbar, rejillas, portada).

**Rejillas:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` para notas ·
`grid-cols-1 lg:grid-cols-3` para la portada (2 de nota principal + 1 lateral).

---

## 8. Sombras y luz

Lista completa; no hay más en todo el sitio:

```css
0 8px 40px -12px rgba(15,23,42,0.18)     /* navbar sólido */
0 -8px 32px -12px rgba(15,23,42,0.25)    /* aviso de cookies, sombra hacia arriba */
```

**Halo ambiental** para cabeceras y cierres:

```jsx
'radial-gradient(ellipse at center, hsl(199 95% 55% / 0.16) 0%, transparent 70%)'
```

En claro la opacidad se queda en `0.16–0.22`: un halo al 0.3 sobre blanco se ve
como una mancha.

---

## 9. El hero

Carrusel de banners servidos por el backend (`news/banners.json`).

Antes esto era una pila de seis capas con video, zoom dirigido por scroll y
entradas escalonadas: costaba pantalla y media antes de la primera noticia. Se
retiró entera. Lo que hay ahora es una banda de altura fija que rota sola cada
6 s, con degradado inferior —solo en la parte baja, para que el texto se lea sin
oscurecer la foto entera— y el rótulo encima.

```jsx
background: 'linear-gradient(to top, rgba(9,20,32,0.90) 0%, rgba(9,20,32,0.55) 32%, transparent 66%)'
```

La parada intermedia va al 55% y no al 28%: el subtítulo cae justo ahí y con
menos capa queda gris sobre gris. Los puntos van abajo a la DERECHA y el rótulo
reserva `pr-24 md:pr-32`: centrados se montaban sobre el texto.

Consecuencia en el navbar: **la píldora va siempre sólida**. Su segundo estado
translúcido con texto blanco existía para flotar sobre el video oscuro; sin él,
dejaría texto blanco sobre fondo blanco. Lo que sigue cambiando con el scroll es
la sombra.

## 10. Movimiento

```jsx
<MotionConfig reducedMotion="user">   {/* envuelve la app entera */}
```

**Easing de marca:** `[0.21, 0.65, 0.36, 1]`. Salida rápida, asentamiento largo.

**La primitiva `Reveal`** es la entrada por defecto, con el desenfoque que se
resuelve:

```jsx
initial={reduced ? false : { opacity: 0, y: 32, filter: 'blur(8px)' }}
whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
transition={{ duration: 0.8, delay, ease: [0.21, 0.65, 0.36, 1] }}
viewport={{ once: true, margin: '-80px' }}
```

Stagger `delay={i * 0.08}`, acotado a los seis primeros ítems: en una rejilla de
doce, escalonar hasta el último deja al lector esperando.

**Salida del hero** (scroll-driven, `offset: ['start start', 'end start']`):

```js
scale          = useTransform(p, [0, 0.9],  [1, 0.88])
radius         = useTransform(p, [0, 0.9],  ['0px', '40px'])
contentOpacity = useTransform(p, [0, 0.45], [1, 0])
contentY       = useTransform(p, [0, 0.45], [0, -60])
```

**Reduced motion — obligatorio.** Un solo idioma en todo el código:

```jsx
const reduced = useReducedMotion() ?? false;
style={reduced ? undefined : { scale, opacity }}
initial={reduced ? false : { opacity: 0, y: 32 }}
```

Y en CSS: `.ticker-track { animation: none }` y `html { scroll-behavior: auto }`.

---

## 11. El cintillo

Mismos requisitos que la banda de logos del estándar: lista **duplicada** (el
`-50%` de la animación depende de ello), la copia con `aria-hidden` para que un
lector de pantalla no la lea dos veces, y máscara de fundido en los bordes.

```css
.ticker-track { display: flex; width: max-content; animation: ticker-scroll 60s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }
```

---

## 12. Reglas propias de un agregador

Estas no vienen del estándar; nacen de que el contenido es de otros.

- **El crédito nunca es opcional.** `SourceCredit` no tiene modo sin enlace.
- **La página de una nota no tiene cuerpo de artículo.** El elemento principal es
  el botón de salida al medio, no un pie de foto.
- **Toda foto es de terceros, así que toda foto puede fallar.** Cada `<img>`
  lleva `onError` y cae al motivo de olas de la marca. Un icono de imagen rota
  sobre un titular es peor que no tener foto.
- **Todo titular puede ser larguísimo.** Nada de alturas fijas sin `line-clamp`.
- **La lista puede venir vacía.** Cada listado pinta sus tres estados: esqueleto
  con la altura real de la tarjeta, vacío con explicación, y error con reintento.

---

## 13. Checklist

- [ ] Copiar el bloque `@theme` + `:root` + `html.dark` tal cual
- [ ] Atkinson Hyperlegible local (4 archivos, `font-display: swap`)
- [ ] `<MotionConfig reducedMotion="user">` en la raíz
- [ ] Secciones a `py-24 md:py-32 px-6 md:px-12 lg:px-20`
- [ ] Botones `rounded-full`, sin gradiente, sin sombra
- [ ] Tarjetas opacas `bg-surface`; vidrio solo en la barra flotante
- [ ] Todo título `tracking-tight`; toda micro-etiqueta `uppercase tracking-widest`
- [ ] Focus-visible global
- [ ] `line-clamp` en todo texto de terceros
- [ ] `onError` en toda imagen de terceros
- [ ] Los tres estados en todo listado

### Errores comunes

| No | Sí |
|---|---|
| Grises neutros `#333` | Neutrales tintados `hsl(205 …)` |
| Botones con gradiente | Acento plano + `hover:opacity-90` |
| Vidrio en todas las tarjetas | Vidrio solo en el navbar; tarjetas opacas |
| `backdrop-blur` sin `saturate` | Siempre `blur(20px) saturate(1.6)` |
| Títulos con tracking normal | Siempre `tracking-tight` |
| Verdes o morados para estado | Quedarse en el arco celeste → azul profundo |
| Sombras de elevación en tarjetas | Bordes + tinte de fondo en hover |
| Animar sin comprobar `reduced` | Siempre el idioma `reduced ? undefined : {...}` |
| Altura fija con texto de terceros | `line-clamp` |
