'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { accentInk } from '@/components/august/accent';
import { PAPER_EASE, VIEWPORT_ONCE, ledgerDelay } from '@/components/august/paper';

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendChartProps {
  /** Optional section heading rendered above the chart. */
  heading?: string;
  /** Ordered time series. Each point is one column (e.g. a fiscal year). */
  points: TrendPoint[];
  /** Optional cumulative total. When present, a running count-up is shown. */
  total?: number;
  /** Per-measure accent swatch (hex). Drives the column fill. */
  accent: string;
  /** Optional supporting line under the heading. */
  caption?: string;
  /** Optional extra classes for the outer figure. */
  className?: string;
}

// Compact dollar label for the per-column callouts. Display only; the exact
// figures are also rendered as text in the screen-reader list below.
function compactUSD(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fullUSD(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/**
 * TrendChart, PAPER TRAIL restyle. Flat printed columns rising from a heavy
 * ink baseline over faint ruled gridlines. Square ends, solid accent fill,
 * direct value labels in navy tabular figures, and an optional ledger total
 * under the double rule. No card wrapper: it sits directly on the paper (or
 * inside whatever Sheet the caller provides). Reduced motion renders every
 * column at full height, and the exact figures ship as a visually hidden
 * text list.
 */
export function TrendChart({
  heading,
  points,
  total,
  accent,
  caption,
  className,
}: TrendChartProps) {
  const reduce = useReducedMotion();

  if (!points.length) return null;

  const inks = accentInk(accent);
  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const showTotal = typeof total === 'number' && total > 0;

  // Cap the tallest column below the plot ceiling so its value callout has room.
  const MAX_HEIGHT_PCT = 82;

  const first = points[0].label;
  const last = points[points.length - 1].label;
  const ariaLabel = [
    heading ? `${heading}.` : 'Column chart.',
    `${points.length} ${points.length === 1 ? 'period' : 'periods'} from ${first} to ${last}.`,
    showTotal ? `Total ${fullUSD(total)}.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure aria-label={ariaLabel} className={cn('m-0 w-full', className)}>
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

      {/* Plot. Decorative: the exact values live in the screen-reader list below. */}
      <div aria-hidden="true">
        <div
          className="relative h-52 w-full sm:h-64"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to top, var(--hairline) 0, var(--hairline) 1px, transparent 1px, transparent 25%)',
          }}
        >
          <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2.5">
            {points.map((p, i) => {
              const heightPct = (p.value / max) * MAX_HEIGHT_PCT;
              return (
                <div
                  key={`${p.label}-${i}`}
                  className="relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  <motion.span
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: 0.4, delay: reduce ? 0 : ledgerDelay(i) + 0.35, ease: PAPER_EASE }}
                    className="mb-1.5 hidden whitespace-nowrap text-[0.6rem] font-bold text-ink tabular-nums sm:block sm:text-[0.7rem]"
                  >
                    {compactUSD(p.value)}
                  </motion.span>
                  <motion.div
                    initial={reduce ? false : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: 0.7, delay: reduce ? 0 : ledgerDelay(i), ease: PAPER_EASE }}
                    style={{
                      height: `${heightPct}%`,
                      transformOrigin: 'bottom',
                      backgroundColor: inks.field,
                    }}
                    className="w-full max-w-[2.75rem]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Heavy ink baseline (x-axis) */}
        <div className="rule-heavy" />

        {/* Year / series x-axis labels, aligned to the columns above */}
        <div className="mt-2 flex gap-1.5 sm:gap-2.5">
          {points.map((p, i) => (
            <div
              key={`label-${p.label}-${i}`}
              className="type-doc-label flex-1 whitespace-nowrap text-center text-ink-soft tabular-nums"
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* Ledger total under the double rule */}
      {showTotal && (
        <div className="mt-6" aria-hidden="true">
          <span className="rule-total block" />
          <div className="flex items-end gap-2 pt-2">
            <span className="type-doc-label-lg min-w-0 text-ink">Total collected</span>
            <span className="leader" />
            <span
              className="shrink-0 whitespace-nowrap text-xl font-extrabold tabular-nums sm:text-2xl"
              style={{ color: inks.inkOnPaper }}
            >
              <AnimatedCounter end={total} prefix="$" />
            </span>
          </div>
        </div>
      )}

      {/* Text alternative: exact figures for assistive tech and copy/paste. */}
      <ul className="sr-only">
        {points.map((p, i) => (
          <li key={`sr-${p.label}-${i}`}>
            {p.label}: {fullUSD(p.value)}
          </li>
        ))}
        {showTotal && <li>Total: {fullUSD(total)}</li>}
      </ul>
    </figure>
  );
}

export default TrendChart;
