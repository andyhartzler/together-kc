// Generates public/llms.txt and public/llms-full.txt for the August 4, 2026
// campaign from the site's real data modules (lib/constants.ts and
// lib/polling-data.ts), so the files never drift from what the site says.
// Run: node scripts/generate-llms.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUGUST_BALLOT, ELECTION_RESULTS } from '../lib/constants.ts';
import {
  EARLY_VOTING_INFO,
  EARLY_VOTING_LOCATIONS,
  ELECTION_DAY_INFO,
  COUNTY_ELECTION_BOARDS,
} from '../lib/polling-data.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ballotOrder = [...AUGUST_BALLOT.measures].sort((a, b) =>
  parseInt(a.officialQuestion.number.replace(/\D/g, ''), 10) -
  parseInt(b.officialQuestion.number.replace(/\D/g, ''), 10)
);

const measureLines = ballotOrder
  .map(
    (m) =>
      `- ${m.officialQuestion.number} - ${m.name} (${m.amount}): ${m.cardSub} Cost to voters: ${m.costChip}. Vote threshold: ${m.voteThreshold}. Details: https://together-kc.com/questions/${m.slug}`
  )
  .join('\n');

const costPoints = AUGUST_BALLOT.costs.points.map((p) => `- ${p}`).join('\n');

const faqBlock = AUGUST_BALLOT.faqs
  .map((f) => `### ${f.question}\n${f.answer}`)
  .join('\n\n');

const boards = Object.entries(COUNTY_ELECTION_BOARDS)
  .map(
    ([county, b]) =>
      `### ${county} County (${b.name})\n- Phone: ${b.phone}\n- Website: ${b.website}\n- Address: ${b.address}`
  )
  .join('\n\n');

const earlyVoting = EARLY_VOTING_LOCATIONS.map((loc) => {
  const hours = loc.hours
    .map((h) => {
      if (h.closed) return `  - ${h.label} (${h.dates}): CLOSED`;
      if (h.unverifiedHours || !h.open)
        return `  - ${h.label} (${h.dates}): open for early voting; confirm exact daily hours at ${EARLY_VOTING_INFO.kcebUrl}`;
      return `  - ${h.label} (${h.dates}): ${h.open} to ${h.close}`;
    })
    .join('\n');
  return `### ${loc.county} County - ${loc.name}\n- Address: ${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}\n${hours}${loc.notes ? `\n- Note: ${loc.notes}` : ''}`;
}).join('\n\n');

const lookups = `- Jackson County lookup: ${ELECTION_DAY_INFO.lookupUrls.jackson}
- Clay County lookup: ${ELECTION_DAY_INFO.lookupUrls.clay}
- Platte County lookup: ${ELECTION_DAY_INFO.lookupUrls.platte}
- Cass County lookup: ${ELECTION_DAY_INFO.lookupUrls.cass}
- Missouri Secretary of State voter portal: ${ELECTION_DAY_INFO.voterLookup}`;

