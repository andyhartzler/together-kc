// ---------------------------------------------------------------------------
// AUGUST 4, 2026 RESULTS
//
// Source of truth: the official county election board reports for the City of
// Kansas City, Missouri special election, as reported by the Jackson County,
// Clay County, and Platte County boards. These totals are not yet certified. A
// small portion of Kansas City sits in Cass County and is NOT included here.
//
// Election-night partials that circulated in news coverage (75.6 / 69.3 / 69.2
// / 80.9 / 81.6) were incomplete. Do not reconcile these numbers toward those.
//
// VOTE WORDING RULE: never print a no-vote count. Every figure is stated as
// "<yes> yes of <total> votes". That is why CountyResult and MeasureResult
// carry `total` and no `no` field.
//
// Shared by the /victory page and the /social link-in-bio page so the two can
// never drift apart.
// ---------------------------------------------------------------------------

import { AUGUST_BALLOT } from '@/lib/constants';

export type MeasureSlug = (typeof AUGUST_BALLOT.measures)[number]['slug'];
export type CountyKey = 'jackson' | 'clay' | 'platte';

export interface CountyResult {
  yes: number;
  total: number;
  yesPercent: number;
}

export interface MeasureResult {
  yes: number;
  total: number;
  yesPercent: number;
  /** Share of the vote the question actually had to clear to pass. */
  thresholdPercent: number;
  /** Short tick label that sits under the threshold marker. */
  thresholdTick: string;
  /** Full-width sentence under the bar, so nothing has to fit beside the tick. */
  thresholdLine: string;
  /** Points the question finished above its own bar. */
  marginPoints: number;
  /**
   * What the yes vote actually authorized, as a labelled line. The raw
   * `amount` field in constants is not parallel across the five (four are bare
   * dollar figures, one is a sentence), so the page carries its own wording.
   */
  authorized: string;
  /** Darkened accent that clears AA contrast for text on white. */
  ink: string;
  counties: Record<CountyKey, CountyResult>;
}

export const RESULTS: Record<MeasureSlug, MeasureResult> = {
  housing: {
    yes: 72489,
    total: 97163,
    yesPercent: 74.61,
    thresholdPercent: 57.14,
    thresholdTick: '57.1%',
    thresholdLine: 'Needed 57.1%, a four-sevenths supermajority',
    marginPoints: 17.5,
    authorized: '$100 million in general obligation bonds authorized',
    ink: '#b3231e',
    counties: {
      jackson: { yes: 46945, total: 56811, yesPercent: 82.63 },
      clay: { yes: 17705, total: 28209, yesPercent: 62.76 },
      platte: { yes: 7839, total: 12143, yesPercent: 64.56 },
    },
  },
  'civic-buildings': {
    yes: 65908,
    total: 96357,
    yesPercent: 68.4,
    thresholdPercent: 57.14,
    thresholdTick: '57.1%',
    thresholdLine: 'Needed 57.1%, a four-sevenths supermajority',
    marginPoints: 11.3,
    authorized: '$100 million in general obligation bonds authorized',
    ink: '#8a5a00',
    counties: {
      jackson: { yes: 42752, total: 56358, yesPercent: 75.86 },
      clay: { yes: 16174, total: 28040, yesPercent: 57.68 },
      platte: { yes: 6982, total: 11959, yesPercent: 58.38 },
    },
  },
  'central-city': {
    yes: 65724,
    total: 96441,
    yesPercent: 68.15,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 18.1,
    authorized: 'One-eighth-cent sales tax, renewed for 10 years',
    ink: '#a03d0f',
    counties: {
      jackson: { yes: 43760, total: 56402, yesPercent: 77.59 },
      clay: { yes: 15251, total: 28022, yesPercent: 54.43 },
      platte: { yes: 6713, total: 12017, yesPercent: 55.86 },
    },
  },
  'clean-water': {
    yes: 77747,
    total: 96546,
    yesPercent: 80.53,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 30.5,
    authorized: '$750 million in waterworks revenue bonds authorized',
    ink: '#17558f',
    counties: {
      jackson: { yes: 47365, total: 56338, yesPercent: 84.07 },
      clay: { yes: 21112, total: 28164, yesPercent: 74.96 },
      platte: { yes: 9270, total: 12044, yesPercent: 76.97 },
    },
  },
  sewers: {
    yes: 78603,
    total: 96791,
    yesPercent: 81.21,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 31.2,
    authorized: '$750 million in sanitary sewer revenue bonds authorized',
    ink: '#1e3a5f',
    counties: {
      jackson: { yes: 48119, total: 56586, yesPercent: 85.04 },
      clay: { yes: 21206, total: 28170, yesPercent: 75.28 },
      platte: { yes: 9278, total: 12035, yesPercent: 77.09 },
    },
  },
};

