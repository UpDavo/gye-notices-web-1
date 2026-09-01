import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HERO_BANNERS, type Banner } from '../data/banners';

/* Banner ancho a media portada: la pieza propia de `src/data/banners.ts`.

   Foto a sangre, velo oscuro por abajo y el texto encima en versales. Es el
   sitio de las piezas de la casa —campañas, la ciudad, un especial— entre las
   notas de los medios. Cuáles son y a dónde llevan se edita en ese archivo,
   no aquí. Se muestra la primera; sin banners, la franja desaparece. */

function BannerLink({ banner, className, children }: {
  banner: Banner;
  className: string;
  children: React.ReactNode;
}) {
  if (!banner.link_url) {
    return <div className={className}>{children}</div>;
  }
  if (banner.link_url.startsWith('/')) {
    return <Link to={banner.link_url} className={`${className} no-underline`}>{children}</Link>;
  }
  return (
    <a
      href={banner.link_url}
      className={`${className} no-underline`}
      {...(banner.open_in_new_tab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

export function PromoBanner() {
  const [failed, setFailed] = useState(false);
  const banner = HERO_BANNERS[0];

  if (!banner || failed) return null;

  return (
    <section aria-label="Destacado" className="px-4 md:px-6 pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto">
        <BannerLink
          banner={banner}
          className="group relative block overflow-hidden rounded-[var(--radius-card-lg)] bg-ink text-white min-h-[20rem] md:min-h-[24rem]"
        >
          <picture>
            {banner.image_url_mobile && (
              <source media="(max-width: 640px)" srcSet={banner.image_url_mobile} />
            )}
            <img
              src={banner.image_url}
              alt={banner.alt || banner.title}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, hsl(203 82% 8% / 0.9) 0%, hsl(203 82% 8% / 0.35) 50%, transparent 80%)',
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col justify-end gap-3 p-6 md:p-10 min-h-[20rem] md:min-h-[24rem] max-w-2xl">
            <p className="text-[12px] text-white/75 m-0">{banner.subtitle}</p>
            <h2 className="display uppercase text-2xl md:text-4xl text-white m-0 leading-[1.02]">
              {banner.title}
            </h2>
            {banner.link_url && (
              <div className="pt-2">
                <span className="pill pill-light">
                  Ver más
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            )}
          </div>
        </BannerLink>
      </div>
    </section>
  );
}
