/* Publicidad de Guayas Hoy.

   Dos listas, y esa separación es la que hace vendible el sitio:

   - `SPACES` son los HUECOS: dónde están, qué formato tienen y qué se ve
     mientras nadie los ha comprado. Existen siempre, aunque no haya un solo
     anunciante: un espacio vacío que dice «tu marca aquí» es el argumento de
     venta, y además reserva su altura, así que cuando entre la pieza real la
     página no se moverá ni un píxel.
   - `ADS` son las PIEZAS VENDIDAS. Vender un hueco es añadir aquí una entrada
     con la imagen y el enlace; cuando la campaña termina, se borra la entrada
     y el hueco vuelve solo a su cartel de «se alquila».

   Los formatos son medidas estándar de display (IAB), no medidas inventadas:
   un anunciante que ya tiene banners hechos para otros medios los puede
   entregar tal cual, y eso quita la fricción más cara de la primera venta.

   Igual que `banners.ts`, esto vive quemado en el repo y no en la API: son
   pocas piezas, cambian por temporada, y traerlas del backend costaría una
   petición más en la portada. Cambiar una pauta es editar este archivo y
   desplegar. */

import { environment } from '../environments/environment';

export type AdFormat = 'billboard' | 'leaderboard' | 'rectangle' | 'halfpage';

export type AdSlot =
  | 'home-top'      // bajo el hero de portada
  | 'home-mid'      // a media portada, entre bloques
  | 'home-end'      // al cierre de la portada
  | 'rail'          // columna lateral de /noticias y de una nota
  | 'article-end'   // al final de la nota, antes de las relacionadas
  | 'section-top';  // cabecera de una sección

export type FormatSpec = {
  /* Nombre comercial: es el que va en el correo con el anunciante. */
  name: string;
  /* Medida de referencia, la que se le pide al diseñador del anunciante. */
  size: string;
  /* Proporción en móvil y en escritorio. Se aplica siempre —a la pieza real
     y al cartel de espacio libre— para que el hueco mida lo mismo con y sin
     campaña y la portada no salte al cargar. */
  aspect: string;
};

export const FORMATS: Record<AdFormat, FormatSpec> = {
  billboard:   { name: 'Billboard',        size: '970 × 250 px', aspect: 'aspect-[16/9] sm:aspect-[3/1] md:aspect-[970/250]' },
  leaderboard: { name: 'Leaderboard',      size: '728 × 90 px',  aspect: 'aspect-[8/3] sm:aspect-[6/1] md:aspect-[728/90]' },
  rectangle:   { name: 'Rectángulo',       size: '300 × 250 px', aspect: 'aspect-[300/250]' },
  halfpage:    { name: 'Media página',     size: '300 × 600 px', aspect: 'aspect-[3/2] md:aspect-[300/600]' },
};

export type SpaceSpec = {
  format: AdFormat;
  /* Rótulo pequeño sobre el hueco. Un anuncio que se hace pasar por nota
     quema la confianza que sostiene al resto de la portada, así que todos van
     rotulados y nunca dicen otra cosa que lo que son. */
  label: string;
  /* Lo que se ve mientras el hueco no está vendido. */
  vacant: { title: string; subtitle: string; cta: string };
};

const CONTACT_SUBJECT = 'Publicidad%20en%20Guayas%20Hoy';

export const SPACES: Record<AdSlot, SpaceSpec> = {
  'home-top': {
    format: 'billboard',
    label: 'Espacio publicitario',
    vacant: {
      title: 'Tu marca, en la primera pantalla',
      subtitle: 'El espacio más visto de la portada: lo ve todo el que abre Guayas Hoy.',
      cta: 'Reservar este espacio',
    },
  },
  'home-mid': {
    format: 'leaderboard',
    label: 'Publicidad',
    vacant: {
      title: 'Anuncia tu negocio aquí',
      subtitle: 'A media portada, entre las noticias más leídas del día.',
      cta: 'Escríbenos',
    },
  },
  'home-end': {
    format: 'billboard',
    label: 'Espacio publicitario',
    vacant: {
      title: 'Miles de guayaquileños leen aquí',
      subtitle: 'Tu marca puede estar en medio. Franja ancha al cierre de la portada.',
      cta: 'Quiero anunciar',
    },
  },
  rail: {
    format: 'rectangle',
    label: 'Publicidad',
    vacant: {
      title: 'Tu publicidad aquí',
      subtitle: 'Acompaña al lector mientras baja por la nota.',
      cta: 'Escríbenos',
    },
  },
  'article-end': {
    format: 'leaderboard',
    label: 'Publicidad',
    vacant: {
      title: 'Este espacio está libre',
      subtitle: 'Al final de cada nota, cuando el lector ya terminó de leer.',
      cta: 'Escríbenos',
    },
  },
  'section-top': {
    format: 'leaderboard',
    label: 'Publicidad',
    vacant: {
      title: 'Patrocina una sección',
      subtitle: 'Tu marca en la cabecera de la sección que le interesa a tu cliente.',
      cta: 'Escríbenos',
    },
  },
};

export type Ad = {
  key: string;
  slot: AdSlot;
  /* Quién paga. Va en el rótulo: «Publicidad · Nombre». */
  advertiser: string;
  alt: string;
  /* La pieza. Si falla al cargar, el hueco vuelve al cartel de espacio libre
     en vez de dejar el icono roto: media pauta se ve peor que ninguna. */
  image_url: string;
  image_url_mobile?: string;
  link_url: string;
  open_in_new_tab: boolean;
  /* Ventana de campaña, ISO (`2026-09-01` o con hora). Opcional: sirve para
     dejar una pauta programada y que se apague sola el día que termina, sin
     desplegar. */
  starts_at?: string;
  ends_at?: string;
  order: number;
};

/* Vacío a propósito: hoy no hay ninguna campaña vendida y todos los huecos
   muestran su cartel. Para vender uno, añade aquí su entrada. */
export const ADS: Ad[] = [];

export function contactUrl(space: SpaceSpec, format: FormatSpec): string {
  const body = `Hola, me interesa el espacio «${space.vacant.title}» (${format.name}, ${format.size}).`;
  return `mailto:${environment.contactEmail}?subject=${CONTACT_SUBJECT}&body=${encodeURIComponent(body)}`;
}

/* La pieza que toca pintar en un hueco, o `null` si está libre.

   Se calcula en cada render y no una sola vez al importar: una pestaña abierta
   toda la tarde no debe seguir mostrando una campaña que ya venció. */
export function adForSlot(slot: AdSlot, now: Date = new Date()): Ad | null {
  const t = now.getTime();
  const live = ADS.filter((ad) => ad.slot === slot)
    .filter((ad) => !ad.starts_at || Date.parse(ad.starts_at) <= t)
    .filter((ad) => !ad.ends_at || Date.parse(ad.ends_at) >= t)
    .sort((a, b) => a.order - b.order);
  return live[0] ?? null;
}
