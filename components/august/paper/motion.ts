'use client';

import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';

// PAPER TRAIL motion grammar. One orchestrated load per page, then quiet
// whileInView reveals. Transform + opacity only, nothing loops, and every
// curve is the same printed-page ease. Reduced motion renders final state:
// gate with useReducedMotion in the consuming component, not here.

export const PAPER_EASE = [0.22, 1, 0.36, 1] as const;

// Bottom-only margin: the reveal fires 60px before the element clears the
// fold. Never use the '-60px' shorthand here; shrinking the observation
// root on all four sides can keep IntersectionObserver from ever firing on
// short or very tall viewports.
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -60px 0px' } as const;

// No animation is load-bearing (spec, Motion). whileInView depends on
// IntersectionObserver, which never fires in some environments (full-page
// captures that render beyond the viewport without scrolling, odd embeds).
// This failsafe returns 'show' once the page load choreography window has
// passed, so every orchestrator that also passes animate={failsafe} settles
// to its printed final state no matter what. Pass the return value straight
// to the `animate` prop next to whileInView="show": undefined until the
// deadline, then 'show'.
export function useRevealFailsafe(timeoutMs = 1200): 'show' | undefined {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setExpired(true), timeoutMs);
    return () => window.clearTimeout(id);
  }, [timeoutMs]);
  return expired ? 'show' : undefined;
}

// Ledger rows post top-down with a 60-90ms stagger, capped so long ledgers
// (the housing register, the receipt tape) do not take seconds to settle.
export function ledgerDelay(index: number, step = 0.08): number {
  return Math.min(index * step, 0.5);
}

// Rules draw scaleX from the left. Pair with `origin-left` (or
// style={{ transformOrigin: 'left' }}) on the motion element.
export const ruleDrawVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: PAPER_EASE } },
};

// Default rise for sheet content, ledger rows, and briefs.
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PAPER_EASE } },
};

// Stamps land LAST in their group: slightly large and under-rotated, then
// pressed to rest. Give the stamp a delay after its siblings.
export const stampLandVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06, rotate: -1 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: -3,
    transition: { duration: 0.35, ease: PAPER_EASE },
  },
};

// Parent orchestration container: use with initial="hidden"
// whileInView="show" viewport={VIEWPORT_ONCE} and children that carry
// variants (riseVariants, ruleDrawVariants, BallotOval animate="parent").
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}
