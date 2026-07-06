'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PAPER_EASE, VIEWPORT_ONCE, useRevealFailsafe } from './motion';

// Stamp: pressed-ink rubber stamp. Double border in the stamp ink, 3px
// radius, rotated -3deg, uppercase w800, mix-blend-multiply so it sits INTO
// the paper. Budget: max ONE stamp per viewport. `land` animates the
// spec's landing (slightly large and under-rotated, pressed to rest) on
// scroll; stamps land LAST in their group, so pass a `delay` after the
// siblings have posted. For parent-orchestrated groups leave land=false and
// wrap in a motion element with stampLandVariants from './motion'.

const SIZE = {
  sm: 'px-2.5 py-1 text-[0.6875rem]',
  md: 'px-3.5 py-1.5 text-[0.8125rem]',
  lg: 'px-5 py-2 text-base',
} as const;

export interface StampProps {
  children: ReactNode;
  /** Stamp ink. Default coral-press #c62828 (AA-adjacent pressed coral). */
  ink?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Final rotation in degrees. Default -3. */
  rotate?: number;
  /** Animate the landing whileInView (once). Reduced motion renders landed. */
  land?: boolean;
  /** Landing delay in seconds; stamps land last in their group. */
  delay?: number;
  className?: string;
}

export function Stamp({
  children,
  ink = '#c62828',
  size = 'md',
  rotate = -3,
  land = false,
  delay = 0,
  className,
}: StampProps) {
  const reduce = useReducedMotion();
  // Lands the stamp after the load window even if IntersectionObserver
  // never fires (no animation is load-bearing).
  const failsafe = useRevealFailsafe();

  const classes = cn(
    'inline-block rounded-[3px] font-extrabold uppercase tracking-[0.18em] leading-tight',
    'mix-blend-multiply',
    SIZE[size],
    className
  );
  const style = {
    color: ink,
    border: `3px double ${ink}`,
    opacity: 0.92,
  } as const;

  if (!land || reduce) {
    return (
      <span className={classes} style={{ ...style, transform: `rotate(${rotate}deg)` }}>
        {children}
      </span>
    );
  }

  const landVariants: Variants = {
    hidden: { opacity: 0, scale: 1.06, rotate: rotate + 2 },
    show: {
      opacity: 0.92,
      scale: 1,
      rotate,
      transition: { duration: 0.35, ease: PAPER_EASE, delay },
    },
  };

  return (
    <motion.span
      className={classes}
      style={{ color: ink, border: `3px double ${ink}` }}
      variants={landVariants}
      initial="hidden"
      animate={failsafe}
      whileInView="show"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.span>
  );
}

export default Stamp;
