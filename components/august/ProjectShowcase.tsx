'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';

export interface ProjectShowcaseItem {
  name: string;
  meta?: string;
  detail: string;
}

export interface ProjectShowcaseProps {
  heading?: string;
  items: ProjectShowcaseItem[];
  /** Per-measure accent hex (measure.accent.swatch). Never hardcode a measure color here. */
  accent: string;
  footer?: { label: string; value: number };
  className?: string;
}

// Staggered, responsive grid of real project cards. One component serves three
// jobs: housing Trust Fund completions, CCED East Side projects, and sewer SRF
// applications. Every value shown is plain text, so the grid is fully legible
// without motion or color. The accent is always a prop (the golden swatch flips
// to navy text on filled surfaces, mirroring onSwatchText in MeasureDetail).
export default function ProjectShowcase({
  heading,
  items,
  accent,
  footer,
  className,
}: ProjectShowcaseProps) {
  const reduce = useReducedMotion();

  // Golden (#f5a623) is too light under white and too pale as text on white.
  const isGolden = accent.trim().toLowerCase() === '#f5a623';
  const onAccentText = isGolden ? '#1e3a5f' : '#ffffff'; // text painted ON the accent fill
  const accentInk = isGolden ? '#9a6b0f' : accent; // accent-colored text on a light surface

  const gridLines =
    'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)';

  return (
    <section className={cn('w-full', className)}>
      {heading ? (
        <motion.div
          initial={reduce ? false : fadeUp.initial}
          whileInView={reduce ? undefined : fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={reduce ? undefined : { duration: 0.5, ease: EASE }}
          className="mb-6 sm:mb-8 flex items-center gap-2.5"
        >
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
          <h3 className="text-xl sm:text-2xl font-bold text-navy leading-snug">{heading}</h3>
        </motion.div>
      ) : null}

      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.li
            key={`${item.name}-${i}`}
            initial={reduce ? false : fadeUp.initial}
            whileInView={reduce ? undefined : fadeUp.whileInView}
            viewport={fadeUp.viewport}
            transition={
              reduce ? undefined : { duration: 0.5, delay: Math.min(i, 8) * 0.06, ease: EASE }
            }
            whileHover={reduce ? undefined : { y: -5, boxShadow: `0 26px 50px -22px ${accent}66` }}
            style={{ boxShadow: '0 10px 30px -20px rgba(30,58,95,0.25)' }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none"
          >
            {/* left accent rail (decorative) */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1"
              style={{ backgroundColor: accent }}
            />
            {/* soft accent glow, warms on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.16] motion-reduce:transition-none"
              style={{ backgroundColor: accent }}
            />

            <div className="relative flex h-full flex-col p-6 pl-7">
              <div className="flex items-start justify-between gap-3">
                <h4 className="flex-1 text-lg font-bold leading-snug text-navy">{item.name}</h4>
                {item.meta ? (
                  <span
                    className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ backgroundColor: `${accent}14`, color: accentInk }}
                  >
                    {item.meta}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.detail}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      {footer ? (
        <motion.div
          initial={reduce ? false : fadeUp.initial}
          whileInView={reduce ? undefined : fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={reduce ? undefined : { duration: 0.55, delay: 0.1, ease: EASE }}
          className="relative mt-8 overflow-hidden rounded-2xl p-7 sm:p-8"
          style={{
            backgroundColor: accent,
            color: onAccentText,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(0,0,0,0.20))',
          }}
        >
          {/* faint grid for depth (decorative) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: gridLines, backgroundSize: '32px 32px' }}
          />
          <div className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-5xl font-bold leading-none tracking-tight sm:text-6xl">
              <AnimatedCounter end={footer.value} />
            </span>
            <span
              className="text-sm font-semibold uppercase tracking-wide sm:text-base"
              style={{ opacity: 0.85 }}
            >
              {footer.label}
            </span>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
