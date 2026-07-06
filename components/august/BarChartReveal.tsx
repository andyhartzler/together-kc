'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { onAccent, inkOnWhite } from '@/components/august/accent';

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

// ---------------------------------------------------------------------------
// Tiny inline formatting + color helpers (no new dependency, by design).
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) => Math.round(c * (1 - amount));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
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

// ---------------------------------------------------------------------------

export default function BarChartReveal({
  heading,
  rows,
  total,
  asking,
  accent,
  caption,
  unit = 'currency',
}: BarChartRevealProps) {
  const reduceMotion = useReducedMotion();

  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;

  const fillGradient = `linear-gradient(90deg, ${accent} 0%, ${darken(accent, 0.32)} 100%)`;

  const askingPct = total && total > 0 ? Math.min((asking ?? 0) / total, 1) * 100 : 100;

  // Text alternative. Numbers are also readable as real text in the visible rows;
  // this gives a screen reader the overall framing in one pass.
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
    <motion.figure
      {...(reduceMotion ? {} : fadeUp)}
      transition={reduceMotion ? undefined : { duration: 0.6, ease: EASE }}
      aria-label={ariaSummary}
      className="not-prose w-full"
    >
      {/* Header */}
      {(heading || caption) && (
        <figcaption className="mb-6">
          {heading && (
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <h3 className="text-lg sm:text-xl font-bold text-navy leading-snug">{heading}</h3>
            </div>
          )}
          {caption && (
            <p className="mt-2 pl-[1.25rem] text-sm text-gray-600 leading-relaxed">{caption}</p>
          )}
        </figcaption>
      )}

      {/* Bars */}
      <ul role="list" className="flex flex-col gap-5">
        {rows.map((row, i) => {
          const pct = (row.value / max) * 100;
          const parts = compactParts(row.value, unit);
          return (
            <li key={row.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm sm:text-[0.95rem] font-medium text-navy/85 leading-tight">
                  {row.label}
                </span>
                <span className="shrink-0 text-base sm:text-lg font-bold text-navy tabular-nums">
                  <AnimatedCounter
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
                className="mt-2 h-3 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: withAlpha(accent, 0.1) }}
              >
                <motion.div
                  className="relative h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    minWidth: '0.75rem',
                    transformOrigin: 'left center',
                    background: fillGradient,
                  }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, delay: i * 0.09, ease: EASE }}
                >
                  {/* soft top sheen for depth */}
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.28), transparent)' }}
                  />
                </motion.div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Total */}
      {total != null && (
        <div
          className="mt-6 flex items-baseline justify-between gap-4 border-t pt-4"
          style={{ borderColor: withAlpha(accent, 0.18) }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-navy/60">
            Total projected need
          </span>
          <span className="text-xl sm:text-2xl font-bold text-navy tabular-nums">
            <AnimatedCounter
              end={compactParts(total, unit).value}
              decimals={compactParts(total, unit).decimals}
              prefix={compactParts(total, unit).prefix}
              suffix={compactParts(total, unit).suffix}
              duration={1.8}
            />
          </span>
        </div>
      )}

      {/* "This question authorizes" highlight */}
      {asking != null && (
        <motion.div
          {...(reduceMotion ? {} : fadeUp)}
          transition={reduceMotion ? undefined : { duration: 0.55, delay: 0.1, ease: EASE }}
          className="mt-5 rounded-2xl p-4 sm:p-5"
          style={{
            backgroundColor: withAlpha(accent, 0.08),
            border: `1px solid ${withAlpha(accent, 0.22)}`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: accent, color: onAccent(accent) }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-sm sm:text-base font-semibold text-navy leading-snug">
              This question authorizes{' '}
              <span className="font-bold tabular-nums" style={{ color: inkOnWhite(accent) }}>
                <AnimatedCounter
                  end={compactParts(asking, unit).value}
                  decimals={compactParts(asking, unit).decimals}
                  prefix={compactParts(asking, unit).prefix}
                  suffix={compactParts(asking, unit).suffix}
                  duration={1.6}
                />
              </span>
              {total != null && (
                <span className="font-medium text-navy/70">
                  {' '}
                  of the {formatCompact(total, unit)} in projected needs.
                </span>
              )}
            </p>
          </div>
          {total != null && (
            <div
              aria-hidden="true"
              className="mt-3 h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: withAlpha(accent, 0.14) }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${askingPct}%`, transformOrigin: 'left center', backgroundColor: accent }}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1, delay: 0.25, ease: EASE }}
              />
            </div>
          )}
        </motion.div>
      )}
    </motion.figure>
  );
}
