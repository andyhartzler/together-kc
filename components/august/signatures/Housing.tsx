'use client';

import { motion } from 'framer-motion';
import {
  KickerRule,
  LedgerRow,
  Sheet,
  Stamp,
  PAPER_EASE,
  ledgerDelay,
  riseVariants,
  ruleDrawVariants,
  staggerContainer,
} from '@/components/august/paper';
import { ACCENT_INKS } from '@/components/august/accent';
import type { SignatureProps } from './index';
import { PrintedCounter, VIEWPORT_REVEAL, usePaperEntrance } from './entrance';

// THE REGISTER (Question 1, coral). The housing page's signature artifact:
// the 64,000-home gap set at figure scale beside the Trust Fund sunset note,
// then the monument, a ledger sheet posting all ten completed Housing Trust
// Fund developments to a double-ruled 365-unit total, and beneath it the
// "what your YES adds" ledger with the golden-ink 4/7 supermajority stamp
// landing last. Every figure comes from the measure record; the register
// total is the constants total (365), which reconciles with the row sum.
export default function Housing({ measure, accent }: SignatureProps) {
  const animate = usePaperEntrance();
  const { completedProjects, heroStats, keyFacts } = measure;
  if (!completedProjects) return null;

  // heroStats order (constants): [0] $100M ask, [1] 64,000 gap, [2] ~$20M/yr pace.
  const askStat = heroStats[0];
  const gapStat = heroStats[1];
  const paceStat = heroStats[2];

  // Constants copy, quoted rather than restated: the shortage citation, the
  // 2022-money sunset line, and the supermajority fact.
  const gapCitation = keyFacts.find((f) => f.includes('64,000'));
  const sunsetNote = measure.faqs
    .find((f) => f.q === 'What happens if it fails?')
    ?.a.split('. ')[0];
  const supermajorityFact = keyFacts.find((f) => f.includes('four-sevenths'));

  const goldenInk = ACCENT_INKS.golden.inkOnPaper;

  // Coral double rule for the register total: the raw swatch as a fill,
  // mirroring the .rule-total construction (1px line, 3px gap, 1px line).
  const accentRuleTotal = {
    height: 5,
    backgroundImage: `linear-gradient(${accent.field}, ${accent.field}), linear-gradient(${accent.field}, ${accent.field})`,
    backgroundSize: '100% 1px, 100% 1px',
    backgroundPosition: 'top, bottom',
    backgroundRepeat: 'no-repeat',
  } as const;

  // Figures quoted from keyFacts ("more than $61 million", "roughly 3,000
  // affordable units") and heroStats (the ~$20M/yr pace line).
  const yesAddsRows = [
    { label: 'Awarded by the Trust Fund to date', figure: '$61M+', sublabel: undefined },
    { label: 'Affordable units helped to fund so far', figure: '~3,000', sublabel: undefined },
    ...(paceStat
      ? [{ label: 'Annual awards through 2032', sublabel: paceStat.label, figure: paceStat.value }]
      : []),
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ============================================================ */}
      {/* THE GAP: 64,000 at figure scale, sunset margin note, the ask  */}
      {/* ============================================================ */}
      <motion.header
        initial={animate ? 'hidden' : false}
        whileInView="show"
        viewport={VIEWPORT_REVEAL}
        variants={staggerContainer(0.1)}
      >
        <motion.div variants={riseVariants}>
          <KickerRule label="The register" bar={accent.field} />
        </motion.div>
        <motion.div
          aria-hidden="true"
          variants={ruleDrawVariants}
          className="rule-heavy mt-4 origin-left"
        />

        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <motion.div variants={riseVariants} className="md:col-span-7">
            <p className="type-figure text-ink">{gapStat.value}</p>
            <p
              className="type-doc-label-lg mt-3"
              style={{ color: accent.inkOnPaper }}
            >
              Affordable homes short
            </p>
            {gapCitation && <p className="type-fine mt-2 max-w-prose">{gapCitation}</p>}
          </motion.div>

          <motion.div variants={riseVariants} className="md:col-span-5">
            {sunsetNote && (
              <p className="type-fine max-w-prose border-l-2 border-hairline pl-4">
                {sunsetNote}.
              </p>
            )}
            {askStat && (
              <LedgerRow
                className="rule-hair mt-5 pt-4"
                label="This question asks"
                sublabel={askStat.label}
                figure={askStat.value}
                figureColor={accent.inkOnPaper}
                size="lg"
              />
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* ============================================================ */}
      {/* THE MONUMENT: the completed-developments register sheet       */}
      {/* ============================================================ */}
      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_REVEAL}
        transition={{ duration: 0.55, ease: PAPER_EASE }}
      >
        <Sheet as="figure" shadow="offset" className="m-0">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {/* Letterhead between double rules */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="type-doc-label-lg text-ink">Housing Trust Fund</span>
              <span className="type-doc-label text-ink-soft">
                Kansas City, Missouri · Est. 2018 · Ordinance 180719
              </span>
            </div>
            <div aria-hidden="true" className="rule-total mt-3" />

            <h3 className="mt-6 text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">
              {completedProjects.heading}
            </h3>

            {/* Column heads */}
            <div
              aria-hidden="true"
              className="mt-6 flex items-end justify-between gap-2 border-b border-hairline pb-2"
            >
              <span className="type-doc-label text-ink-soft">Development</span>
              <span className="type-doc-label text-ink-soft">Units</span>
            </div>

            {/* Ten rows posting top-down */}
            <ul className="m-0 list-none p-0">
              {completedProjects.items.map((p, i) => (
                <motion.li
                  key={p.name}
                  initial={animate ? { opacity: 0, y: 12 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{
                    duration: 0.45,
                    delay: animate ? ledgerDelay(i, 0.07) : 0,
                    ease: PAPER_EASE,
                  }}
                  className="rule-hair py-3 first:border-t-0 sm:py-3.5"
                >
                  <LedgerRow
                    label={p.name}
                    sublabel={p.address}
                    figure={
                      <>
                        {p.units}
                        <span className="sr-only">
                          {p.units === 1 ? ' unit' : ' units'}
                        </span>
                      </>
                    }
                    figureColor={accent.inkOnPaper}
                    labelClassName="font-bold"
                  />
                </motion.li>
              ))}
            </ul>

            {/* Double-ruled total, counting up as it enters */}
            <motion.figcaption
              initial={animate ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.5, delay: animate ? 0.2 : 0, ease: PAPER_EASE }}
              className="mt-5"
            >
              <div aria-hidden="true" style={accentRuleTotal} />
              <div className="flex flex-wrap items-end gap-2 pt-2.5">
                <span className="type-doc-label-lg min-w-0 text-ink">
                  {completedProjects.totalLabel}
                </span>
                <span aria-hidden="true" className="leader" />
                <span
                  className="shrink-0 whitespace-nowrap text-3xl font-extrabold tabular-nums sm:text-4xl"
                  style={{ color: accent.inkOnPaper }}
                >
                  <PrintedCounter end={completedProjects.total} />
                </span>
              </div>
            </motion.figcaption>
          </div>
        </Sheet>
      </motion.div>

      {/* ============================================================ */}
      {/* WHAT YOUR YES ADDS + the 4/7 note, stamp landing last         */}
      {/* ============================================================ */}
      <div className="grid gap-10 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <KickerRule as="h3" label="What your YES adds" bar={accent.field} />
          <ul className="m-0 mt-5 list-none p-0">
            {yesAddsRows.map((row, i) => (
              <motion.li
                key={row.label}
                initial={animate ? { opacity: 0, y: 12 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_REVEAL}
                transition={{
                  duration: 0.45,
                  delay: animate ? ledgerDelay(i) : 0,
                  ease: PAPER_EASE,
                }}
                className="rule-hair py-3 first:border-t-0 first:pt-0 sm:py-3.5"
              >
                <LedgerRow
                  label={row.label}
                  sublabel={row.sublabel}
                  figure={row.figure}
                  figureColor={accent.inkOnPaper}
                  size="lg"
                />
              </motion.li>
            ))}
          </ul>
        </div>

        {/* The golden-ink supermajority note, anchored to the ledger on a
            golden rule instead of floating in an empty column. */}
        <div
          className="border-l-[3px] py-1 pl-5 md:col-span-5 md:pl-7"
          style={{ borderColor: ACCENT_INKS.golden.field }}
        >
          <p className="type-doc-label text-ink-soft">The bar to clear</p>
          <div className="mt-4">
            <Stamp
              ink={goldenInk}
              size="lg"
              land={animate}
              delay={animate ? 0.45 : 0}
              className="text-[1.1875rem]"
            >
              Needs 4/7 · 57.1%
            </Stamp>
          </div>
          {supermajorityFact && (
            <p className="type-fine mt-4 max-w-prose">{supermajorityFact}</p>
          )}
        </div>
      </div>
    </div>
  );
}
