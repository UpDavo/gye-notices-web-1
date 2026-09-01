/* Anuncios y avisos informativos.

   Igual que `banners.ts`, viven quemados en el repo y no en la API: son pocos,
   cambian por temporada y traerlos del backend costaría una petición más en la
   portada. Cambiar un anuncio es editar este archivo y desplegar.

   La diferencia con `HERO_BANNERS` es de intención, no de forma: aquello son
   piezas editoriales de la casa; esto es publicidad y avisos de servicio, y por
   eso la franja va rotulada como tal y los enlaces salen con `rel="sponsored"`.

   Cada anuncio puede ser:
   - una imagen con enlace (lo normal en una pauta), o
   - una tarjeta de texto (`image_url` vacío), para un aviso propio.

   `slot` decide dónde se pinta, para poder abrir más huecos sin tocar el
   componente. `starts_at` / `ends_at` son ISO (`2026-09-01` o con hora) y
   opcionales: sirven para dejar una campaña programada y que se apague sola
   sin desplegar el día que termina. */

export type Ad = {
  key: string;
  /* Hueco donde se muestra. Hoy solo existe 'home'. */
  slot: string;
  /* Rótulo pequeño sobre el anuncio; si se omite, dice «Publicidad». */
  label?: string;
  title: string;
  subtitle?: string;
  /* Texto del botón de la tarjeta de texto. Sin él no se pinta botón. */
  cta?: string;
  alt: string;
  /* Vacío = tarjeta de texto en vez de imagen. */
  image_url: string;
  image_url_mobile?: string;
  link_url: string;
  open_in_new_tab: boolean;
  /* Ventana de publicación, opcional. */
  starts_at?: string;
  ends_at?: string;
  /* Menor primero. */
  order: number;
};

export const ADS: Ad[] = [
  {
    key: 'ejemplo-anuncia-aqui',
    slot: 'home',
    label: 'Espacio publicitario',
    title: 'Anuncia tu negocio en Guayas Hoy',
    subtitle: 'Miles de guayaquileños leen aquí lo que pasa en la ciudad. Tu marca puede estar en medio.',
    cta: 'Escríbenos',
    alt: '',
    image_url: '',
    link_url: 'mailto:contacto@guayashoy.com?subject=Publicidad%20en%20Guayas%20Hoy',
    open_in_new_tab: false,
    order: 10,
  },
];

/* Los anuncios de un hueco, ya ordenados y sin los que están fuera de fecha.
   Se calcula en cada render y no una sola vez al importar: una pestaña abierta
   toda la tarde no debe seguir mostrando una campaña que ya venció. */
export function adsForSlot(slot: string, now: Date = new Date()): Ad[] {
  const t = now.getTime();
  return ADS.filter((ad) => ad.slot === slot)
    .filter((ad) => !ad.starts_at || Date.parse(ad.starts_at) <= t)
    .filter((ad) => !ad.ends_at || Date.parse(ad.ends_at) >= t)
    .sort((a, b) => a.order - b.order);
}
