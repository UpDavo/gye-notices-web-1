import { AlertTriangle, Newspaper } from 'lucide-react';

/* Los tres estados que toda lista de noticias tiene que saber pintar.

   El esqueleto reserva exactamente la altura de la tarjeta real: si midiera
   distinto, la portada saltaría al llegar los datos. Las tarjetas ya no son
   cajas, así que el esqueleto tampoco: regla arriba, imagen y líneas. */

export function CardSkeleton({ variant = 'standard' }: { variant?: 'standard' | 'lead' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-4 items-start animate-pulse" aria-hidden="true">
        <div className="h-16 w-20 shrink-0 rounded-md bg-muted" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-3 rounded bg-muted w-full" />
          <div className="h-3 rounded bg-muted w-4/5" />
          <div className="h-2.5 rounded bg-muted w-1/3 mt-1" />
        </div>
      </div>
    );
  }

  if (variant === 'lead') {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 border-t-2 border-foreground/85 pt-6 animate-pulse"
        aria-hidden="true"
      >
        <div className="h-56 md:h-full md:min-h-[22rem] rounded-xl bg-muted" />
        <div className="flex flex-col gap-4 justify-center">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-8 rounded bg-muted w-full" />
          <div className="h-8 rounded bg-muted w-3/4" />
          <div className="h-3 rounded bg-muted w-full mt-2" />
          <div className="h-3 rounded bg-muted w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col border-t-2 border-foreground/85 pt-5 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-44 rounded-lg bg-muted" />
      <div className="pt-4 flex flex-col gap-3">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 rounded bg-muted w-full" />
        <div className="h-4 rounded bg-muted w-4/5" />
        <div className="h-3 rounded bg-muted w-full mt-2" />
        <div className="h-3 rounded bg-muted w-2/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      role="status"
      aria-label="Cargando noticias"
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  title = 'Todavía no hay notas aquí',
  message = 'En cuanto los medios publiquen algo nuevo en esta sección, aparecerá en esta página.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="border-t-2 border-foreground/85 border-b border-border px-8 py-16 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
        <Newspaper className="w-6 h-6 text-accent" aria-hidden="true" />
      </div>
      <h3 className="font-display font-bold text-2xl text-foreground m-0 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground m-0 max-w-md mx-auto leading-relaxed">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="border-t-2 border-foreground/85 border-b border-border px-8 py-16 text-center" role="alert">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-5">
        <AlertTriangle className="w-6 h-6 text-accent" aria-hidden="true" />
      </div>
      <h3 className="font-display font-bold text-2xl text-foreground m-0 mb-2">
        No pudimos cargar las noticias
      </h3>
      <p className="text-sm text-muted-foreground m-0 mb-6 max-w-md mx-auto leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md px-7 py-3 text-sm font-semibold bg-accent text-white hover:opacity-90 transition-opacity border-0 cursor-pointer"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
