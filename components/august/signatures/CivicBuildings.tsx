'use client';

import { motion, type Variants } from 'framer-motion';
import { darken, withAlpha } from '@/components/august/accent';
import BarChartReveal from '@/components/august/BarChartReveal';
import {
  KickerRule,
  LedgerRow,
  Sheet,
  Stamp,
  PAPER_EASE,
  ledgerDelay,
} from '@/components/august/paper';
import type { SignatureProps } from './index';
import { VIEWPORT_REVEAL, usePaperEntrance } from './entrance';

// THE WORK ORDER (Question 2, golden field, navy ink). One estimate-sheet
// artifact: a "WORK ORDER No. 260483" header with the authorization line,
// the 1937 monument beside the $75M / $25M split bar, the City Manager's
// costed line items as ledger bars, the City Hall punch list whose square
// checkboxes tick on scroll in golden ink, and the honesty ledger printing
// the $51M identified / $25M funded shortfall plainly, closed by the 4/7
// supermajority stamp landing last. Every figure is read out of `measure`
// (heroStats, keyFacts, ordinance, amount, civicProjects) or derived by
// arithmetic on those values; each block gates on its data and drops out
// silently when the source is absent.

// Punch-list rows post top-down; each check draws just after its row lands.
const punchRowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: PAPER_EASE, delay: ledgerDelay(i, 0.07) },
  }),
};

const punchCheckVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: PAPER_EASE, delay: ledgerDelay(i, 0.07) + 0.3 },
  }),
};

interface SplitCell {
  label: string;
  amountM: number;
  display: string;
}

// The $75M / $25M convention center / City Hall split, read from the
// heroStat that carries it as "$75M / $25M" with a matching paired label.
function parseSplit(measure: SignatureProps['measure']): [SplitCell, SplitCell] | null {
  const stat = measure.heroStats.find((s) => /^\$[\d.]+M \/ \$[\d.]+M$/.test(s.value));
  if (!stat) return null;
  const figures = stat.value.split(' / ');
  const labels = stat.label.split(' / ');
  if (figures.length !== 2 || labels.length !== 2) return null;
  const amounts = figures.map((f) => Number(f.replace(/[^0-9.]/g, '')));
  if (amounts.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  return [
    { label: labels[0], amountM: amounts[0], display: figures[0] },
    { label: labels[1], amountM: amounts[1], display: figures[1] },
  ];
}

interface Honesty {
  fact: string;
  identifiedM: number;
  fundedM: number;
  unfundedM: number;
}

// The honesty ledger figures ($51M identified at City Hall, $25M funded
// here) come from the keyFact that states them, quoted verbatim as the
// ledger's fine print. The shortfall is the subtraction.
function parseHonesty(measure: SignatureProps['measure']): Honesty | null {
  const fact = measure.keyFacts.find(
    (f) => f.includes('identified') && f.includes('repair needs') && /\$[\d.]+ million/.test(f)
  );
  if (!fact) return null;
  const sums = [...fact.matchAll(/\$(\d+(?:\.\d+)?) million/g)].map((m) => Number(m[1]));
  if (sums.length < 2 || sums[0] <= sums[1]) return null;
  return { fact, identifiedM: sums[0], fundedM: sums[1], unfundedM: sums[0] - sums[1] };
}

function fmtM(n: number): string {
  return `$${Number.isInteger(n) ? n : n.toFixed(1)}M`;
}

// Shared exhibit heading: the 24x3 accent bar beside an extrabold title,
// matching the heading BarChartReveal prints for its own exhibit.
function ExhibitHead({ title, bar }: { title: string; bar: string }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
      <span
        aria-hidden="true"
        className="inline-block h-[3px] w-6 shrink-0"
        style={{ backgroundColor: bar }}
      />
      {title}
    </h3>
  );
}