// What each question was, what was riding on it, and how it landed. Kept to
// three short beats so the expanded panel stays scannable.
export const BRIEFS: Record<MeasureSlug, { about: string; stake: string }> = {
  housing: {
    about:
      'A $100 million general obligation bond to refill the Housing Trust Fund, which finances building and rehabbing homes for very low to moderate income households.',
    stake:
      'Kansas City is short roughly 64,000 affordable homes. The fund had been running on about $10 million a year. A yes roughly doubles that, and a no would have left the trust fund close to empty.',
  },
  'civic-buildings': {
    about:
      'A $100 million general obligation bond to repair and preserve the buildings the city owns together: Bartle Hall, the convention center, and City Hall, which opened in 1937.',
    stake:
      'Deferred repairs get more expensive every year, and the convention business KC competes for depends on these rooms being in working order.',
  },
  'central-city': {
    about:
      'A renewal of the one-eighth-cent Central City Economic Development sales tax for another 10 years, at exactly the rate it has been since 2017.',
    stake:
      'The tax has put more than $88 million into 58 East Side projects. It was set to expire on September 30, 2027, and a no would have ended it with no replacement.',
  },
  'clean-water': {
    about:
      'A $750 million revenue bond to replace aging water mains and upgrade treatment across a system of about 2,800 miles of pipe serving roughly 172,000 customers.',
    stake:
      'KC Water faces about $1.2 billion in five year capital needs. Revenue bonds are the cheapest way to pay for work that has to happen either way, so a no would have raised the long run cost.',
  },
  sewers: {
    about:
      'A $750 million revenue bond funding the Smart Sewer program, the federally required cleanup of the sewer system under a consent decree.',
    stake:
      'The city is legally obligated to capture 85% of wet weather flow by 2040 and keep raw sewage out of the Blue and Missouri rivers. The work is mandatory, so the only real question was how to pay for it.',
  },
};

export const COUNTIES: { key: CountyKey; name: string; swatch: string; ink: string }[] = [
  { key: 'jackson', name: 'Jackson County', swatch: '#1e3a5f', ink: '#1e3a5f' },
  { key: 'clay', name: 'Clay County', swatch: '#4a90d9', ink: '#17558f' },
  { key: 'platte', name: 'Platte County', swatch: '#d2561e', ink: '#a03d0f' },
];

// Ballot order (Question 1 through Question 5), derived from the official
// question numbers in constants rather than the authoring order of the array.
const ballotNumber = (m: (typeof AUGUST_BALLOT.measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);

export const ORDERED_MEASURES = [...AUGUST_BALLOT.measures].sort(
  (a, b) => ballotNumber(a) - ballotNumber(b)
);

export const SUPERMAJORITY = 'Four-sevenths supermajority';

// Bond authorization: the four bond questions only. The Central City question
// is a sales tax renewal and adds no bond authorization.
export const BOND_TOTAL_BILLIONS = 1.7;

// ---------------------------------------------------------------------------
// Confetti
//
// Scatter comes from a seeded hash rather than Math.random, so the particles
// are pure values: identical on the server and the client (no hydration
// mismatch) and stable across re-renders.
// ---------------------------------------------------------------------------
