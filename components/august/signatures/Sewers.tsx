'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CORAL_PRESS, withAlpha } from '@/components/august/accent';
import {
  FileTab,
  KickerRule,
  LedgerRow,
  PAPER_EASE,
  Sheet,
  Stamp,
  ledgerDelay,
} from '@/components/august/paper';
import { PrintedCounter, VIEWPORT_REVEAL, usePaperEntrance } from './entrance';
import BarChartReveal from '@/components/august/BarChartReveal';
import FinancingLadder from '@/components/august/FinancingLadder';
import type { SignatureProps } from './index';

// THE COURT FILE (Question 5, navy). The sewers signature reads as a
// federal case file: a caption sheet for the Clean Water Act consent decree
// with THE CAPTURE METER as its centerpiece, followed by filed exhibits
// (the capital program, the State Revolving Fund docket, the record to
// date with the prior-vote stamp, and the financing stair). Every figure
// is read or parsed from the measure record; each block gates on the data
// it renders and the whole section returns null when nothing is present.

interface CaptureTrajectory {
  start: number;
  startYear: string;
  interim: number;
  interimYear: string;
  mandate: number;
  mandateYear: string;
  /** The verbatim constants sentence the figures were parsed from. */
  sourceText: string;
}

// The capture trajectory lives in constants as a single realExamples
// sentence ("... risen from roughly 45 percent in 2012 toward an interim
// target near 77 percent by 2035 and the final 85 percent by 2040").
// Parsing it keeps every meter figure derived from the source of truth:
// if the copy changes, the meter re-derives or stops rendering.
function parseCaptureTrajectory(examples: readonly string[]): CaptureTrajectory | null {
  for (const text of examples) {
    const m = text.match(
      /(\d+) percent in (\d{4}).*?(\d+) percent by (\d{4}).*?(\d+) percent by (\d{4})/
    );
    if (m) {
      return {
        start: Number(m[1]),
        startYear: m[2],
        interim: Number(m[3]),
        interimYear: m[4],
        mandate: Number(m[5]),
        mandateYear: m[6],
        sourceText: text,
      };
    }
  }
  return null;
}

function ExhibitLabel({ children }: { children: ReactNode }) {
  return <p className="type-doc-label text-ink-soft">{children}</p>;
}

function ExhibitTitle({ field, children }: { field: string; children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
      <span
        aria-hidden="true"
        className="inline-block h-[3px] w-6 shrink-0"
        style={{ backgroundColor: field }}
      />
      {children}
    </h3>
  );
}