export default function CivicBuildings({ measure, accent }: SignatureProps) {
  const animate = usePaperEntrance();
  const { civicProjects } = measure;
  if (!civicProjects) return null;

  // 1937 (City Hall's year) and the pre-1950 keyFact that anchors it.
  const yearStat = measure.heroStats.find((s) => /^\d{4}$/.test(s.value));
  const eraFact = measure.keyFacts.find((f) => f.includes('constructed before 1950'));

  const split = parseSplit(measure);
  const splitPct = split ? (split[0].amountM / (split[0].amountM + split[1].amountM)) * 100 : 0;

  const honesty = parseHonesty(measure);

  // "No. 260483" from the ordinance record; falls back to the full string.
  const orderNo = measure.ordinance?.match(/No\.\s*([\w-]+)/)?.[1] ?? null;

  // 4/7 stamp: only when the measure actually carries the supermajority bar.
  const needsFourSevenths = measure.voteThreshold.includes('Four-sevenths');
  const fourSeventhsPct = ((4 / 7) * 100).toFixed(1);
  // accent.inkOnPaper (golden-ink) clears AA only at w700 18px+; the stamp
  // sets smaller type, so press it in a deeper shade of the same ink.
  const stampInk = darken(accent.inkOnPaper, 0.2);

  return (
    <div>
      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_REVEAL}
        transition={{ duration: 0.6, ease: PAPER_EASE }}
      >
        <KickerRule label="The work order" bar={accent.field} className="mb-6" />
        <Sheet
          as="article"
          shadow="offset"
          aria-labelledby="civic-work-order-title"
          className="px-5 py-7 sm:px-8 sm:py-10"
        >
          {/* ======================= ORDER HEADER ======================= */}
          <header>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-[3px] border-ink pb-4">
              <h2
                id="civic-work-order-title"
                className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl"
              >
                Work order
              </h2>
              <div className="text-right">
                <p className="type-doc-label-lg text-ink">
                  {orderNo ? `No. ${orderNo}` : measure.ordinance}
                </p>
                <p className="type-fine mt-0.5">City of Kansas City, Missouri</p>
              </div>
            </div>
            <LedgerRow
              className="mt-5"
              size="lg"
              label="Authorization, not to exceed"
              figure={measure.amount}
              figureClassName="text-[1.375rem] sm:text-2xl"
            />
          </header>

          {/* ============== THE 1937 MONUMENT + THE SPLIT =============== */}
          {(yearStat || split) && (
            <div className="mt-9 grid gap-10 sm:mt-11 md:grid-cols-12 md:gap-8">
              {yearStat && (
                <motion.div
                  initial={animate ? { opacity: 0, y: 16 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.5, ease: PAPER_EASE }}
                  className="md:col-span-5"
                >
                  <p className="type-figure text-ink">{yearStat.value}</p>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-[3px] w-16"
                    style={{ backgroundColor: accent.field }}
                  />
                  <p className="mt-3 text-sm font-semibold leading-snug text-ink sm:text-[0.9375rem]">
                    {yearStat.label}
                  </p>
                  {eraFact && <p className="type-fine mt-3 max-w-[38ch]">{eraFact}</p>}
                </motion.div>
              )}

              {split && (
                <figure
                  aria-label={`${split[0].label}: ${split[0].display}. ${split[1].label}: ${split[1].display}. Together the ${measure.amount} authorization.`}
                  className="m-0 flex flex-col justify-end md:col-span-7"
                >
                  <p className="type-doc-label text-ink-soft">The split</p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[1.375rem] font-extrabold tabular-nums leading-none text-ink sm:text-[1.625rem]">
                        {split[0].display}
                      </p>
                      <p className="type-doc-label mt-1.5 text-ink-soft">{split[0].label}</p>
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="text-[1.375rem] font-extrabold tabular-nums leading-none text-ink sm:text-[1.625rem]">
                        {split[1].display}
                      </p>
                      <p className="type-doc-label mt-1.5 text-ink-soft">{split[1].label}</p>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="relative mt-3 h-6 w-full"
                    style={{ backgroundColor: withAlpha(accent.field, 0.28) }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${splitPct}%`,
                        backgroundColor: accent.field,
                        transformOrigin: 'left center',
                      }}
                      initial={animate ? { scaleX: 0 } : false}
                      whileInView={{ scaleX: 1 }}
                      viewport={VIEWPORT_REVEAL}
                      transition={{ duration: 0.8, ease: PAPER_EASE }}
                    />
                    <motion.span
                      className="absolute inset-y-0 w-[2px] bg-ink"
                      style={{ left: `${splitPct}%` }}
                      initial={animate ? { opacity: 0 } : false}
                      whileInView={{ opacity: 1 }}
                      viewport={VIEWPORT_REVEAL}
                      transition={{ duration: 0.3, delay: animate ? 0.75 : 0, ease: PAPER_EASE }}
                    />
                  </div>
                </figure>
              )}
            </div>
          )}

          {/* =================== COSTED LINE ITEMS ====================== */}
          <div className="rule-hair mt-9 pt-9 sm:mt-11 sm:pt-11">
            <BarChartReveal
              heading={civicProjects.heading}
              rows={civicProjects.costed.map((c) => ({
                label: c.name,
                value: c.amountM * 1_000_000,
              }))}
              accent={accent.field}
              caption={civicProjects.note}
            />
          </div>

          {/* ==================== THE PUNCH LIST ======================== */}
          {civicProjects.cityHall.length > 0 && (
            <div className="rule-hair mt-9 pt-9 sm:mt-11 sm:pt-11">
              <ExhibitHead title="The punch list: City Hall improvements" bar={accent.field} />
              <ul role="list" className="m-0 mt-5 list-none p-0">
                {civicProjects.cityHall.map((item, i) => (
                  <motion.li
                    key={item}
                    custom={i}
                    variants={punchRowVariants}
                    initial={animate ? 'hidden' : false}
                    whileInView="show"
                    viewport={VIEWPORT_REVEAL}
                    className="rule-hair flex items-center gap-3.5 py-3.5 first:border-t-0 first:pt-0"
                  >
                    <span
                      aria-hidden="true"
                      className="relative h-[18px] w-[18px] shrink-0 border-2 border-ink"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute -left-1 -top-1 h-[26px] w-[26px]"
                      >
                        <motion.path
                          d="M4 12.5 L10 18.5 L20.5 5.5"
                          stroke={accent.inkOnPaper}
                          strokeWidth={3.2}
                          strokeLinecap="square"
                          custom={i}
                          variants={punchCheckVariants}
                        />
                      </svg>
                    </span>
                    <span className="text-[0.9375rem] font-medium text-ink sm:text-base">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* ==================== THE HONEST MATH ======================= */}
          {honesty && (
            <div className="rule-hair mt-9 pt-9 sm:mt-11 sm:pt-11">
              <ExhibitHead title="The honest math at City Hall" bar={accent.field} />
              <div className="mt-5">
                {[
                  { label: 'Repair needs identified at City Hall', figure: fmtM(honesty.identifiedM), total: false },
                  { label: 'Funded by this question', figure: fmtM(honesty.fundedM), total: false },
                  { label: 'Left unfunded at City Hall', figure: fmtM(honesty.unfundedM), total: true },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={animate ? { opacity: 0, y: 12 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_REVEAL}
                    transition={{
                      duration: 0.45,
                      ease: PAPER_EASE,
                      delay: animate ? ledgerDelay(i, 0.09) : 0,
                    }}
                  >
                    <LedgerRow
                      size="lg"
                      label={row.label}
                      figure={row.figure}
                      total={row.total}
                      className={row.total ? 'mt-4' : 'py-1.5'}
                    />
                  </motion.div>
                ))}
              </div>
              <p className="type-fine mt-5 max-w-prose">{honesty.fact}</p>
              {needsFourSevenths && (
                <div className="mt-7 flex justify-end">
                  <Stamp land={animate} delay={animate ? 0.5 : 0} ink={stampInk} size="lg" rotate={-3}>
                    Needs 4/7 &middot; {fourSeventhsPct}%
                  </Stamp>
                </div>
              )}
            </div>
          )}
        </Sheet>
      </motion.div>
    </div>
  );
}
