import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { HERO_BANNERS, type Banner } from '../data/banners';

/* El hero: carrusel de los banners de `src/data/banners.ts`.

   Avanza solo cada 6 s y vuelve al primero al llegar al final. Cuáles son y a
   dónde llevan se edita en ese archivo, no aquí.

   Es un banner y nada más: va de borde a borde, arranca en lo alto de la
   página y no lleva rótulo encima. El título y el subtítulo son el
   texto alternativo y el contexto para lectores de pantalla, no una capa de
   tipografía sobre la imagen —la pieza ya viene con su propio texto quemado y
   superponerle otro la ensucia.

   La píldora de la barra flota ENCIMA de la imagen; por eso el hueco que esa
   barra necesita vive aquí y no en la portada. Sin banners, este componente sigue ocupando
   ese hueco en vez de desaparecer: si no, el cintillo de última hora se
   metería debajo de la barra.

   La pista es un `overflow-x-auto` con scroll-snap, no un `transform`. Así el
   swipe en móvil es el del propio navegador —con su inercia y su rebote— en vez
   de una imitación a base de eventos táctiles, y el avance automático es un
   `scrollTo` sobre esa misma pista. El índice activo se deduce de la posición
   real del scroll, así que los puntos siguen siendo correctos tanto si el
   usuario arrastra con el dedo como si pulsa una flecha. */

const INTERVAL_MS = 6000;

function BannerImage({ banner, onError }: { banner: Banner; onError: () => void }) {
  return (
    <picture>
      {banner.image_url_mobile && (
        <source media="(max-width: 640px)" srcSet={banner.image_url_mobile} />
      )}
      <img
        src={banner.image_url}
        alt={banner.alt || banner.title}
        onError={onError}
        className="block w-full h-[46vh] min-h-[20rem] md:h-[64vh] object-cover"
      />
    </picture>
  );
}

/* Un banner puede llevar a una ruta del sitio o a otro dominio. `Link` no vale
   para lo segundo y `<a>` recargaría la página entera en lo primero. */
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

export function HeroBanners() {
  const reduced = useReducedMotion() ?? false;

  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Las rutas se escriben a mano, así que una errata deja un banner sin
     imagen. El que falla se retira de la lista en vez de dejar el icono de
     imagen rota ocupando la primera pantalla. */
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const markFailed = (key: string) => setFailed((prev) => ({ ...prev, [key]: true }));

  const banners = HERO_BANNERS.filter((b) => !failed[b.key]);
  const total = banners.length;

  const goTo = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  /* El punto activo sale de la posición real del scroll y no de un índice
     propio: así queda igual de correcto si el usuario arrastra con el dedo,
     usa la rueda o pulsa una flecha. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      if (!track.clientWidth) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    };

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      track.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [total]);

  /* Avance automático. Se detiene si el usuario está encima o dentro con el
     teclado, si pidió menos movimiento, o si la pestaña no está a la vista:
     rotar banners que nadie ve solo gasta batería y descoloca la posición
     cuando vuelve. */
  useEffect(() => {
    if (reduced || paused || total < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const track = trackRef.current;
      if (!track || !track.clientWidth) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      goTo((current + 1) % total);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reduced, paused, total, goTo]);

  // Sin banners no hay hero, pero sí el hueco de la barra flotante.
  if (total === 0) return <div className="h-28 md:h-32" aria-hidden="true" />;

  return (
    <section
      aria-label="Destacados"
      aria-roledescription="carrusel"
      className="relative w-full bg-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="flex list-none m-0 p-0 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {banners.map((banner, i) => (
          <li
            key={banner.key}
            className="w-full shrink-0 snap-start"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            /* Las diapositivas que no se ven no deben ser alcanzables con el
               tabulador: tabular hacia un enlace invisible desplaza la pista
               sola y el lector se queda sin saber por qué se movió. `inert`
               lo resuelve de una vez — quita el foco y la saca del árbol de
               accesibilidad. */
            inert={i !== active}
          >
            <BannerLink banner={banner} className="block bg-muted">
              <BannerImage banner={banner} onError={() => markFailed(banner.key)} />
            </BannerLink>
          </li>
        ))}
      </ul>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo((active - 1 + total) % total)}
            aria-label="Banner anterior"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white border border-white/25 backdrop-blur-sm cursor-pointer hover:bg-black/55 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo((active + 1) % total)}
            aria-label="Banner siguiente"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white border border-white/25 backdrop-blur-sm cursor-pointer hover:bg-black/55 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          {/* Los puntos van sobre la imagen y no debajo: sin rótulo, cualquier
              franja de fondo bajo el banner sería una banda vacía. La cápsula
              translúcida los mantiene visibles sobre una pieza clara. */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-7 flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-sm px-3 py-2">
            {banners.map((banner, i) => (
              <button
                key={banner.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al banner ${i + 1} de ${total}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                  i === active ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
