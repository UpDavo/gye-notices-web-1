import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { adsForSlot, type Ad } from '../../data/ads';
import { Reveal } from '../ui/ScrollMotion';

/* Franja de anuncios y avisos informativos.

   Uno o varios: con uno ocupa el ancho entero, con dos o más se reparte en
   rejilla. Qué se muestra se edita en `src/data/ads.ts`; sin anuncios para el
   hueco, la sección no se pinta y no deja un espacio en blanco.

   Va rotulada («Publicidad») a propósito: un anuncio que se hace pasar por
   nota quema la confianza que sostiene al resto de la portada. Por lo mismo
   los enlaces externos salen con `rel="sponsored noopener noreferrer"`.

   Si la imagen de un anuncio falla, ese anuncio desaparece en vez de dejar el
   icono roto —una pauta a medias se ve peor que ninguna. */

type Props = {
  slot?: string;
  className?: string;
};

function AdFrame({ ad, className, children }: {
  ad: Ad;
  className: string;
  children: React.ReactNode;
}) {
  if (!ad.link_url) {
    return <div className={className}>{children}</div>;
  }
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

function AdItem({ ad, wide }: { ad: Ad; wide: boolean }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(ad.image_url) && !failed;

  if (Boolean(ad.image_url) && failed) return null;

  return (
    <figure className="m-0">
      <figcaption className="kicker m-0 mb-2">{ad.label || 'Publicidad'}</figcaption>

      {hasImage ? (
        <AdFrame
          ad={ad}
          className={`group block overflow-hidden rounded-[var(--radius-card)] bg-surface ${
            wide ? 'aspect-[16/5] md:aspect-[1200/200]' : 'aspect-[16/9] md:aspect-[3/2]'
          }`}
        >
          <picture>
            {ad.image_url_mobile && (
              <source media="(max-width: 640px)" srcSet={ad.image_url_mobile} />
            )}
            <img
              src={ad.image_url}
              alt={ad.alt || ad.title}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          </picture>
        </AdFrame>
      ) : (
        /* Sin imagen: tarjeta de texto sobre la tinta de marca, que la separa
           de las tarjetas de nota sin necesidad de un borde punteado. */
        <AdFrame
          ad={ad}
          className="group flex flex-col justify-center gap-2 rounded-[var(--radius-card)] bg-ink text-ink-foreground px-6 py-8 md:px-10 md:py-10 min-h-[9rem]"
        >
          <p className="display uppercase text-xl md:text-2xl m-0 leading-[1.05]">{ad.title}</p>
          {ad.subtitle && (
            <p className="text-[14px] md:text-[15px] text-white/70 m-0 max-w-2xl">{ad.subtitle}</p>
          )}
          {ad.cta && ad.link_url && (
            <span className="pill pill-light mt-3 self-start">
              {ad.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          )}
        </AdFrame>
      )}
    </figure>
  );
}

export function AdsSection({ slot = 'home', className = '' }: Props) {
  const ads = adsForSlot(slot);
  if (ads.length === 0) return null;

  const wide = ads.length === 1;

  return (
    <section
      aria-label="Publicidad"
      className={`px-4 md:px-6 pt-16 md:pt-20 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div
            className={`grid gap-6 ${
              wide ? 'grid-cols-1' : ads.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {ads.map((ad) => (
              <AdItem key={ad.key} ad={ad} wide={wide} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
