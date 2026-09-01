import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

export function NotFoundPage() {
  usePageSeo({
    title: 'Página no encontrada — Guayas Hoy',
    description: 'La página que buscas no existe.',
    path: '/404',
    noIndex: true,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28">
        <p className="display text-7xl md:text-8xl text-surface m-0 mb-2 [-webkit-text-stroke:1.5px_hsl(var(--foreground))]">
          404
        </p>
        <h1 className="display text-3xl md:text-4xl text-foreground m-0 mb-4">Esta página no existe</h1>
        <p className="text-muted-foreground max-w-md m-0 mb-8">
          Puede que el enlace esté mal escrito o que la página se haya movido.
        </p>
        <Link to="/" className="pill pill-ink">
          Ir a la portada
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
