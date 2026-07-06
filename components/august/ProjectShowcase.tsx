'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { accentInk } from '@/components/august/accent';
import { PAPER_EASE, VIEWPORT_ONCE, ledgerDelay } from '@/components/august/paper';
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

// PAPER TRAIL restyle: a true ruled register. One component still serves
// three jobs (housing Trust Fund completions, CCED East Side projects, sewer
// SRF docket entries) but as ledger rows on paper: name in w700 ink with the
// detail as fine print beneath, the meta figure leader-dotted to the right,
// hairlines between rows, and the footer total printed under the double
// rule. Rows post top-down with the capped ledger stagger; reduced motion
// renders the register fully posted.
export default function ProjectShowcase({
  heading,
  items,
  accent,
  footer,
  className,
}: ProjectShowcaseProps) {
  const reduce = useReducedMotion();
  const inks = accentInk(accent);

  return (
    <section className={cn('w-full', className)}>
      {heading ? (
        <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:mb-6 sm:text-xl">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-6 shrink-0"
            style={{ backgroundColor: inks.field }}
          />
          {heading}
        </h3>
      ) : null}

      <ul className="m-0 list-none p-0">
        {items.map((item, i) => (
          <motion.li
            key={`${item.name}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.45, delay: reduce ? 0 : ledgerDelay(i, 0.07), ease: PAPER_EASE }}
            className="rule-hair py-3 first:border-t-0 first:pt-0 sm:py-3.5"
          >
            <div className="flex items-end gap-2">
              <span className="min-w-0 text-[0.9375rem] font-bold leading-snug text-ink sm:text-base">
                {item.name}
              </span>
              {item.meta ? (
                <>
                  <span aria-hidden="true" className="leader" />
                  <span
                    className="shrink-0 whitespace-nowrap text-[0.9375rem] font-bold tabular-nums sm:text-[1.0625rem]"
                    style={{ color: inks.inkOnPaper }}
                  >
                    {item.meta}
                  </span>
                </>
              ) : null}
            </div>
            <p className="type-fine mt-1 max-w-prose">{item.detail}</p>
          </motion.li>
        ))}
      </ul>

      {footer ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.5, delay: reduce ? 0 : 0.15, ease: PAPER_EASE }}
          className="mt-5"
        >
          <span aria-hidden="true" className="rule-total block" />
          <div className="flex items-end gap-2 pt-2">
            <span className="type-doc-label-lg min-w-0 text-ink">{footer.label}</span>
            <span aria-hidden="true" className="leader" />
            <span className="shrink-0 whitespace-nowrap text-2xl font-extrabold text-ink tabular-nums sm:text-3xl">
              <AnimatedCounter end={footer.value} />
            </span>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
