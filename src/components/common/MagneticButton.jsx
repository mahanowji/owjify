import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export default function MagneticButton({ children, className = '', strength = 0.22, ...rest }) {
  const ref = useRef(null);
  const { prefersReduced } = useMotionSafe();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setPos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.4 }}
      style={{ display: 'inline-flex' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
