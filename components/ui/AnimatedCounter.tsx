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

// Format once, in one place, so the server string and every animated frame are
// produced by identical code.
function format(value: number, decimals: number, prefix: string, suffix: string) {
  return prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
}

// In-view counting number used for both the hub big stats / hook chips and the
// per-measure detail hero + key-fact chips. Single source so hub and detail
// never drift. Honors prefers-reduced-motion by snapping straight to the final
// value and skipping the count-up animation entirely.
//
// The rendered state is SEEDED WITH THE FINAL VALUE, not with zero. That is
// load-bearing on the victory page: every headline result there is a counter,
// and seeding with zero meant the prerendered HTML said "0.0%" on all five
// questions and "0 / 5 ballot questions passed". Crawlers, link-preview
// scrapers, reader modes, screen readers before scroll, and JS-off visitors all
// read that static HTML. Server and client now render the same true value, so
// hydration matches; the count-up drops the motion value back to zero and
// animates up only after mount, once the element scrolls into view.
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
  const mv = useMotionValue(end);
  const rounded = useTransform(mv, (v) => format(v, decimals, prefix, suffix));
  const [disp, setDisp] = useState(() => format(end, decimals, prefix, suffix));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion needs no work at all now: the rendered state is already
    // the final value, and the count-up path restores it on cleanup.
    if (!inView || reduceMotion) return;
    const finalValue = format(end, decimals, prefix, suffix);
    // Post-mount only: rewind to zero, then count up to the real value.
    mv.set(0);
    const unsub = rounded.on('change', (v) => setDisp(v));
    const controls = animate(mv, end, { duration, ease: [0.25, 0.46, 0.45, 0.94] });
    return () => {
      controls.stop();
      unsub();
      setDisp(finalValue);
    };
  }, [inView, end, duration, mv, rounded, reduceMotion, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {disp}
    </span>
  );
}

export default AnimatedCounter;