const shared = `## What Is On the Ballot - August 4, 2026

Kansas City voters will see five city questions on the August 4, 2026 ballot, placed there by the City Council. Together KC urges a YES vote on all five. None of them creates a new tax or raises a tax rate. The four bond questions total about $1.7 billion invested back into Kansas City.

${measureLines}

## What It Costs Voters

${AUGUST_BALLOT.costs.body}

${costPoints}

${AUGUST_BALLOT.costs.bottomLine}

## Important Dates

- Voter registration deadline: about July 8, 2026 (fourth Wednesday before the election; confirm the exact date with your county election board)
- Early in-person voting (no excuse needed): ${EARLY_VOTING_INFO.windowLabel}
- Election Day: Tuesday, ${ELECTION_DAY_INFO.dateFormatted}, polls open ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close}

## How to Check Your Voter Registration

Visit the Missouri Secretary of State voter portal:
${ELECTION_DAY_INFO.voterLookup}

You can verify your registration status, find your assigned polling place, and view your sample ballot.

## Sample Ballots

Always confirm the official wording and question order on your authenticated sample ballot from the Kansas City Election Board: https://kceb.org

## What to Bring to Vote

Missouri requires a valid photo ID to vote. Acceptable forms include:
- Missouri driver's license or non-driver ID
- US passport
- Military ID
- Other government-issued photo ID

If you do not have a photo ID, you can still vote by signing a sworn statement at the polls.

## Early Voting Locations (${EARLY_VOTING_INFO.windowLabel})

${EARLY_VOTING_INFO.satelliteSitesNote}

${earlyVoting}

## Election Day - ${ELECTION_DAY_INFO.dateFormatted}

- Polls are open ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close}.
- ${ELECTION_DAY_INFO.notes}
- ${ELECTION_DAY_INFO.jacksonCountyNote}
- Find your polling place with Together KC's lookup tool: https://together-kc.com/vote (county pages: /vote/jackson-county, /vote/clay-county, /vote/platte-county, /vote/cass-county)

${lookups}

## County Election Board Contact Information

${boards}

## Frequently Asked Questions

${faqBlock}

## Archived: April 7, 2026 Earnings Tax Renewal (WON)

Together KC led the successful campaign to renew the Kansas City 1% earnings tax on April 7, 2026. It passed with ${ELECTION_RESULTS.overallYesPercent}% voting YES (${ELECTION_RESULTS.totalYes.toLocaleString('en-US')} yes votes of ${ELECTION_RESULTS.totalVotes.toLocaleString('en-US')} cast). County results: ${ELECTION_RESULTS.counties.map((c) => `${c.name} ${c.yesPercent}% YES`).join(', ')}. The earnings tax has been in place since 1963, generates about $373 million annually, and funds roughly 47% of Kansas City's general fund: fire, police, EMS, road maintenance, trash collection, and snow removal. The next renewal vote will come in 2031.

The archived e-tax campaign site lives at:
- https://together-kc.com/etax (campaign home)
- https://together-kc.com/etax/victory (results)
- https://together-kc.com/etax/faqs (e-tax FAQs)
- https://together-kc.com/etax/endorsements (who endorsed renewal)

## Campaign Information

Together KC is a Kansas City civic campaign organization.
- Website: https://together-kc.com
- Email: action@together-kc.com
- Facebook: https://www.facebook.com/TogetherKC/
- Instagram: https://www.instagram.com/togetherkcmo/
- TikTok: https://www.tiktok.com/@togetherkcmo
- X: https://x.com/TogetherKCMO
- Threads: https://www.threads.com/@togetherkcmo
`;

const header = (full) => `# Together KC - ${full ? 'COMPLETE Voting Guide - ' : ''}Vote YES on All Five - August 4, 2026 Kansas City Ballot
# Official voting guide: https://together-kc.com
# Contact: action@together-kc.com${full ? '\n# This is the extended version of llms.txt with official ballot language and full per-question detail.' : ''}

> Together KC is the Kansas City civic campaign urging voters to vote YES on all five Kansas City questions on the August 4, 2026 ballot. This file contains comprehensive voting information for the August 4, 2026 election. Together KC also led the successful April 7, 2026 earnings tax renewal campaign, now archived at https://together-kc.com/etax.

`;

const deepDetail = ballotOrder
  .map((m) => {
    const facts = m.keyFacts.map((f) => `- ${f}`).join('\n');
    const faqs = m.faqs
      .map((f) => `**${f.q}**\n${f.a}`)
      .join('\n\n');
    const sources = m.sources
      .map((s) => `- ${s.title}: ${s.url}`)
      .join('\n');
    return `### ${m.officialQuestion.number} - ${m.title}

The problem: ${m.narrative.problem}

What it does: ${m.narrative.whatItDoes}

Why it matters: ${m.narrative.whyItMatters}

What your YES does: ${m.narrative.whatYourYesDoes}

The honest cost answer: ${m.honestCost}

Key facts:
${facts}

Official ballot language (verbatim): "${m.officialQuestion.text.replace(/\n\n/g, ' ')}"

${m.officialQuestion.number} FAQs:

${faqs}

Sources for ${m.officialQuestion.number}:
${sources}`;
  })
  .join('\n\n');

const fullOnly = `## Per-Question Detail and Official Ballot Language

${deepDetail}

`;

const llms = header(false) + shared;
const llmsFull =
  header(true) +
  shared.replace(
    '## Archived: April 7, 2026',
    fullOnly + '## Archived: April 7, 2026'
  );

writeFileSync(join(root, 'public/llms.txt'), llms);
writeFileSync(join(root, 'public/llms-full.txt'), llmsFull);
console.log(
  `llms.txt: ${llms.split('\n').length} lines | llms-full.txt: ${llmsFull.split('\n').length} lines`
);
