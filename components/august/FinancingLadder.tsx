'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { onAccent } from '@/components/august/accent';

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

// Darken a 6-digit hex toward black by `ratio` (0 to 1). Used for the rung
// gradient and the rail arrowhead so the accent reads with depth. No new deps:
// this is the same hand-rolled approach the rest of the section uses.
function shade(hex: string, ratio: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  const r = Math.round(((num >> 16) & 255) * (1 - ratio));
  const g = Math.round(((num >> 8) & 255) * (1 - ratio));
  const b = Math.round((num & 255) * (1 - ratio));
  return `rgb(${r}, ${g}, ${b})`;
}

// Three-rung descending ladder showing that financing gets cheaper as you go
// down: appropriation debt (highest cost) to revenue bonds (the chosen path,
// highlighted) to SRF loans (lowest cost). Rungs slide and fade in on scroll,
// a cost rail draws downward beside them, and a relative-cost dollar gauge marks
// each tier without inventing any figure. Reduced motion renders everything in
// its final, fully-legible state. The accent is per-measure; text painted on the
// accent fill uses the shared onAccent helper, which returns navy for light
// swatches (sky, golden) and white for the darker accents.
export default function FinancingLadder({ rungs, accent, heading }: FinancingLadderProps) {
  const reduce = useReducedMotion();

  // The revenue-bonds rung is what the question authorizes. Detect it from the
  // note copy, falling back to the middle rung so the highlight is robust.
  const authoredIndex = rungs.findIndex((r) => /authoriz/i.test(r.note));
  const highlightIndex = authoredIndex >= 0 ? authoredIndex : Math.floor((rungs.length - 1) / 2);

  // Light accents (sky #4a90d9, golden) read poorly under white text; the shared
  // helper returns navy on those swatches and white on the darker accents so the
  // highlighted rung's title and note clear AA on every measure.
  const accentInk = onAccent(accent);
  const accentInkFaded = accentInk === '#ffffff' ? 'rgba(255,255,255,0.4)' : 'rgba(30,58,95,0.35)';
  const navyFaded = 'rgba(30,58,95,0.22)';

  // Text alternative: the ordering and cost framing read fully as plain text.
  const summary = `Financing cost ladder. ${rungs
    .map((r) => `${r.tier}, ${r.level}`)
    .join('. ')}.`;

  return (
    <figure className="m-0" role="group" aria-label={summary}>
      {heading ? (
        <motion.h3
          initial={reduce ? false : fadeUp.initial}
          whileInView={fadeUp.whileInView}
          viewport={fadeUp.viewport}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold text-navy mb-6 sm:mb-7"
        >
          <span
            aria-hidden
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: accent }}
          />
          {heading}
        </motion.h3>
      ) : null}

      <div className="flex gap-3.5 sm:gap-5">
        {/* COST RAIL: a gradient line that draws downward into an arrowhead. */}
        <div className="flex w-6 sm:w-7 shrink-0 flex-col items-center" aria-hidden>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest leading-none mb-2"
            style={{ color: accent }}
          >
            $$$
          </span>
          <div className="relative w-[3px] flex-1 rounded-full bg-navy/[0.06] overflow-hidden">
            <motion.span
              className="absolute inset-x-0 top-0 bottom-0 origin-top rounded-full"
              style={{ background: `linear-gradient(to bottom, ${accent}, ${shade(accent, 0.45)})` }}
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </div>
          <motion.svg
            viewBox="0 0 16 12"
            className="mt-1 w-4 h-3"
            initial={reduce ? false : { opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : 0.85 }}
          >
            <path
              d="M2.5 2.5 L8 9.5 L13.5 2.5"
              fill="none"
              stroke={shade(accent, 0.4)}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest leading-none mt-2"
            style={{ color: shade(accent, 0.18) }}
          >
            $
          </span>
        </div>

        {/* RUNGS: stepped to the right and down, each one cheaper than the last. */}
        <ol
          className="flex-1 space-y-3 sm:space-y-4"
          style={{ ['--ladder-step' as string]: 'clamp(0.75rem, 4vw, 2.5rem)' } as React.CSSProperties}
        >
          {rungs.map((rung, i) => {
            const isHighlight = i === highlightIndex;
            const cost = rungs.length - i; // descending: top rung costs the most
            const filledColor = isHighlight ? accentInk : accent;
            const emptyColor = isHighlight ? accentInkFaded : navyFaded;

            return (
              <li
                key={rung.tier}
                style={{ marginInlineStart: `calc(${i} * var(--ladder-step))` }}
                className={isHighlight ? 'relative z-10' : undefined}
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: -26, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : Math.min(i * 0.13, 0.45) }}
                  whileHover={reduce ? undefined : { y: -3 }}
                  className={cn(
                    'relative overflow-hidden rounded-2xl p-4 sm:p-5 pl-5 sm:pl-6',
                    isHighlight
                      ? 'shadow-xl'
                      : 'bg-white border border-gray-100 shadow-sm shadow-navy/5'
                  )}
                  style={
                    isHighlight
                      ? {
                          background: `linear-gradient(135deg, ${accent}, ${shade(accent, 0.32)})`,
                          color: accentInk,
                          boxShadow: `0 22px 45px -20px ${accent}`,
                        }
                      : undefined
                  }
                >
                  {/* left edge marker (quiet rungs only; the highlight is fully filled) */}
                  {!isHighlight ? (
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 h-full w-1.5"
                      style={{ backgroundColor: accent, opacity: 0.85 }}
                    />
                  ) : null}

                  {isHighlight ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 mb-2.5"
                      style={{
                        backgroundColor: accentInk === '#ffffff' ? 'rgba(255,255,255,0.18)' : 'rgba(30,58,95,0.12)',
                        color: accentInk,
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      What this question authorizes
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={cn('font-bold leading-tight text-base sm:text-lg', isHighlight ? '' : 'text-navy')}>
                        {rung.tier}
                      </p>
                      <p
                        className={cn(
                          'text-sm leading-relaxed mt-1.5',
                          isHighlight ? '' : 'text-gray-600'
                        )}
                        style={isHighlight ? { color: accentInk } : undefined}
                      >
                        {rung.note}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className="inline-flex items-center rounded-full text-[0.65rem] font-bold uppercase tracking-wide px-2.5 py-1 whitespace-nowrap"
                        style={
                          isHighlight
                            ? {
                                backgroundColor:
                                  accentInk === '#ffffff' ? 'rgba(255,255,255,0.18)' : 'rgba(30,58,95,0.12)',
                                color: accentInk,
                              }
                            : { backgroundColor: `${accent}14`, color: shade(accent, 0.22) }
                        }
                      >
                        {rung.level}
                      </span>
                      {/* relative-cost gauge: filled glyphs = how costly, not a dollar figure */}
                      <span className="text-base sm:text-lg font-bold tracking-tight leading-none" aria-hidden>
                        {Array.from({ length: rungs.length }).map((_, k) => (
                          <span key={k} style={{ color: k < cost ? filledColor : emptyColor }}>
                            $
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>

      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
