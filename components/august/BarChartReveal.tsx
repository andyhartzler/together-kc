'use client';

import { motion } from 'framer-motion';
import { accentInk, withAlpha } from '@/components/august/accent';
import { PAPER_EASE, ledgerDelay } from '@/components/august/paper';
import {
  PrintedCounter,
  VIEWPORT_REVEAL,
  usePaperEntrance,
} from '@/components/august/signatures/entrance';

export interface BarChartRow {
  label: string;
  value: number;
}

export interface BarChartRevealProps {
  /** Optional title shown above the bars (e.g. "Projected Water CIP, FY2027 to FY2031"). */
  heading?: string;
  /** The breakdown rows. Rendered in the order given (no reordering, for honesty). */
  rows: BarChartRow[];
  /** Optional sum of the rows. When present, a prominent total line is shown beneath the bars. */
  total?: number;
  /** Optional "what this question authorizes" figure. Renders a highlighted callout vs the total. */
  asking?: number;
  /** Per-measure accent swatch hex (from measure.accent.swatch). Drives bar fill + tint. */
  accent: string;
  /** Optional supporting caption under the heading. */
  caption?: string;
  /** How to format the numbers. Currency uses compact $XM / $X.XB. Defaults to currency. */
  unit?: 'currency' | 'plain';
}

interface CounterParts {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
}

// Compact currency: $1.2B, $737M, $22M, $7M. Plain numbers fall through to commas.
function compactParts(n: number, unit: 'currency' | 'plain'): CounterParts {
  if (unit !== 'currency') {
    return { prefix: '', value: n, decimals: 0, suffix: '' };
  }
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return { prefix: '$', value: n / 1_000_000_000, decimals: 1, suffix: 'B' };
  if (abs >= 1_000_000) {
    // Preserve an exact tenth of a million (e.g. $20.8M, $40.6M) rather than
    // rounding it away; arbitrary CIP figures still read cleanly as whole $M.
    const exactTenth = n % 1_000_000 !== 0 && n % 100_000 === 0;
    return exactTenth
      ? { prefix: '$', value: Number((n / 1_000_000).toFixed(1)), decimals: 1, suffix: 'M' }
      : { prefix: '$', value: Math.round(n / 1_000_000), decimals: 0, suffix: 'M' };
  }
  if (abs >= 1_000) return { prefix: '$', value: Math.round(n / 1_000), decimals: 0, suffix: 'K' };
  return { prefix: '$', value: n, decimals: 0, suffix: '' };
}

// Static string form, used for the screen-reader summary.
function formatCompact(n: number, unit: 'currency' | 'plain'): string {
  if (unit !== 'currency') return n.toLocaleString('en-US');
  const p = compactParts(n, unit);
  return `${p.prefix}${p.value.toFixed(p.decimals)}${p.suffix}`;
}

