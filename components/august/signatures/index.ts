// PAPER TRAIL signature sections: the one bespoke, per-measure artifact on
// each question page (the utility statement, the court file, the register,
// the work order, the plat and the receipt). MeasureDetail selects the
// component through the SIGNATURES map by measure.slug.
//
// CONTRACT (binding for signature authors):
// - Props are exactly `SignatureProps`: the FULL measure record from
//   AUGUST_BALLOT plus the resolved AccentInk trio. Nothing else is passed;
//   everything a signature needs must come from `measure`.
// - `accent.field` is FILL-ONLY (bars, oval fills, tabs, stair highlights,
//   stamps at large graphic size). Accent-colored TEXT on paper or a sheet
//   uses `accent.inkOnPaper`; text set ON an accent field uses
//   `accent.textOnField`. Avoid golden-ink for fine print (it clears AA only
//   at w700 18px+).
// - Every rendered number comes from `measure` or is derivable from it in
//   view code (summing a points array is fine). Never invent figures. Sum
//   checks must reconcile (housing register = 365; receipt = points sum).
// - Gate every block on data presence and return null when the measure
//   carries no signature data, so MeasureDetail can render unconditionally.
// - Compose from the restyled shared components (BarChartReveal,
//   FinancingLadder, TrendChart, ProjectShowcase, DistrictMap) and the paper
//   primitives in '@/components/august/paper'. Their prop APIs are stable;
//   pass `accent.field` as their `accent` prop and spread readonly constant
//   arrays into mutable copies ([...rows]).
// - Motion grammar: PAPER_EASE everywhere, whileInView once (-60px margin),
//   ledgerDelay() stagger for posting rows, max ONE Stamp per viewport and
//   it lands LAST in its group. The shared components already thread
//   useReducedMotion; do the same for any bespoke motion.
// - Copy rules: no em dashes, never flatten a measure's cost framing to a
//   free-of-tax claim, $0 always means tax RATE or an itemized per-tax
//   line, and never imply the five questions are the whole August 4 ballot.

import type { ComponentType } from 'react';
import type { AUGUST_BALLOT } from '@/lib/constants';
import type { AccentInk } from '@/components/august/accent';

import CleanWater from './CleanWater';
import Sewers from './Sewers';
import Housing from './Housing';
import CivicBuildings from './CivicBuildings';
import CentralCity from './CentralCity';

export type SignatureMeasure = (typeof AUGUST_BALLOT)['measures'][number];

export interface SignatureProps {
  /** The full measure record from AUGUST_BALLOT. Single source of truth. */
  measure: SignatureMeasure;
  /** Resolved ink trio for the measure's accent (see accent.ts). */
  accent: AccentInk;
}

export const SIGNATURES: Record<string, ComponentType<SignatureProps>> = {
  'clean-water': CleanWater,
  sewers: Sewers,
  housing: Housing,
  'civic-buildings': CivicBuildings,
  'central-city': CentralCity,
};

export { CleanWater, Sewers, Housing, CivicBuildings, CentralCity };
