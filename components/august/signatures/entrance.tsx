'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

// PAPER TRAIL entrance gate. Hard rule from the design spec: no animation is
// load-bearing. Server rendering and the hydration pass must both print every
// section in its final state, so a slow connection, a crawler, a screenshot
// harness, or a visitor with JavaScript disabled always reads a complete
// page. Entrance choreography (opacity-0 initial states, whileInView reveals,
// stamp landings, counters) only arms itself AFTER the first client mount has
// proven the motion runtime is alive, which in practice means client-side
// navigations between pages. Reduced motion always renders the final state.
//
// Consumers: `const animate = usePaperEntrance();` then gate every framer
// `initial` on it (`initial={animate ? 'hidden' : false}`) and every delay
// (`delay: animate ? x : 0`). With `initial={false}` framer renders the
// element directly in its target state and whileInView becomes a no-op.
let motionRuntimeAlive = false;

export function usePaperEntrance(): boolean {
  const reduce = useReducedMotion();
  // Read once at mount: SSR and hydration both see `false` (no mismatch);
  // pages mounted after hydration (client-side navigation) see `true`.
  const [armed] = useState(() => motionRuntimeAlive);
  useEffect(() => {
    motionRuntimeAlive = true;
  }, []);
  return armed && !reduce;
}

// A more forgiving whileInView config than the shared VIEWPORT_ONCE: only the
// bottom margin is pulled in, so tall sections near the fold cannot miss
// their trigger. Used together with the entrance gate above.
export const VIEWPORT_REVEAL = {
  once: true,
  amount: 0.01,
  margin: '0px 0px -60px 0px',
} as const;

// The exact final string AnimatedCounter settles on, printed statically.
export function printedFigure(
  end: number,
  decimals = 0,
  prefix = '',
  suffix = ''
): string {
  return prefix + end.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
}

export interface PrintedCounterProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

// Counter that is never load-bearing: it prints the final figure as static
// text unless entrance animation is armed (see usePaperEntrance), in which
// case it counts up in view like AnimatedCounter always did. AnimatedCounter
// alone renders 0 until its IntersectionObserver fires, which fails the "no
// animation is load-bearing" rule for SSR / no-JS / capture harnesses.
export function PrintedCounter({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration,
  className,
}: PrintedCounterProps) {
  const animate = usePaperEntrance();
  if (!animate) {
    return <span className={className}>{printedFigure(end, decimals, prefix, suffix)}</span>;
  }
  return (
    <AnimatedCounter
      end={end}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      duration={duration}
      className={className}
    />
  );
}