export default function Sewers({ measure, accent }: SignatureProps) {
  const animate = usePaperEntrance();

  const { cipBreakdown, financingLadder, srfNote, bondHistory, timeline } = measure;
  const srfApplications = measure.srfApplications;
  const hasSrf = srfApplications.length > 0;

  // THE CAPTURE METER: parsed trajectory cross-checked against the
  // heroStats capture figure. If either is missing or they disagree, the
  // meter (and its caption sheet) does not render.
  const trajectory = parseCaptureTrajectory(measure.realExamples);
  const captureStat = measure.heroStats.find((s) => /^\d+%$/.test(s.value));
  const programStat = measure.heroStats.find((s) => /^\$[\d.]+B$/.test(s.value));
  const hasMeter =
    trajectory !== null &&
    captureStat !== undefined &&
    Number.parseInt(captureStat.value, 10) === trajectory.mandate;

  // Case caption rows, read from the timeline record.
  const enteredEntry = timeline.find((t) => t.date === '2010');
  const enteredDate =
    enteredEntry?.label.match(/on ([A-Z][a-z]+ \d{1,2}, \d{4})/)?.[1] ?? enteredEntry?.date;
  const amendedEntry = timeline.find((t) => /Third Amended/i.test(t.label));
  const deadlineEntry = timeline.find((t) => t.date === trajectory?.mandateYear);

  // The record to date, parsed from realExamples.
  const milesFact = measure.realExamples.find((e) => /[\d,]+ miles of sewer line/.test(e));
  const miles = milesFact?.match(/([\d,]+) miles/)?.[1];
  const milesFigure =
    miles && milesFact ? `${/more than/i.test(milesFact) ? `${miles}+` : miles} mi` : null;
  const acresFact = measure.realExamples.find(
    (e) => /green acres/.test(e) && /minimum of/.test(e)
  );
  const acresBuilt = acresFact?.match(/([\d,]+) green acres/)?.[1];
  const acresGoal = acresFact?.match(/minimum of ([\d,]+) green acres/)?.[1];
  const acresPct =
    acresBuilt && acresGoal
      ? Math.min(
          (Number(acresBuilt.replace(/,/g, '')) / Number(acresGoal.replace(/,/g, ''))) * 100,
          100
        )
      : null;
  const hasRecordLines = Boolean(milesFigure || (acresBuilt && acresGoal));

  // SRF docket total, summed from the application amounts. Renders only
  // when every amount parses, so the double-rule figure always reconciles.
  const srfParsed = srfApplications.map((a) => a.amount.match(/\$(\d+(?:\.\d+)?)\s*M/)?.[1]);
  const srfTotalM =
    srfParsed.length > 0 && srfParsed.every((v): v is string => Boolean(v))
      ? srfParsed.reduce((sum, v) => sum + Number(v), 0)
      : null;

  if (!cipBreakdown && !financingLadder && !bondHistory && !hasSrf && !srfNote && !hasMeter) {
    return null;
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* ============================================================= */}
      {/* Section header                                                 */}
      {/* ============================================================= */}
      <motion.div
        initial={animate ? { opacity: 0, y: 16 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_REVEAL}
        transition={{ duration: 0.5, ease: PAPER_EASE }}
      >
        <KickerRule label="The court file" bar={accent.field} />
        <h2 className="type-h2 mt-4 text-ink">
          The cleanup is not optional. It is a court order.
        </h2>
        <p className="type-fine mt-3 max-w-prose">
          Brought by the U.S. EPA and the Department of Justice under the federal Clean Water
          Act. A federal judge oversees the schedule.
        </p>
      </motion.div>

      {/* ============================================================= */}
      {/* THE CASE FILE: caption sheet + THE CAPTURE METER               */}
      {/* ============================================================= */}
      {hasMeter && trajectory && captureStat && (
        <motion.div
          initial={animate ? { opacity: 0, y: 18 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_REVEAL}
          transition={{ duration: 0.55, ease: PAPER_EASE }}
        >
          <div className="pl-4 sm:pl-6">
            <FileTab color={accent.field}>
              Case file · {measure.officialQuestion.number}
            </FileTab>
          </div>
          <Sheet shadow="offset">
            <div className="px-5 py-6 sm:px-9 sm:py-9">
              {/* Legal caption */}
              <p className="type-doc-label" style={{ color: accent.inkOnPaper }}>
                In re:
              </p>
              <p className="mt-1.5 text-xl font-extrabold leading-tight text-ink sm:text-2xl">
                The Clean Water Act consent decree
              </p>

              {(enteredDate || amendedEntry || deadlineEntry) && (
                <ul className="rule-hair m-0 mt-5 list-none space-y-2.5 p-0 pt-4">
                  {enteredDate && (
                    <LedgerRow as="li" size="sm" label="Consent decree entered" figure={enteredDate} />
                  )}
                  {amendedEntry && (
                    <LedgerRow
                      as="li"
                      size="sm"
                      label="Third Amended Consent Decree"
                      figure={amendedEntry.date}
                    />
                  )}
                  {deadlineEntry && (
                    <LedgerRow
                      as="li"
                      size="sm"
                      label="Final compliance deadline"
                      figure={deadlineEntry.date}
                      figureColor={CORAL_PRESS}
                    />
                  )}
                </ul>
              )}

              {/* Centerpiece figures */}
              <p className="type-doc-label mt-8 text-ink-soft sm:mt-10">The capture meter</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                <div className="min-w-0">
                  <p className="type-figure m-0 text-ink">
                    <PrintedCounter end={trajectory.mandate} suffix="%" duration={1.4} />
                  </p>
                  <p className="type-doc-label-lg mt-2 max-w-[26ch] text-ink">
                    {captureStat.label}
                  </p>
                </div>
                {programStat && (
                  <div className="min-w-0 pb-1 sm:text-right">
                    <p className="m-0 text-3xl font-extrabold tabular-nums text-ink sm:text-4xl">
                      <PrintedCounter
                        end={Number.parseFloat(programStat.value.slice(1))}
                        decimals={1}
                        prefix="$"
                        suffix="B"
                        duration={1.4}
                      />
                    </p>
                    <p className="type-fine mt-1 max-w-[30ch] sm:ml-auto">{programStat.label}</p>
                  </div>
                )}
              </div>

              {/* The meter. Graphic is decorative; the ruled legend below
                  carries every figure as real text. */}
              <div aria-hidden="true" className="relative mb-9 mt-9">
                <span
                  className="type-doc-label absolute -top-6 inline-block text-ink-soft"
                  style={{ left: `${trajectory.interim}%`, transform: 'translateX(-50%)' }}
                >
                  {trajectory.interim}%
                </span>

                <div
                  className="relative h-6 w-full"
                  style={{ backgroundColor: withAlpha(accent.field, 0.08) }}
                >
                  {/* Where capture stood when the program began */}
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${trajectory.start}%`,
                      backgroundColor: accent.field,
                      transformOrigin: 'left center',
                    }}
                    initial={animate ? { scaleX: 0 } : false}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{ duration: 0.7, delay: animate ? 0.25 : 0, ease: PAPER_EASE }}
                  />
                  {/* The mandated climb, hatched: work still under order */}
                  <motion.div
                    className="hatch absolute inset-y-0"
                    style={{
                      left: `${trajectory.start}%`,
                      width: `${trajectory.mandate - trajectory.start}%`,
                      transformOrigin: 'left center',
                    }}
                    initial={animate ? { scaleX: 0 } : false}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{ duration: 0.7, delay: animate ? 0.55 : 0, ease: PAPER_EASE }}
                  />
                  {/* Interim tick */}
                  <span
                    className="absolute inset-y-0 w-px"
                    style={{ left: `${trajectory.interim}%`, backgroundColor: 'var(--hairline)' }}
                  />
                </div>

                {/* The mandate rule draws first; the fill chases it */}
                <motion.span
                  className="absolute -bottom-2 -top-2 border-l-2 border-dashed"
                  style={{
                    left: `${trajectory.mandate}%`,
                    borderColor: CORAL_PRESS,
                    transformOrigin: 'center top',
                  }}
                  initial={animate ? { scaleY: 0 } : false}
                  whileInView={{ scaleY: 1 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.45, ease: PAPER_EASE }}
                />

                <span
                  className="type-doc-label absolute top-full mt-2 inline-block text-ink"
                  style={{ left: `${trajectory.start}%`, transform: 'translateX(-50%)' }}
                >
                  {trajectory.start}%
                </span>
                <span
                  className="type-doc-label absolute top-full mt-2 inline-block"
                  style={{
                    left: `${trajectory.mandate}%`,
                    transform: 'translateX(calc(-100% - 8px))',
                    color: CORAL_PRESS,
                  }}
                >
                  {trajectory.mandate}%
                </span>
              </div>

              {/* Ruled legend: the meter's figures as real text */}
              <ul className="m-0 list-none space-y-2.5 p-0">
                {[
                  {
                    label: `Where capture stood in ${trajectory.startYear}`,
                    figure: `${trajectory.start}%`,
                    color: undefined as string | undefined,
                  },
                  {
                    label: `Interim target by ${trajectory.interimYear}`,
                    figure: `${trajectory.interim}%`,
                    color: undefined as string | undefined,
                  },
                  {
                    label: `Required by the court by ${trajectory.mandateYear}`,
                    figure: `${trajectory.mandate}%`,
                    color: CORAL_PRESS,
                  },
                ].map((row, i) => (
                  <motion.li
                    key={row.label}
                    initial={animate ? { opacity: 0, y: 10 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{
                      duration: 0.45,
                      ease: PAPER_EASE,
                      delay: animate ? ledgerDelay(i) : 0,
                    }}
                  >
                    <LedgerRow size="sm" label={row.label} figure={row.figure} figureColor={row.color} />
                  </motion.li>
                ))}
              </ul>

              <p className="type-fine rule-hair mt-6 pt-4">{trajectory.sourceText}</p>
            </div>
          </Sheet>
        </motion.div>
      )}

      {/* ============================================================= */}
      {/* EXHIBIT: the capital program (CIP ledger bars)                 */}
      {/* ============================================================= */}
      {cipBreakdown && (
        <div>
          <ExhibitLabel>Filed exhibit · The capital program</ExhibitLabel>
          <div className="mt-4">
            <BarChartReveal
              heading={cipBreakdown.heading}
              rows={[...cipBreakdown.rows]}
              total={cipBreakdown.total}
              asking={cipBreakdown.asking}
              accent={accent.field}
              caption={cipBreakdown.note}
            />
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EXHIBIT: the State Revolving Fund docket                       */}
      {/* ============================================================= */}
      {(hasSrf || srfNote) && (
        <div>
          <ExhibitLabel>Filed exhibit · The State Revolving Fund docket</ExhibitLabel>
          {hasSrf && (
            <>
              <div className="mt-4">
                <ExhibitTitle field={accent.field}>
                  Applications drawing on this authorization
                </ExhibitTitle>
              </div>
              <ul className="m-0 mt-5 list-none p-0">
                {srfApplications.map((app, i) => (
                  <motion.li
                    key={app.name}
                    initial={animate ? { opacity: 0, y: 12 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{
                      duration: 0.45,
                      ease: PAPER_EASE,
                      delay: animate ? ledgerDelay(i) : 0,
                    }}
                    className="rule-hair py-3 first:border-t-0 first:pt-0 sm:py-3.5"
                  >
                    <LedgerRow
                      label={app.name}
                      sublabel={app.detail}
                      figure={app.amount.match(/\$[\d.]+\s*M/)?.[0] ?? app.amount}
                      figureColor={accent.inkOnPaper}
                    />
                  </motion.li>
                ))}
              </ul>
              {srfTotalM !== null && (
                <motion.div
                  initial={animate ? { opacity: 0, y: 12 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.5, ease: PAPER_EASE, delay: animate ? 0.2 : 0 }}
                  className="mt-5"
                >
                  <LedgerRow
                    total
                    size="lg"
                    label="Drawing on this authorization"
                    figure={`$${srfTotalM}M`}
                  />
                </motion.div>
              )}
            </>
          )}
          {srfNote && <p className="type-fine mt-5 max-w-prose">{srfNote}</p>}
        </div>
      )}

      {/* ============================================================= */}
      {/* EXHIBIT: the record to date (progress lines + prior vote)      */}
      {/* ============================================================= */}
      {(hasRecordLines || bondHistory) && (
        <div>
          <ExhibitLabel>Filed exhibit · The record to date</ExhibitLabel>

          {hasRecordLines && (
            <>
              <div className="mt-4">
                <ExhibitTitle field={accent.field}>
                  What the cleanup has already built
                </ExhibitTitle>
              </div>
              <ul className="m-0 mt-5 list-none p-0">
                {milesFigure && milesFact && (
                  <motion.li
                    initial={animate ? { opacity: 0, y: 12 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{ duration: 0.45, ease: PAPER_EASE }}
                    className="py-3 sm:py-3.5"
                  >
                    <LedgerRow
                      label="Sewer line rehabilitated"
                      sublabel={milesFact}
                      figure={milesFigure}
                      figureColor={accent.inkOnPaper}
                    />
                  </motion.li>
                )}
                {acresBuilt && acresGoal && acresFact && (
                  <motion.li
                    initial={animate ? { opacity: 0, y: 12 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{
                      duration: 0.45,
                      ease: PAPER_EASE,
                      delay: animate ? ledgerDelay(1) : 0,
                    }}
                    className="rule-hair py-3 sm:py-3.5"
                  >
                    <LedgerRow
                      label="Green acres of green infrastructure"
                      sublabel={acresFact}
                      figure={`${acresBuilt} of ${acresGoal}`}
                      figureColor={accent.inkOnPaper}
                    />
                    {acresPct !== null && (
                      <div
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-full"
                        style={{ backgroundColor: withAlpha(accent.field, 0.12) }}
                      >
                        <motion.div
                          className="h-full"
                          style={{
                            width: `${acresPct}%`,
                            transformOrigin: 'left center',
                            backgroundColor: accent.field,
                          }}
                          initial={animate ? { scaleX: 0 } : false}
                          whileInView={{ scaleX: 1 }}
                          viewport={VIEWPORT_REVEAL}
                          transition={{
                            duration: 0.8,
                            ease: PAPER_EASE,
                            delay: animate ? ledgerDelay(1) + 0.1 : 0,
                          }}
                        />
                      </div>
                    )}
                  </motion.li>
                )}
              </ul>
            </>
          )}

          {bondHistory && (
            <div className={hasRecordLines ? 'rule-hair mt-7 pt-7' : 'mt-4'}>
              <ExhibitTitle field={accent.field}>{bondHistory.heading}</ExhibitTitle>
              <p className="type-body mt-4 max-w-prose text-ink/80">{bondHistory.note}</p>
              <div className="mt-5">
                <Stamp land={animate} size="lg" delay={animate ? 0.35 : 0}>
                  {bondHistory.approval}
                </Stamp>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* EXHIBIT: the financing stair                                   */}
      {/* ============================================================= */}
      {financingLadder && (
        <div>
          <ExhibitLabel>Filed exhibit · The financing</ExhibitLabel>
          <div className="mt-4">
            <FinancingLadder
              rungs={[...financingLadder.rungs]}
              accent={accent.field}
              heading="How the financing stays cheap"
            />
          </div>
        </div>
      )}
    </div>
  );
}
