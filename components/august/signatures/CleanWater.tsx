'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import BarChartReveal from '@/components/august/BarChartReveal';
import FinancingLadder from '@/components/august/FinancingLadder';
import {
  KickerRule,
  LedgerRow,
  Sheet,
  Stamp,
  riseVariants,
  staggerContainer,
} from '@/components/august/paper';
import type { SignatureProps } from './index';
import { PrintedCounter, VIEWPORT_REVEAL, usePaperEntrance } from './entrance';

// THE UTILITY STATEMENT (Question 4, sky). The page's bespoke artifact: a
// white utility bill, perforated at the top, itemizing what these revenue
// bonds add to each tax on a Kansas City water bill ($0.00 per tax, because
// by law they are repaid solely from water rates), followed by three filed
// exhibits: the projected Water CIP ledger, the financing stair, and the
// prior-authorization reconciliation ledger with its 79% YES stamp.
//
// Every figure comes from the measure record or is summed from it in view
// code. The $500M prior authorization is stated in bondHistory.note and
// keyFacts ("the prior $500 million water revenue bond authorization in
// April 2014"); the issued total and remaining balance are derived so the
// ledger reconciles with the note's $484.4M / about $15.6M language.

// The three taxes the mechanism legally bars from repaying these bonds.
// Itemized per-tax, per the honesty rules: $0.00 means the line on each tax.
const TAX_LINES = [
  'Property tax for these bonds',
  'Sales tax for these bonds',
  'Earnings tax for these bonds',
] as const;

// Stated in bondHistory.note and keyFacts: voters authorized $500 million in
// water revenue bonds in April 2014.
const PRIOR_AUTHORIZATION = 500_000_000;

