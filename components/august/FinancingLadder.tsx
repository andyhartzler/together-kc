'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { accentInk } from '@/components/august/accent';
import { PAPER_EASE, ledgerDelay } from '@/components/august/paper';
import {
  VIEWPORT_REVEAL,
  usePaperEntrance,
} from '@/components/august/signatures/entrance';

export interface FinancingLadderRung {
  tier: string;
  level: string;
  note: string;
}

export interface FinancingLadderProps {
  rungs: FinancingLadderRung[];
  accent: string;
  heading?: string;
}

// PAPER TRAIL restyle: a three-step printed stair. Each rung is a ruled row
// stepped further right, because financing gets cheaper as you go down the
// ladder. The rung this question authorizes carries a heavy rule, a swatch
// THIS QUESTION tab, and the accent ink. Flat print: no gradients, no cards,
// no glow. Reduced motion renders every rung posted.
export default function FinancingLadder({ rungs, accent, heading }: FinancingLadderProps) {
  const animate = usePaperEntrance();
  const inks = accentInk(accent);

  // The rung this question authorizes. Detected from the note copy, falling
  // back to the middle rung so the highlight is robust.
  const authoredIndex = rungs.findIndex((r) => /authoriz/i.test(r.note));
  const highlightIndex = authoredIndex >= 0 ? authoredIndex : Math.floor((rungs.length - 1) / 2);

  // Text alternative: the ordering and cost framing read fully as plain text.
  const summary = `Financing cost ladder. ${rungs
    .map((r) => `${r.tier}, ${r.level}`)
    .join('. ')}.`;

  return (
    <figure className="m-0" role="group" aria-label={summary}>
      {heading ? (
        <h3 className="mb-6 flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:mb-7 sm:text-xl">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-6 shrink-0"
            style={{ backgroundColor: inks.field }}
          />
          {heading}
        </h3>
      ) : null}

      <ol
        className="space-y-0"
        style={{ ['--ladder-step' as string]: 'clamp(0.75rem, 5vw, 3rem)' } as React.CSSProperties}
      >
        {rungs.map((rung, i) => {
          const isHighlight = i === highlightIndex;
          return (
            <motion.li
              key={rung.tier}
              initial={animate ? { opacity: 0, y: 14 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.5, ease: PAPER_EASE, delay: animate ? ledgerDelay(i, 0.12) : 0 }}
              style={{ marginInlineStart: `calc(${i} * var(--ladder-step))` }}
              className={cn(
                'relative py-4 pr-1 sm:py-5',
                isHighlight ? 'rule-heavy' : 'rule-hair'
              )}
            >
              {isHighlight ? (
                <span
                  className="type-doc-label mb-2.5 inline-block px-3 pb-1 pt-1.5 leading-none"
                  style={{ backgroundColor: inks.field, color: inks.textOnField }}
                >
                  This question
                </span>
              ) : null}

              <div className="flex flex-wrap items-end gap-2">
                <span className="min-w-0 text-base font-extrabold leading-tight text-ink sm:text-lg">
                  {rung.tier}
                </span>
                <span aria-hidden="true" className="leader" />
                <span
                  className="type-doc-label shrink-0 whitespace-nowrap"
                  style={{ color: isHighlight ? inks.inkOnPaper : 'var(--ink-soft)' }}
                >
                  {rung.level}
                </span>
              </div>
              <p className="type-fine mt-1.5 max-w-prose">{rung.note}</p>
            </motion.li>
          );
        })}
      </ol>

      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
