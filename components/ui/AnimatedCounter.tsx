'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';

export interface AnimatedCounterProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

// In-view counting number used for both the hub big stats / hook chips and the
// per-measure detail hero + key-fact chips. Single source so hub and detail
// never drift. Honors prefers-reduced-motion by snapping straight to the final
// value and skipping the count-up animation entirely.
export function AnimatedCounter({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.8,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(
    mv,
    (v) => prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
  );
  const [disp, setDisp] = useState(prefix + (0).toFixed(decimals) + suffix);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const finalValue =
      prefix + end.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    if (reduceMotion) {
      setDisp(finalValue);
      return;
    }
    const controls = animate(mv, end, { duration, ease: [0.25, 0.46, 0.45, 0.94] });
    const unsub = rounded.on('change', (v) => setDisp(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, end, duration, mv, rounded, reduceMotion, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {disp}
    </span>
  );
}

export default AnimatedCounter;
