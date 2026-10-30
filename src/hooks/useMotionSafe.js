import { useReducedMotion } from 'framer-motion';

export function useMotionSafe() {
  const prefersReduced = useReducedMotion();
  return {
    prefersReduced: Boolean(prefersReduced),
    fadeUp: prefersReduced
      ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
  };
}
