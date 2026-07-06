'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import DistrictMap from '@/components/august/DistrictMap';
import {
  KickerRule,
  LedgerRow,
  Stamp,
  PAPER_EASE,
  ledgerDelay,
} from '@/components/august/paper';
import { cn } from '@/lib/utils';
import type { SignatureProps } from './index';
import { PrintedCounter, VIEWPORT_REVEAL, usePaperEntrance } from './entrance';

// THE PLAT AND THE RECEIPT (Question 3, sunrise). The bespoke central-city
// artifact spread: the surveyor's plat of the CCED district on the left, a
// register tape of nine fiscal years of collections on the right, torn at the
// bottom, stamped RENEWAL, and below the spread a ruled two-column register of
// all twelve funded projects. Every figure comes from the measure record: the
// tape's double-rule total is summed in view code from ccedRevenue.points and
// reconciles with ccedRevenue.total ($98,960,087). Reduced motion renders the
// whole spread in its final printed state.

function fullUSD(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export default function CentralCity({ measure, accent }: SignatureProps) {
  const animate = usePaperEntrance();
  const headingId = useId();

  const { ccedRevenue, ccedProjects, ccedDistrict } = measure;
  if (!ccedRevenue && !ccedProjects && !ccedDistrict) return null;

  // heroStats carries the tape's standing lines: the unchanged 1/8-cent rate
  // and the 58-project count. Both render verbatim from constants.
  const rateStat = measure.heroStats[0];
  const projectsStat = measure.heroStats[2];

  // The receipt total is a sum check: it must equal ccedRevenue.total.
  const points = ccedRevenue ? [...ccedRevenue.points] : [];
  const collected = points.reduce((sum, p) => sum + p.value, 0);

  const rise = (delay = 0) => ({
    initial: animate ? { opacity: 0, y: 16 } : (false as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT_REVEAL,
    transition: { duration: 0.5, delay: animate ? delay : 0, ease: PAPER_EASE },
  });

  // Split the twelve funded projects into two column-ordered ruled registers.
  const items = ccedProjects ? [...ccedProjects.items] : [];
  const mid = Math.ceil(items.length / 2);
  const registerColumns = [items.slice(0, mid), items.slice(mid)];

  const registerRow = (item: { name: string; summary: string }, i: number) => (
    <motion.li
      key={item.name}
      {...rise(ledgerDelay(i, 0.06))}
      className="border-b border-hairline py-3.5"
    >
      <p className="text-[0.9375rem] font-bold leading-snug text-ink sm:text-base">{item.name}</p>
      <p className="type-fine mt-1">{item.summary}</p>
    </motion.li>
  );

  return (
    <section aria-labelledby={headingId}>
      {/* Section header */}
      <motion.header {...rise()}>
        <KickerRule label="The plat and the receipt" bar={accent.field} />
        <h2 id={headingId} className="type-h2 mt-4 text-ink">
          The East Side keeps the receipts.
        </h2>
        {ccedRevenue && <p className="type-lede mt-4 max-w-prose text-ink/80">{ccedRevenue.note}</p>}
      </motion.header>

      {/* The spread: plat left (40%), receipt right (60%) on large screens */}
      <div
        className={cn(
          'mt-10 grid gap-12 sm:mt-12',
          ccedDistrict && ccedRevenue && 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10'
        )}
      >
        {/* THE PLAT */}
        {ccedDistrict && (
          <div>
            <DistrictMap
              {...ccedDistrict}
              accent={accent.field}
              heading="The plat"
              caption="The Central City Economic Development district, created by Kansas City voters in 2017."
            />

            {/* Filing block: the district's record, from keyFacts */}
            <motion.div {...rise(0.1)} className="mt-8">
              <p className="type-doc-label text-ink">District on file</p>
              <div className="mt-3 space-y-2.5">
                <LedgerRow size="sm" label="First approved by voters" figure="April 4, 2017" />
                <LedgerRow size="sm" label="Voter support in 2017" figure="60%" />
                <LedgerRow size="sm" label="Renewal on the ballot" figure="Aug 4, 2026" />
              </div>
              <p className="type-fine mt-3">{measure.ordinance}</p>
            </motion.div>
          </div>
        )}

        {/* THE RECEIPT */}
        {ccedRevenue && (
          <div>
            <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
              <span
                aria-hidden="true"
                className="inline-block h-[3px] w-6 shrink-0"
                style={{ backgroundColor: accent.field }}
              />
              The receipt
            </h3>
            <p className="type-fine mt-2 max-w-prose">{ccedRevenue.heading}</p>

            <motion.div {...rise(0.05)} className="mx-auto mt-6 w-full max-w-[24rem]">
              {/* Register tape: sheet body, open bottom edge, zigzag tear below */}
              <div className="border-x border-t border-hairline bg-sheet px-5 pb-7 pt-6 shadow-print sm:px-6">
                <header className="text-center">
                  <p className="type-doc-label text-ink">Central City Economic Development</p>
                  <p className="type-doc-label mt-1.5 text-ink-soft">
                    1/8-cent sales tax · Kansas City, Missouri
                  </p>
                </header>

                <div aria-hidden="true" className="perforation mt-4" />

                <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                  <motion.li {...rise(ledgerDelay(0, 0.07))}>
                    <LedgerRow size="sm" label={rateStat.label} figure={rateStat.value} />
                  </motion.li>
                  {points.map((p, i) => (
                    <motion.li key={p.label} {...rise(ledgerDelay(i + 1, 0.07))}>
                      <LedgerRow
                        size="sm"
                        label={p.label}
                        figure={fullUSD(p.value)}
                        className="[&>div]:flex-wrap"
                        labelClassName="tabular-nums"
                      />
                    </motion.li>
                  ))}
                </ul>

                {/* Double-rule subtotal: summed from the nine fiscal years */}
                <motion.div {...rise(0.55)} className="mt-4">
                  <LedgerRow
                    total
                    size="lg"
                    label={`Collected since ${points[0]?.label}`}
                    figure={<PrintedCounter end={collected} prefix="$" />}
                    figureColor={accent.inkOnPaper}
                    className="[&>div]:flex-wrap"
                    figureClassName="text-lg sm:text-2xl"
                  />
                </motion.div>

                {/* $88,000,000+ is the long form of the heroStats "$88M+" figure */}
                <motion.div {...rise(0.62)} className="mt-3">
                  <LedgerRow
                    size="sm"
                    label={`Directed into ${projectsStat.value} projects`}
                    figure="$88,000,000+"
                    className="[&>div]:flex-wrap"
                  />
                </motion.div>

                {/* The stamp lands last in the group */}
                <div className="mt-7 text-center">
                  <Stamp ink={accent.inkOnPaper} land={animate} delay={0.6} rotate={-4}>
                    Renewal · Not a new tax
                  </Stamp>
                </div>

                <motion.div {...rise(0.7)} className="mt-6 space-y-1 text-center">
                  <p className="type-fine">
                    The current authorization expires September 30, 2027 if the renewal does not
                    pass.
                  </p>
                  <p className="type-fine">
                    A sales tax, not a bond. It is not repaid from utility fees or property taxes.
                  </p>
                </motion.div>
              </div>
              <div aria-hidden="true" className="receipt-tear" />
            </motion.div>
          </div>
        )}
      </div>

      {/* FUNDED ON THE EAST SIDE: all twelve projects as a ruled register */}
      {ccedProjects && (
        <div className="mt-14 sm:mt-16">
          <motion.h3
            {...rise()}
            className="mb-5 flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:mb-6 sm:text-xl"
          >
            <span
              aria-hidden="true"
              className="inline-block h-[3px] w-6 shrink-0"
              style={{ backgroundColor: accent.field }}
            />
            {ccedProjects.heading}
          </motion.h3>

          <div aria-hidden="true" className="rule-heavy" />
          <div className="md:grid md:grid-cols-2 md:gap-x-10">
            {registerColumns.map((column, c) => (
              <ul key={c} className="m-0 list-none p-0">
                {column.map((item, i) => registerRow(item, c * mid + i))}
              </ul>
            ))}
          </div>
          <p className="type-fine mt-4">
            {items.length} of the {projectsStat.value} projects the City reports funding through
            the CCED program since 2017.
          </p>
        </div>
      )}
    </section>
  );
}
