import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/ScrollMotion';
import { FORMATS, SPACES, adForSlot, contactUrl, type Ad, type AdSlot } from '../../data/ads';

/* Los espacios publicitarios de Guayas Hoy.

   Un hueco pinta siempre algo: la pieza vendida, o el cartel que dice que
   está libre. Nunca desaparece. Ese es el punto —un espacio que solo existe
   cuando ya está vendido no se puede enseñar a un anunciante— y de paso el
   hueco reserva su altura desde el primer frame, así que cuando entre la
   pieza real la página no se mueve.

   El cartel de espacio libre habla en el idioma de la casa: bloque de tinta,
   titular en `.display`, píldora de contacto. No es un recuadro punteado
   genérico de maqueta; es una pieza de la portada que además vende.

   Todo va rotulado («Publicidad») y los enlaces externos salen con
   `rel="sponsored"`: un anuncio que se hace pasar por nota quema la confianza
   que sostiene al resto de la portada. */

type Props = {
  slot: AdSlot;
  className?: string;
};

function AdLink({ ad, className, children }: {
  ad: Ad;
  className: string;
  children: React.ReactNode;
}) {
  if (!ad.link_url) return <div className={className}>{children}</div>;
  if (ad.link_url.startsWith('/')) {
    return <Link to={ad.link_url} className={`${className} no-underline`}>{children}</Link>;
  }
  return (
    <a
      href={ad.link_url}
      className={`${className} no-underline`}
      rel={ad.open_in_new_tab ? 'sponsored noopener noreferrer' : 'sponsored'}
      {...(ad.open_in_new_tab ? { target: '_blank' } : {})}
    >
      {children}
    </a>
  );
}

/* El hueco desnudo, sin franja ni contenedor: sirve igual en una columna
   lateral que dentro de una franja a todo el ancho. */
export function AdSpace({ slot, className = '' }: Props) {
  /* Una pieza que no carga vuelve al cartel de espacio libre: media pauta se
     ve peor que ninguna, y el hueco sigue midiendo lo mismo. */
  const [failed, setFailed] = useState(false);

  const space = SPACES[slot];
  const format = FORMATS[space.format];
  const sold = adForSlot(slot);
  const ad = sold && !failed ? sold : null;
  const row = format.layout === 'row';
  const dense = Boolean(format.dense);

  return (
    <figure className={`m-0 ${className}`}>
      <figcaption className="kicker m-0 mb-2">
        {space.label}
        {ad && <span className="normal-case tracking-normal"> · {ad.advertiser}</span>}
      </figcaption>

      {ad ? (
        <AdLink
          ad={ad}
          className={`group block overflow-hidden rounded-[var(--radius-card)] bg-surface ${format.aspect}`}
        >
          <picture>
            {ad.image_url_mobile && (
              <source media="(max-width: 640px)" srcSet={ad.image_url_mobile} />
            )}
            <img
              src={ad.image_url}
              alt={ad.alt}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          </picture>
        </AdLink>
      ) : (
        /* Espacio libre. Bloque de tinta con el halo celeste de marca, el
           mismo lenguaje del hero y del crédito de salida.

           El cartel va con `min-h` y NO con la proporción del formato: un
           `aspect-ratio` fija la altura y recorta el titular que no quepa. La
           pieza vendida sí conserva la proporción exacta, que es donde
           importa. */
        <a
          href={contactUrl(space, format)}
          className={`group relative flex overflow-hidden rounded-[var(--radius-card)] bg-ink text-ink-foreground no-underline ${format.vacantMinH} ${
            row
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-5 sm:px-8'
              : 'flex-col items-center justify-center text-center gap-2 px-5 py-6 sm:px-6 sm:py-8'
          }`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(40rem 20rem at 50% 120%, hsl(var(--accent-deep) / 0.85), transparent 70%)',
            }}
          />

          <span className={`relative min-w-0 ${row ? '' : 'contents'}`}>
            <span
              className={`relative block display uppercase leading-[1.05] ${
                dense
                  ? 'text-[15px] sm:text-base'
                  : row
                    ? 'text-lg md:text-xl'
                    : 'text-lg sm:text-xl md:text-2xl max-w-2xl'
              }`}
            >
              {space.vacant.title}
            </span>
            <span
              className={`relative block text-white/70 ${
                dense ? 'text-[12px] leading-snug mt-1.5' : 'text-[13px] md:text-sm mt-1.5 max-w-md'
              }`}
            >
              {space.vacant.subtitle}
            </span>
          </span>

          <span className={`relative flex flex-col items-center gap-2 shrink-0 ${row ? 'sm:items-end' : 'mt-2'}`}>
            <span className={`pill pill-light ${dense ? 'text-[13px] !py-2 !px-3.5' : 'text-[13px] !py-2.5 !px-4'}`}>
              {space.vacant.cta}
              <ArrowRight size={15} aria-hidden="true" />
            </span>
            {/* La medida, en pequeño: es el dato que pide el anunciante. */}
            <span className="kicker text-white/45 text-[10px]">
              {format.name} · {format.size}
            </span>
          </span>
        </a>
      )}
    </figure>
  );
}

/* La franja a todo el ancho, con el contenedor y el ritmo vertical de la
   portada. Es lo que se usa entre bloques. */
export function AdBand({ slot, className = '' }: Props) {
  return (
    <section aria-label="Publicidad" className={`px-4 md:px-6 pt-16 md:pt-20 ${className}`}>
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <AdSpace slot={slot} />
        </Reveal>
      </div>
    </section>
  );
}
