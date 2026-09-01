/* Piezas propias de Guayas Hoy.

   Están aquí, quemadas, y no vienen de la API: son piezas que cambian cada
   varias semanas, y traerlas del backend costaba una petición en la primera
   pantalla, un estado de carga y un despliegue del backend cada vez que se
   cambia una imagen. Editar este archivo y desplegar la web es más corto y no
   puede fallar a medias.

   Se usan en dos sitios. `PromoBanner` muestra la primera como franja ancha a
   media portada, con el título y el subtítulo encima de la foto. `HeroLead`
   usa la foto de la primera como respaldo cuando la nota principal no trae
   imagen o la suya falla, para que el hero nunca quede a medias.

   Las imágenes viven en `public/img/` de esta misma web, así que se referencian
   por ruta absoluta del sitio.

   El backend NO tiene banners: el modelo, el endpoint y `seed_banners` se
   borraron porque nadie los consumía. Si algún día hacen falta banners por
   campaña o con ventana de fechas, se vuelven a crear allí; hoy sobraban. */

export type Banner = {
  key: string;
  title: string;
  subtitle: string;
  alt: string;
  image_url: string;
  image_url_mobile: string;
  link_url: string;
  open_in_new_tab: boolean;
  order: number;
};

export const HERO_BANNERS: Banner[] = [
  {
    key: 'malecon',
    title: 'Guayaquil desde el Malecón',
    subtitle: 'La ciudad y el río, todos los días.',
    alt: 'Vista aérea del Malecón 2000 y la rueda La Perla, con el río Guayas al fondo',
    image_url: '/img/banner-malecon.jpg',
    image_url_mobile: '/img/banner-malecon-mobile.jpg',
    link_url: '',
    open_in_new_tab: false,
    order: 10,
  },
];