// PAPER TRAIL restyle: a ruled ledger with flat printed bars. Each row is
// "label ..... figure" over a square-ended accent bar on a hairline track.
// The total prints under the double rule; the "this question authorizes"
// callout is a ruled inset with a flat progress rule, not a tinted card.
export default function BarChartReveal({
  heading,
  rows,
  total,
  asking,
  accent,
  caption,
  unit = 'currency',
}: BarChartRevealProps) {
  const animate = usePaperEntrance();
  const inks = accentInk(accent);

  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
  const askingPct = total && total > 0 ? Math.min((asking ?? 0) / total, 1) * 100 : 100;

  // Text alternative. Numbers are also readable as real text in the visible
  // rows; this gives a screen reader the overall framing in one pass.
  const largest = rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0]);
  const ariaSummary = [
    heading ?? 'Breakdown',
    `${rows.length} categories`,
    total != null ? `totaling ${formatCompact(total, unit)}` : null,
    largest ? `largest is ${largest.label} at ${formatCompact(largest.value, unit)}` : null,
    asking != null ? `this question authorizes ${formatCompact(asking, unit)}` : null,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <figure aria-label={ariaSummary} className="not-prose m-0 w-full">
      {(heading || caption) && (
        <figcaption className="mb-6">
          {heading && (
            <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
              <span
                aria-hidden="true"
                className="inline-block h-[3px] w-6 shrink-0"
                style={{ backgroundColor: inks.field }}
              />
              {heading}
            </h3>
          )}
          {caption && <p className="type-fine mt-2 max-w-prose">{caption}</p>}
        </figcaption>
      )}

      {/* Ledger rows with flat bars */}
      <ul role="list" className="flex flex-col">
        {rows.map((row, i) => {
          const pct = (row.value / max) * 100;
          const parts = compactParts(row.value, unit);
          return (
            <motion.li
              key={row.label}
              initial={animate ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.5, ease: PAPER_EASE, delay: animate ? ledgerDelay(i) : 0 }}
              className="rule-hair py-3 first:border-t-0 first:pt-0 sm:py-3.5"
            >
              <div className="flex flex-wrap items-end gap-2">
                <span className="min-w-0 text-[0.9375rem] font-medium leading-tight text-ink">
                  {row.label}
                </span>
                <span aria-hidden="true" className="leader" />
                <span className="shrink-0 whitespace-nowrap text-[1.0625rem] font-bold text-ink tabular-nums">
                  <PrintedCounter
                    end={parts.value}
                    decimals={parts.decimals}
                    prefix={parts.prefix}
                    suffix={parts.suffix}
                    duration={1.4}
                  />
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-2 h-2.5 w-full"
                style={{ backgroundColor: withAlpha(inks.field, 0.12) }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    minWidth: '0.5rem',
                    transformOrigin: 'left center',
                    backgroundColor: inks.field,
                  }}
                  initial={animate ? { scaleX: 0 } : false}
                  whileInView={{ scaleX: 1 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.8, delay: animate ? ledgerDelay(i) + 0.1 : 0, ease: PAPER_EASE }}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>

      {/* Total under the double rule */}
      {total != null && (
        <div className="mt-5">
          <span aria-hidden="true" className="rule-total block" />
          <div className="flex flex-wrap items-end gap-2 pt-2">
            <span className="type-doc-label-lg min-w-0 text-ink">Total projected need</span>
            <span aria-hidden="true" className="leader" />
            <span className="shrink-0 whitespace-nowrap text-xl font-extrabold text-ink tabular-nums sm:text-2xl">
              <PrintedCounter
                end={compactParts(total, unit).value}
                decimals={compactParts(total, unit).decimals}
                prefix={compactParts(total, unit).prefix}
                suffix={compactParts(total, unit).suffix}
                duration={1.8}
              />
            </span>
          </div>
        </div>
      )}

      {/* "This question authorizes" ruled inset */}
      {asking != null && (
        <motion.div
          initial={animate ? { opacity: 0, y: 12 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REVEAL}
          transition={{ duration: 0.5, delay: animate ? 0.15 : 0, ease: PAPER_EASE }}
          className="mt-6 border-l-[3px] py-1 pl-4 sm:pl-5"
          style={{ borderColor: inks.field }}
        >
          <p className="text-sm font-semibold leading-snug text-ink sm:text-base">
            This question authorizes{' '}
            <span className="font-extrabold tabular-nums" style={{ color: inks.inkOnPaper }}>
              <PrintedCounter
                end={compactParts(asking, unit).value}
                decimals={compactParts(asking, unit).decimals}
                prefix={compactParts(asking, unit).prefix}
                suffix={compactParts(asking, unit).suffix}
                duration={1.6}
              />
            </span>
            {total != null && (
              <span className="font-medium text-ink-soft">
                {' '}
                of the {formatCompact(total, unit)} in projected needs.
              </span>
            )}
          </p>
          {total != null && (
            <div
              aria-hidden="true"
              className="mt-3 h-1.5 w-full"
              style={{ backgroundColor: withAlpha(inks.field, 0.14) }}
            >
              <motion.div
                className="h-full"
                style={{ width: `${askingPct}%`, transformOrigin: 'left center', backgroundColor: inks.field }}
                initial={animate ? { scaleX: 0 } : false}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT_REVEAL}
                transition={{ duration: 0.9, delay: animate ? 0.3 : 0, ease: PAPER_EASE }}
              />
            </div>
          )}
        </motion.div>
      )}
    </figure>
  );
}
