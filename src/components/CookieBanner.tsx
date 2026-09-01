import { useState } from 'react';
import { Link } from 'react-router-dom';

/* Aviso de cookies: una tarjeta flotante abajo a la izquierda, no una franja
   a todo el ancho. Tapa una esquina, no la portada. */

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('cookie_consent') !== null;
    } catch {
      // localStorage bloqueado: no se insiste con el aviso.
      return true;
    }
  });

  if (dismissed) return null;

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem('cookie_consent', value);
    } catch {
      // sin almacenamiento el aviso volverá a salir; es preferible a fallar
    }
    setDismissed(true);
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-50 rounded-[var(--radius-card-lg)] bg-ink text-white p-5 shadow-[0_24px_60px_-20px_rgba(6,40,61,0.6)]"
    >
      <p className="text-sm text-white/85 leading-relaxed m-0 mb-4">
        Usamos almacenamiento local para recordar tus preferencias, como el modo oscuro.{' '}
        <Link to="/privacidad" className="text-white underline underline-offset-4 hover:text-accent-bright transition-colors">
          Más información
        </Link>
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => decide('accepted')} className="pill pill-light">
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => decide('declined')}
          className="pill bg-transparent text-white/80 hover:text-white border-white/25 hover:border-white"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