function usd(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

// "EXHIBIT A" rail: doc-label in the measure's ink with a hairline running
// to the right edge, so the exhibits read as filed attachments to the bill.
function ExhibitRule({ label, ink }: { label: string; ink: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="type-doc-label-lg shrink-0" style={{ color: ink }}>
        {label}
      </span>
      <span aria-hidden="true" className="h-px min-w-8 flex-1 bg-hairline" />
    </div>
  );
}

export default function CleanWater({ measure, accent }: SignatureProps) {
  const animate = usePaperEntrance();
  const { cipBreakdown, financingLadder, srfNote, bondHistory } = measure;
  if (!cipBreakdown && !financingLadder && !bondHistory && !srfNote) return null;

  // Exhibit letters stay contiguous if a block's data is ever absent.
  const present = [Boolean(cipBreakdown), Boolean(financingLadder), Boolean(bondHistory)];
  const exhibitLetter = (slot: number) =>
    String.fromCharCode(65 + present.slice(0, slot).filter(Boolean).length);

  // Prior-authorization reconciliation, summed from the issuance series so
  // the ledger reconciles ($484,375,000 issued; $15,625,000 remaining).
  const points = bondHistory?.points ?? [];
  const issued = points.reduce((sum, p) => sum + p.value, 0);
  const lastSeries = points.length > 0 ? points[points.length - 1].label : null;
  const showReconciliation = issued > 0 && issued <= PRIOR_AUTHORIZATION;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* =============================================================== */}
      {/* THE BILL: header column + the utility statement artifact         */}
      {/* =============================================================== */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <header className="min-w-0 lg:col-span-5">
          <KickerRule label="The utility statement" bar={accent.field} />
          <h2 className="type-h2 mt-4 text-ink">
            What {measure.officialQuestion.number} adds to your tax bill, itemized
          </h2>
          <p className="type-lede mt-5 text-ink/80">{measure.costFraming}</p>

          {(cipBreakdown || financingLadder || bondHistory) && (
            <div className="mt-10">
              <p className="type-doc-label text-ink-soft">Exhibits attached</p>
              <ul role="list" className="mt-3 border-t-[3px] border-ink">
                {cipBreakdown && (
                  <li className="flex items-baseline gap-3 border-b border-hairline py-2.5">
                    <span
                      className="type-doc-label-lg w-4 shrink-0"
                      style={{ color: accent.inkOnPaper }}
                    >
                      {exhibitLetter(0)}
                    </span>
                    <span className="min-w-0 text-sm font-semibold leading-snug text-ink">
                      {cipBreakdown.heading}
                    </span>
                  </li>
                )}
                {financingLadder && (
                  <li className="flex items-baseline gap-3 border-b border-hairline py-2.5">
                    <span
                      className="type-doc-label-lg w-4 shrink-0"
                      style={{ color: accent.inkOnPaper }}
                    >
                      {exhibitLetter(1)}
                    </span>
                    <span className="min-w-0 text-sm font-semibold leading-snug text-ink">
                      How the financing stays cheap
                    </span>
                  </li>
                )}
                {bondHistory && (
                  <li className="flex items-baseline gap-3 border-b border-hairline py-2.5">
                    <span
                      className="type-doc-label-lg w-4 shrink-0"
                      style={{ color: accent.inkOnPaper }}
                    >
                      {exhibitLetter(2)}
                    </span>
                    <span className="min-w-0 text-sm font-semibold leading-snug text-ink">
                      {bondHistory.heading}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </header>

        <Sheet as="figure" shadow="offset" perforated className="m-0 min-w-0 self-start lg:col-span-7">
          <motion.div
            variants={staggerContainer(0.09, 0.1)}
            initial={animate ? 'hidden' : false}
            whileInView="show"
            viewport={VIEWPORT_REVEAL}
            className="px-5 pb-7 pt-5 sm:px-8 sm:pb-8 sm:pt-6"
          >
            {/* Letterhead */}
            <motion.div variants={riseVariants}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-2xl font-black tracking-tight text-ink">KC Water</span>
                <span className="type-doc-label text-ink-soft">
                  {measure.officialQuestion.number}
                </span>
              </div>
              <p className="type-doc-label mt-2" style={{ color: accent.inkOnPaper }}>
                Statement of what these bonds cost you
              </p>
            </motion.div>

            {/* Account block */}
            <motion.div variants={riseVariants}>
              <div aria-hidden="true" className="rule-total mt-4" />
              <dl className="mt-3 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <dt className="type-doc-label text-ink-soft">Account</dt>
                  <dd className="text-sm font-semibold text-ink">
                    Every Kansas City water customer
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <dt className="type-doc-label text-ink-soft">Statement date</dt>
                  <dd className="text-sm font-semibold text-ink tabular-nums">August 4, 2026</dd>
                </div>
              </dl>
            </motion.div>

            {/* Line items */}
            <motion.div variants={riseVariants} className="mt-6 border-b border-hairline pb-3">
              <LedgerRow
                label="Water service"
                sublabel="Rates set separately by the City"
                figure="see rate plan"
                figureColor="var(--ink-soft)"
                figureClassName="text-[0.75rem] font-bold uppercase tracking-[0.08em]"
              />
            </motion.div>

            <ul role="list">
              {TAX_LINES.map((label, i) => (
                <motion.li
                  key={label}
                  variants={riseVariants}
                  className={cn('py-3.5', i > 0 && 'rule-hair')}
                >
                  <LedgerRow
                    label={label}
                    figure="$0.00"
                    figureColor={accent.inkOnPaper}
                    figureClassName="text-2xl leading-none sm:text-[1.75rem]"
                    labelClassName="font-semibold"
                  />
                </motion.li>
              ))}
            </ul>

            {/* Total under the double rule */}
            <motion.div variants={riseVariants} className="mt-1">
              <LedgerRow
                total
                label="New taxes"
                figure="$0.00"
                figureColor={accent.inkOnPaper}
                size="lg"
                className="[&>div]:flex-wrap"
                figureClassName="text-4xl leading-none sm:text-5xl"
              />
            </motion.div>

            {/* Footnotes: the honest caveat, verbatim from honestCost */}
            <motion.footer variants={riseVariants} className="mt-7 border-t border-hairline pt-4">
              <p className="type-fine max-w-prose">
                By law the City cannot use property, sales, or earnings tax money to repay these
                bonds. They are repaid only from the water rates KC Water already collects.
              </p>
              <p className="type-fine mt-2 max-w-prose">
                This is not a promise that your water bill never rises. Water rates are set
                separately by the City and the cost of this work is already factored into the
                utility rate plan.
              </p>
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="type-doc-label text-ink-soft">Waterworks revenue bonds</span>
                <span className="type-doc-label text-ink-soft">Sample, for voter education</span>
              </div>
            </motion.footer>
          </motion.div>
        </Sheet>
      </div>

      {/* =============================================================== */}
      {/* EXHIBITS A + B: the CIP ledger and the financing stair           */}
      {/* =============================================================== */}
      {(cipBreakdown || financingLadder) && (
        <div
          className={cn(
            'grid gap-14',
            cipBreakdown && financingLadder && 'lg:grid-cols-2 lg:gap-10'
          )}
        >
          {cipBreakdown && (
            <div>
              <ExhibitRule label={`Exhibit ${exhibitLetter(0)}`} ink={accent.inkOnPaper} />
              <BarChartReveal
                heading={cipBreakdown.heading}
                rows={[...cipBreakdown.rows]}
                total={cipBreakdown.total}
                asking={cipBreakdown.asking}
                accent={accent.field}
                caption={cipBreakdown.note}
              />
            </div>
          )}

          {financingLadder && (
            <div>
              <ExhibitRule label={`Exhibit ${exhibitLetter(1)}`} ink={accent.inkOnPaper} />
              <FinancingLadder
                rungs={[...financingLadder.rungs]}
                accent={accent.field}
                heading="How the financing stays cheap"
              />
              {srfNote && <p className="type-fine mt-5 max-w-prose">{srfNote}</p>}
            </div>
          )}
        </div>
      )}

      {/* =============================================================== */}
      {/* EXHIBIT C: the prior authorization, reconciled to the dollar     */}
      {/* =============================================================== */}
      {bondHistory && (
        <div>
          <ExhibitRule label={`Exhibit ${exhibitLetter(2)}`} ink={accent.inkOnPaper} />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
                <span
                  aria-hidden="true"
                  className="inline-block h-[3px] w-6 shrink-0"
                  style={{ backgroundColor: accent.field }}
                />
                {bondHistory.heading}
              </h3>
              <p className="type-body mt-4 max-w-prose text-ink/80">{bondHistory.note}</p>
            </div>

            {points.length > 0 && (
              <div className="min-w-0 lg:col-span-7">
                <motion.div
                  variants={staggerContainer(0.08)}
                  initial={animate ? 'hidden' : false}
                  whileInView="show"
                  viewport={VIEWPORT_REVEAL}
                >
                  <motion.p variants={riseVariants} className="type-doc-label text-ink-soft">
                    Water revenue bonds issued, by series
                  </motion.p>
                  <ul role="list" className="mt-3">
                    {points.map((p, i) => (
                      <motion.li
                        key={p.label}
                        variants={riseVariants}
                        className={cn('py-2.5', i > 0 && 'rule-hair')}
                      >
                        <LedgerRow label={`Series ${p.label}`} figure={usd(p.value)} size="sm" />
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div variants={riseVariants} className="mt-3">
                    <LedgerRow
                      total
                      label={`Issued through ${lastSeries}`}
                      figure={<PrintedCounter end={issued} prefix="$" duration={1.4} />}
                    />
                  </motion.div>

                  {showReconciliation && (
                    <>
                      <motion.div variants={riseVariants} className="mt-4">
                        <LedgerRow
                          label="Authorized by voters, April 2014"
                          figure={usd(PRIOR_AUTHORIZATION)}
                          size="sm"
                        />
                      </motion.div>
                      <motion.div variants={riseVariants} className="mt-4">
                        <LedgerRow
                          total
                          label="Balance remaining"
                          figure={
                            <PrintedCounter
                              end={PRIOR_AUTHORIZATION - issued}
                              prefix="$"
                              duration={1.2}
                            />
                          }
                          figureColor={accent.inkOnPaper}
                          size="lg"
                          className="[&>div]:flex-wrap"
                          figureClassName="text-[1.625rem] leading-none sm:text-3xl"
                        />
                      </motion.div>
                    </>
                  )}
                </motion.div>

                {/* The stamp lands last, pressed over the foot of the ledger */}
                <div className="relative z-10 -mt-3 flex justify-end pr-1 sm:-mt-4">
                  <Stamp land={animate} ink={accent.inkOnPaper} size="lg" delay={0.6}>
                    {bondHistory.approval}
                  </Stamp>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
