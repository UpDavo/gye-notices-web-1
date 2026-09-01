import { AlertTriangle, Newspaper } from 'lucide-react';

/* Los tres estados que toda lista de noticias tiene que saber pintar.

   El esqueleto reserva la misma altura que la tarjeta real: si midiera
   distinto, la portada saltaría al llegar los datos. */

export function CardSkeleton({
  variant = 'standard',
}: {
  variant?: 'standard' | 'compact' | 'media' | 'overlay';
}) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-3.5 items-start animate-pulse" aria-hidden="true">
        <div className="h-16 w-16 shrink-0 rounded-lg bg-muted" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-2.5 rounded bg-muted w-1/3" />
          <div className="h-3.5 rounded bg-muted w-full" />
          <div className="h-3.5 rounded bg-muted w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === 'media') {
    return (
      <div className="flex gap-4 items-start animate-pulse" aria-hidden="true">
        <div className="h-[5.5rem] w-32 shrink-0 rounded-xl bg-muted" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 rounded bg-muted w-1/2" />
          <div className="h-3.5 rounded bg-muted w-full" />
          <div className="h-3.5 rounded bg-muted w-4/5" />
          <div className="h-2.5 rounded bg-muted w-full mt-1" />
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="min-h-[22rem] rounded-[var(--radius-card-lg)] bg-muted animate-pulse" aria-hidden="true" />
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-pulse" aria-hidden="true">
      <div className="aspect-[4/3] rounded-xl bg-muted" />
      <div className="flex justify-between">
        <div className="h-2.5 w-20 rounded bg-muted" />
        <div className="h-2.5 w-16 rounded bg-muted" />
      </div>
      <div className="h-4 rounded bg-muted w-full" />
      <div className="h-4 rounded bg-muted w-4/5" />
      <div className="h-3 rounded bg-muted w-full mt-1" />
      <div className="h-3 rounded bg-muted w-2/3" />
    </div>
  );
}

export function GridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 3 | 4 }) {
  const cols = columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-x-6 gap-y-10`}
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
    <div className="rounded-[var(--radius-card-lg)] bg-surface px-8 py-16 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink text-white mb-5">
        <Newspaper className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="display text-2xl text-foreground m-0 mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground m-0 max-w-md mx-auto leading-relaxed">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-[var(--radius-card-lg)] bg-surface px-8 py-16 text-center" role="alert">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink text-white mb-5">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="display text-2xl text-foreground m-0 mb-3">No pudimos cargar las noticias</h3>
      <p className="text-sm text-muted-foreground m-0 mb-6 max-w-md mx-auto leading-relaxed">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="pill pill-ink">
          Reintentar
        </button>
      )}
    </div>
  );
}
