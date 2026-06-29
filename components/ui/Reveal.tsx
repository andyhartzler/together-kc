'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Shared fade-up-on-scroll variant. The same easing curve and timing used across
// the hub so detail pages feel identical in rhythm. Spread onto any motion
// element, or use the Reveal wrapper below.
export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
} as const;

export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={fadeUp.initial}
      whileInView={fadeUp.whileInView}
      viewport={fadeUp.viewport}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
