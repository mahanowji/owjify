import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { formatNumber, toPersianDigits } from '../../utils/formatters';
import { useMotionSafe } from '../../hooks/useMotionSafe';

export default function AnimatedCounter({ value = 100, suffix = '', decimals = 0, duration = 1200 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const { lang } = useLanguage();
  const { prefersReduced } = useMotionSafe();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReduced) {
      setDisplay(value);
      return undefined;
    }

    let rafId;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;
      setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, duration, decimals, prefersReduced]);

  const formatted =
    decimals > 0
      ? lang === 'fa'
        ? toPersianDigits(Number(display).toFixed(decimals))
        : Number(display).toFixed(decimals)
      : formatNumber(display, lang);

  const localSuffix = lang === 'fa' ? toPersianDigits(suffix) : suffix;

  return (
    <span ref={ref}>
      {formatted}
      {localSuffix}
    </span>
  );
}
