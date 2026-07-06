'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PAPER_EASE, VIEWPORT_ONCE, useRevealFailsafe } from './motion';

// BallotOval: the fill-then-check ballot oval, porting the two-phase
// animation grammar from BallotSnapshot. Phase one the ink fill sweeps in,
// phase two the check draws on via pathLength. Reduced motion (and
// animate="none") renders the final filled state.
//
// animate modes:
//   'inview'  self-triggering whileInView (once, -60px margin). Default.
//   'parent'  inherits variants ('hidden' -> 'show') from a parent motion
//             orchestrator, so a ballot sheet can stagger five ovals.
//   'none'    static final state.

const SIZE = {
  sm: { box: 'h-[19px] w-8 border-2', stroke: 3.4 },
  md: { box: 'h-[26px] w-11 border-[2.5px]', stroke: 3 },
  lg: { box: 'h-9 w-[60px] border-[3px]', stroke: 2.6 },
} as const;

export interface BallotOvalProps {
  /** Filled = coral ink + drawn check. False = empty oval (the NO oval). */
  filled?: boolean;
  /** Fill ink. Raw accent swatches are fine here (fills are fill-only). */
  fill?: string;
  /** Check stroke. Default white (graphic mark, not text). */
  checkColor?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: 'inview' | 'parent' | 'none';
  /** Seconds before the fill sweeps; the check follows 0.22s later. */
  delay?: number;
  /** Accessible label. Omitted = decorative (aria-hidden). */
  title?: string;
  className?: string;
}

export function BallotOval({
  filled = true,
  fill = '#e53935',
  checkColor = '#ffffff',
  size = 'md',
  animate = 'inview',
  delay = 0,
  title,
  className,
}: BallotOvalProps) {
  const reduce = useReducedMotion();
  // Fills self-triggering ovals after the load window even if
  // IntersectionObserver never fires (no animation is load-bearing).
  const failsafe = useRevealFailsafe();
  const { box, stroke } = SIZE[size];
  const isStatic = !filled || reduce || animate === 'none';

  const a11y = title
    ? ({ role: 'img', 'aria-label': title } as const)
    : ({ 'aria-hidden': true } as const);

  const container = cn(
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-ink',
    box,
    className
  );

  const fillVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: PAPER_EASE, delay },
    },
  };

  const checkVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: PAPER_EASE, delay: delay + 0.22 },
    },
  };

  if (isStatic) {
    return (
      <span {...a11y} className={container}>
        {filled && (
          <>
            <span className="absolute inset-0 rounded-full" style={{ backgroundColor: fill }} />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 44 26" fill="none" aria-hidden="true">
              <path
                d="M13 13.5l6.5 6L31 7"
                stroke={checkColor}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </span>
    );
  }

  const selfTrigger =
    animate === 'inview'
      ? ({ initial: 'hidden', animate: failsafe, whileInView: 'show', viewport: VIEWPORT_ONCE } as const)
      : {};

  return (
    <motion.span {...a11y} className={container} {...selfTrigger}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: fill }}
        variants={fillVariants}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 44 26" fill="none" aria-hidden="true">
        <motion.path
          d="M13 13.5l6.5 6L31 7"
          variants={checkVariants}
          stroke={checkColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
}

export default BallotOval;
