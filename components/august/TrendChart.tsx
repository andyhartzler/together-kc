'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { onAccent } from '@/components/august/accent';

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

// Darken a hex toward black by a fraction. Used for the bottom of each column so
// the bars read as a solid gradient rather than a flat block.
function darken(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return hex;
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r}, ${g}, ${b})`;
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
 * TrendChart
 *
 * Vertical animated column chart for a fiscal-year time series (CCED sales-tax
 * revenue, or optional bond issuance by series). Columns rise from the baseline
 * (scaleY 0 to 1, origin bottom) staggered on scroll-in, with year labels on the
 * x-axis, compact value callouts, and an optional running total that counts up.
 * Honors prefers-reduced-motion by rendering every column at full height with no
 * stagger, and ships an aria-label plus a visually hidden exact-value list so the
 * numbers are fully readable as text.
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

  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const showTotal = typeof total === 'number' && total > 0;

  // Cap the tallest column below the plot ceiling so its value callout has room.
  const MAX_HEIGHT_PCT = 82;

  const accentText = onAccent(accent);
  const barFill = `linear-gradient(180deg, ${accent} 0%, ${darken(accent, 0.32)} 100%)`;

  // Running total figure. Billions vs millions so a bond series total reads well
  // even though the CCED total lands near $99M.
  const totalInBillions = showTotal && total >= 1_000_000_000;
  const totalEnd = showTotal ? (totalInBillions ? total / 1_000_000_000 : total / 1_000_000) : 0;
  const totalSuffix = totalInBillions ? 'B' : 'M';
  const totalDecimals = 1;

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
    <motion.figure
      aria-label={ariaLabel}
      {...(reduce ? {} : fadeUp)}
      transition={reduce ? undefined : { duration: 0.6, ease: EASE }}
      className={cn(
        'rounded-3xl border border-gray-100 bg-white p-6 sm:p-8',
        'shadow-[0_12px_30px_-16px_rgba(30,58,95,0.18)]',
        className
      )}
    >
      {/* Header: heading + caption on the left, running total chip on the right */}
      {(heading || caption || showTotal) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {heading && (
              <figcaption className="text-lg sm:text-xl font-bold text-navy leading-snug">
                {heading}
              </figcaption>
            )}
            {caption && (
              <p className="mt-1.5 max-w-prose text-sm text-gray-600 leading-relaxed">
                {caption}
              </p>
            )}
          </div>

          {showTotal && (
            <div
              className="flex shrink-0 items-center gap-2.5 self-start rounded-full px-4 py-2 shadow-sm"
              style={{ backgroundColor: accent, color: accentText }}
            >
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-80">
                Total
              </span>
              <span className="text-base font-bold tabular-nums">
                <AnimatedCounter
                  end={totalEnd}
                  decimals={totalDecimals}
                  prefix="$"
                  suffix={totalSuffix}
                />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Plot. Decorative: the exact values live in the screen-reader list below. */}
      <div className="mt-7" aria-hidden="true">
        <div
          className="relative h-56 w-full sm:h-64"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to top, rgba(30,58,95,0.06) 0, rgba(30,58,95,0.06) 1px, transparent 1px, transparent 25%)',
          }}
        >
          <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2.5">
            {points.map((p, i) => {
              const heightPct = (p.value / max) * MAX_HEIGHT_PCT;
              return (
                <div
                  key={`${p.label}-${i}`}
                  className="group/col relative flex h-full flex-1 flex-col items-center justify-end"
                >
                  <motion.span
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={reduce ? undefined : { once: true, margin: '-60px' }}
                    transition={reduce ? undefined : { duration: 0.4, delay: i * 0.08 + 0.35, ease: EASE }}
                    className="mb-1.5 hidden whitespace-nowrap text-[0.6rem] font-bold text-navy tabular-nums sm:block sm:text-[0.7rem]"
                  >
                    {compactUSD(p.value)}
                  </motion.span>
                  <motion.div
                    initial={reduce ? false : { scaleY: 0 }}
                    whileInView={reduce ? undefined : { scaleY: 1 }}
                    viewport={reduce ? undefined : { once: true, margin: '-60px' }}
                    transition={reduce ? undefined : { duration: 0.7, delay: i * 0.08, ease: EASE }}
                    style={{
                      height: `${heightPct}%`,
                      transformOrigin: 'bottom',
                      backgroundImage: barFill,
                      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.28)',
                    }}
                    className="w-full max-w-[2.75rem] rounded-t-[5px] transition-[filter] duration-200 group-hover/col:brightness-110 motion-reduce:transition-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Baseline (x-axis) */}
        <div className="h-px w-full bg-navy/15" />

        {/* Year / series x-axis labels, aligned to the columns above */}
        <div className="mt-2 flex gap-1.5 sm:gap-2.5">
          {points.map((p, i) => (
            <div
              key={`label-${p.label}-${i}`}
              className="flex-1 whitespace-nowrap text-center text-[0.6rem] font-semibold text-gray-500 tabular-nums sm:text-xs"
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* Text alternative: exact figures for assistive tech and copy/paste. */}
      <ul className="sr-only">
        {points.map((p, i) => (
          <li key={`sr-${p.label}-${i}`}>
            {p.label}: {fullUSD(p.value)}
          </li>
        ))}
        {showTotal && <li>Total: {fullUSD(total)}</li>}
      </ul>
    </motion.figure>
  );
}

export default TrendChart;
