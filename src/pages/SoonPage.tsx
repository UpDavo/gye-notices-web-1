import { useEffect, useState } from 'react';
import { keyMatches, remember } from '../lib/soon';

/* Portada de espera. Ocupa la web entera mientras SOON=true y sustituye a
   cualquier ruta: no hay navegación posible sin la clave. */

export function SoonPage({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  /* Mientras la web esté tapada no debe indexarse: lo que vería el buscador es
     esta pantalla, no el sitio. */
  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.getAttribute('content') ?? null;
    robots?.setAttribute('content', 'noindex, nofollow');

    const previousTitle = document.title;
    document.title = 'Muy pronto — Guayas Hoy';

    return () => {
      if (previous) robots?.setAttribute('content', previous);
      document.title = previousTitle;
    };
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!keyMatches(value)) {
      setError(true);
      return;
    }
    remember();
    onUnlock();
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      {/* Halo celeste: el mismo gradiente de la marca, muy diluido. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          background:
            'radial-gradient(60rem 40rem at 50% -10%, hsl(var(--accent-bright)), transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-lg text-center">
        <img
          src="/img/logo.svg"
          alt="Guayas Hoy"
          className="h-12 md:h-14 w-auto mx-auto select-none dark:hidden"
        />
        <img
          src="/img/logo-white.svg"
          alt="Guayas Hoy"
          className="h-12 md:h-14 w-auto mx-auto select-none hidden dark:block"
        />

        <p className="mt-10 text-[11px] uppercase tracking-[0.28em] text-accent m-0">
          Muy pronto
        </p>

        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.05] mt-4 mb-0">
          Estamos armando la portada
        </h1>

        <p className="text-muted-foreground leading-relaxed mt-5 mb-0 max-w-md mx-auto">
          Las noticias de Guayaquil de los principales medios de la ciudad, reunidas en un
          solo lugar. Falta poco.
        </p>

        <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <label htmlFor="soon-key" className="sr-only">
            Clave de acceso anticipado
          </label>
          <input
            id="soon-key"
            type="password"
            autoComplete="off"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(false);
            }}
            placeholder="Clave de acceso"
            aria-invalid={error}
            aria-describedby={error ? 'soon-error' : undefined}
            className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring/30 transition-colors"
          />
          <button
            type="submit"
            className="rounded-full px-7 py-3 text-sm font-semibold bg-accent text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>

        <p
          id="soon-error"
          role="status"
          className={`text-sm mt-4 mb-0 transition-opacity ${
            error ? 'text-accent opacity-100' : 'opacity-0'
          }`}
        >
          Esa clave no es. Revisa que no sobre un espacio.
        </p>
      </div>
    </main>
  );
}
