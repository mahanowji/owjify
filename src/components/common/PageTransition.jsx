import { motion } from 'framer-motion';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export default function PageTransition({ children }) {
  const { prefersReduced } = useMotionSafe();

  if (prefersReduced) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
