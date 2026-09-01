import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';

/* ─── Eyebrow — kicker editorial sobre el titular de sección ──
   Versalitas celestes con un filete corto delante: es la firma tipográfica
   de la edición. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="kicker flex items-center gap-3 m-0 mb-4">
      <span className="h-[2px] w-8 bg-accent" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ─── Reveal — entrada fade-up + desenfoque que se resuelve ──
   Es la primitiva de entrada por defecto del sistema. */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 32, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.65, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
