import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─── SectionHeader — título de sección + «Ver todas →» ──
   Es la cabecera de cada bloque de la portada: titular grande a la izquierda
   y, opcionalmente, el enlace subrayado a la derecha. `as` permite bajar a h3
   dentro de una tarjeta (Tendencias) sin saltarse niveles. */
type HeaderProps = {
  children: ReactNode;
  to?: string;
  linkLabel?: string;
  as?: 'h2' | 'h3';
  size?: 'lg' | 'md';
  className?: string;
};

export function SectionHeader({
  children,
  to,
  linkLabel = 'Ver todas',
  as: Tag = 'h2',
  size = 'lg',
  className = '',
}: HeaderProps) {
  const sizeClass = size === 'lg' ? 'text-[1.75rem] md:text-[2.125rem]' : 'text-2xl';
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <Tag className={`display ${sizeClass} text-foreground m-0`}>{children}</Tag>
      {to && (
        <Link to={to} className="link-more shrink-0 pb-1">
          {linkLabel}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/* ─── Reveal — entrada fade-up ────────────────────────
   La primitiva de entrada por defecto. Corta y sin desenfoque: en una
   portada con treinta piezas, un blur por pieza se vuelve niebla. */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 20, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
