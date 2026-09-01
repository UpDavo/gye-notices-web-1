import { useEffect, useRef, useState } from 'react';
import { keyMatches, remember } from '../lib/soon';

/* Portada de espera. Ocupa la web entera mientras SOON=true y sustituye a
   cualquier ruta: no hay navegación posible sin la clave.

   Solo el titular. El acceso vive en un botón discreto abajo a la derecha:
   quien tiene la clave sabe que está ahí; el resto ve una página en blanco
   con una frase. */

export function SoonPage({ onUnlock }: { onUnlock: () => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

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

      <h1 className="relative font-display font-bold text-4xl md:text-6xl leading-[1.05] text-center max-w-3xl m-0">
        Estamos armando la portada
      </h1>

      {/* Acceso anticipado. Discreto a propósito: no invita a probar suerte. */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <form
            onSubmit={submit}
            className="flex items-center gap-2 rounded-full border border-border bg-surface p-1.5 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.45)]"
          >
            <label htmlFor="soon-key" className="sr-only">
              Clave de acceso anticipado
            </label>
            <input
              ref={inputRef}
              id="soon-key"
              type="password"
              autoComplete="off"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError(false);
              }}
              placeholder="Clave"
              aria-invalid={error}
              className={`w-40 sm:w-48 bg-transparent px-4 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground ${
                error ? 'text-accent' : ''
              }`}
            />
            <button
              type="submit"
              className="rounded-full px-4 py-1.5 text-xs font-semibold bg-accent text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar acceso' : 'Acceso anticipado'}
          title="Acceso"
          className={`h-9 w-9 rounded-full border border-border bg-surface text-muted-foreground cursor-pointer transition-opacity hover:opacity-100 focus-visible:opacity-100 ${
            open ? 'opacity-100' : 'opacity-25'
          }`}
        >
          <span aria-hidden="true" className="text-sm leading-none">
            {open ? '×' : '·'}
          </span>
        </button>
      </div>
    </main>
  );
}
