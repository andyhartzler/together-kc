# PAPER TRAIL — Design spec for the August hub + question pages overhaul

Synthesized 2026-07-06 from a three-concept competition (civic-broadsheet, ballot-artifact, kc-monumental).
Full concept documents: `/private/tmp/claude-502/-Users-andrew/8bdc7f48-1c80-4901-8858-4147dcbf8773/tasks/woqerxcf6.output`
(JSON; concepts[0]=broadsheet, [1]=artifact, [2]=monumental. Read your sections for texture; THIS FILE IS BINDING where they conflict.)

## The concept

together-kc.com becomes the most beautiful civic document Kansas City has ever received: a voter's
dossier printed on warm paper, set in monumental Geist, built from the honest materials of public
life. The sample ballot, the utility statement, the court file, the housing register, the work
order, the district plat. The KC skyline is structure, not decoration. Coral means "act" and
nothing else. Every number sits in a ruled ledger. What a voter remembers: the ballot filled
itself in, and the site never asked them to trust a vibe, only a record.

## What dies (both pages, no exceptions)

Drifting blurred gradient blobs; every `bg-gradient-to-br` hero/CTA field; all glassmorphism
(`.glass`, `backdrop-blur` chips, `bg-white/10` pills); the pulsing-dot pill eyebrow above every
section; FlipText; both Marquee bands; the bouncing scroll mouse; glow text-shadows; faint white
grid overlays; pill-shaped buttons; the five identical MeasureCards with sheen sweep; the
rounded-2xl stat tile grids; rounded-3xl shadow cards as default container; centered-by-default
composition; spring/bounce entrances.

**DO NOT delete existing globals.css utilities or components/ui files** — the /etax archive uses
them. The August pages simply stop importing them. Only ADD to globals.css.

## Tokens (add to globals.css `:root` + `@theme inline`)

```
--paper: #f4efe4;        /* page canvas (Andrew's proven warm tint) */
--paper-deep: #ece4d2;   /* tint bands */
--sheet: #fffdf8;        /* document sheets sitting on paper */
--ink: #1e3a5f;          /* headlines, rules (= navy) */
--ink-soft: rgba(30,58,95,.62);   /* captions, datelines */
--hairline: rgba(30,58,95,.16);
--coral-press: #c62828;  /* hover/small-text coral, AA on paper */
--sky-ink: #2b6cb0;      /* AA text variants of accents on paper */
--golden-ink: #9a6b0f;
--sunrise-ink: #b3481a;
```

Accent rule, enforced everywhere: raw swatches (sky #4a90d9, golden #f5a623, sunrise/orange,
coral #e53935) are FILL-ONLY (bars, oval fills, file tabs, stamps at large size, poster hero
fields). Any accent-colored TEXT on paper/sheet uses the ink variant. On golden and sunrise
fields, text ink is navy; on sky/navy/coral fields, text ink is paper `#f4efe4` (never pure white).
Body text on paper: navy (headings 100%, body ~80%, captions --ink-soft). No pure #fff / #000 text.

## Type (Geist only; tabular-nums on every figure)

- display-xl (hub headline): clamp(3rem, 8.5vw, 7.25rem), w900, tracking -0.045em, leading 0.92
- display (detail hero punch): clamp(2.5rem, 6.5vw, 5.25rem), w900, -0.04em, 0.95
- figure (mega numbers: $0.00, 365, 64,000, 1937): clamp(3.25rem, 9vw, 7.5rem), w800, -0.03em, tabular
- h2 section heads: clamp(1.875rem, 3.5vw, 3rem), w800, -0.03em, 1.05
- lede/standfirst: clamp(1.125rem, 1.6vw, 1.375rem), w500, 1.55
- body: 1.0625rem / 1.7, w400, max-w ~42rem prose
- doc-label / kicker: 0.6875–0.75rem, w700, uppercase, tracking 0.18em
- ledger figures: 1.0625–1.25rem w700 tabular
- fine print: 0.8125rem, --ink-soft

Kicker lockup replaces every pill eyebrow: a 24x3px accent bar beside the doc-label text.
No monospace anywhere. No index numbering (Q1–Q5 official ballot numbers are allowed; they are
official, not decorative).

## Graphic vocabulary (new globals.css utilities + paper primitives)

- `.rule-hair` 1px var(--hairline); `.rule-heavy` 3px solid var(--ink);
  `.rule-total` double rule (1px + 3px gap + 1px navy) for ledger totals
- `.leader` dotted leaders between label and figure (flex + dotted background, min-width 2rem)
- `.perforation` dashed tear line for ballot/receipt sheets
- `.hatch` 45deg repeating-linear-gradient ink lines at 12% for the district plat
- Stamp: 2px double border in stamp ink, 3px radius, rotate(-3deg), uppercase w800,
  mix-blend-multiply on paper. Budget: max ONE stamp per viewport.
- Ballot oval: ~44x26px, 2.5px navy border, rounded-full; filled = coral fill + white check
  drawn via pathLength. (Keep the existing BallotSnapshot fill+draw animation grammar.)
- NO SKYLINE ART. Andrew rejected using the KC skyline SVG on the website (2026-07-06). The
  design stands on typography, rules, documents, and flat color. Do not add any skyline, cityscape,
  or building illustration anywhere.
- Sheet: bg --sheet, 1px hairline border, print shadow `0 1px 0 rgba(30,58,95,.06), 0 18px 40px -30px rgba(30,58,95,.25)`
  or offset `4px 4px 0 rgba(30,58,95,.12)` on artifacts. Square-ish corners (2–4px), never rounded-3xl.

## Buttons + links

Primary: coral rectangle, 3px radius, white w700, px-7 py-3.5, hard offset shadow
`4px 4px 0 var(--ink)`, hover translate(-2px,-2px) + shadow 6px 6px, active presses flat.
On accent fields, primary flips to paper bg + navy text + navy shadow.
Secondary: 2px navy border, navy text, hover fills navy with paper text.
Text links: navy, 2px underline offset 3px, hover coral. Focus: 2px coral ring offset 2 (keep).

## Motion

One orchestrated load per page (~1.1–1.4s, single variants tree), then quiet whileInView
(once, margin -60px) reveals. Ease: cubic-bezier(0.22, 1, 0.36, 1) everywhere. Transform +
opacity only. Rules draw scaleX origin-left; ledger rows post top-down 60–90ms stagger
(capped Math.min(i*0.08, 0.5)); bars grow scaleX/scaleY from origin with values fading after;
ovals fill then check-draws; stamps land LAST in their group (opacity 0, scale 1.06, rotate -1deg
→ scale 1, rotate -3deg, 0.35s). Hover: underlines, 3–6% accent washes, button press. Nothing
loops. Reduced motion (useReducedMotion, already threaded): everything renders in final state —
ovals filled, bars full, counters printed. No animation is load-bearing.

## HUB blueprint (app/(august)/page.tsx)

1. **Nav** (AugustNav restyle, shared with /vote + detail): solid paper bg always, hairline bottom
   rule (upgrades to heavy on scroll), full-color august logo always (drop the white-logo swap),
   navy links in doc-label type, coral rectangular Vote YES. Mobile drawer = paper sheet, ruled rows.
2. **Hero** (paper, left-aligned, min-h auto — the fold matters more than filling the viewport):
   document header line between hairline rules: "CITY OF KANSAS CITY, MISSOURI · SPECIAL ELECTION ·
   TUESDAY, AUGUST 4, 2026" (rules draw on load). Headline display-xl: Vote YES on all five —
   with YES inside a giant ballot oval whose coral ink fill sweeps in, white check draws after.
   Lede = hero.subhead. Two ledger lines w/ dotted leaders replacing glass chips:
   "Invested back into Kansas City ..... $1.7B" / "New tax rates ..... $0". CTAs: coral
   "See the five questions" (#questions) + secondary "How to vote" (#vote).
   Honest caveat promoted to the hero as fine print: the August 4 ballot includes other races;
   read your whole ballot.
3. **Hero base**: the hero closes with a full-width ruled index of the five questions: one row,
   five square swatch chips (correct ink for the question number) with measure names in doc-label
   type beside them, each a Link to its question, sitting between a heavy 3px navy rule above and
   a dashed fold line below (with a tiny centered "below the fold" label in --ink-soft caps).
   Mobile: the index becomes a horizontal scrollable row. Load: the rules draw scaleX, then chips
   rise staggered 70ms.
4. **The Sample Ballot** (#questions replaces BallotSnapshot; new `BallotSheet` component):
   sheet artifact max-w ~44–56rem, perforation top, letterhead "OFFICIAL BALLOT (SAMPLE) · Issues
   Only · Kansas City, Missouri · August 4, 2026" between double rules + tag "Sample, for voter
   education". Five rows in official ballot order (keep existing sort), each a full-row Link:
   ballot oval (fills+checks on scroll, 120ms stagger), QUESTION N doc-label in measure ink,
   name w800, cardPunch one-liner, costChip as plain small stamp-ink text. Hairlines between rows,
   hover = 3% swatch wash + name underline. Footer: rule-total, then ledger lines w/ leaders
   "Four bond questions ..... $1,700,000,000" / "New tax rate on any question ..... $0.00", the
   existing honest mechanism paragraph as fine print, and the REQUIRED footnote: this sample shows
   only the five KC questions; August 4 is a primary with other races; confirm your authenticated
   sample ballot with KCEB. Landing last: coral stamp "RECOMMENDED: YES ON ALL FIVE" overlapping
   the total rule.
5. **The Five Briefs** (replaces the MeasureCard grid): five full-width sheets/strips, each a
   single Link to /questions/[slug], alternating asymmetry, natural heights, each with a DIFFERENT
   miniature of its detail signature: Housing = 3 register rows + "365 units" total; Civic = 2
   work-order lines + "1937"; Central City = small hatched plat with street names; Clean Water =
   mini bill line "Property tax for these bonds ..... $0.00"; Sewers = "2010 / 2040" docket dates +
   mini 45→85% meter. Each carries file-tab QUESTION N in swatch, name h2, cardPunch, cardSub,
   bigStat ledger line, costChip, supermajority note (golden-ink) on Q1/Q2, coral "Read the full
   question" link. Ballot order.
6. **The Honest Part** (navy full-bleed band, flat ink, no texture beyond the 0.03 grain):
   left-aligned 7/5: kicker "The honest part", figure "$0.00" in paper ink with coral rule,
   costsShort.headline as h2 (tightened to "tax rates" language), three mechanism entries as a
   ruled ledger (water+sewers / housing+civic / central city). Right: "Where the $1.7 billion
   goes" as flat paper-ink ledger bars (rows from current BarChartReveal usage, direct labels,
   caption verbatim). No card wrapper.
7. **Make your plan** (#vote, paper): ruled schedule — 3px navy rule with three square nodes
   (coral on AUG 4): BY JULY 8 register / JULY 21 early voting opens / AUGUST 4 Election Day
   (dates in stat type, kicker+title+sub below; use voteSteps data verbatim). Coral "Find your
   polling place" → /vote + pollingNote fine print.
8. **FAQ** (#faqs): 3 hub questions, Accordion restyled: hairline dividers, no cards, w700 navy
   question, plus glyph rotating 45deg. Coral text link "See every measure in detail".
9. **Closing** (navy band): closing.heading display, left-aligned, paper ink; coral CTA → /vote;
   exploreLinks as underlined paper text links under doc-label "Elsewhere from Together KC";
   a rule-total double rule closes the band above Footer. Footer restyled minimally to sit on the
   system.

## DETAIL blueprint (MeasureDetail.client.tsx + components/august/signatures/*)

1. **Sticky bar**: keep show/hide + scroll-progress logic; restyle: paper bg, hairline bottom,
   square 10px swatch chip, rectangular accent YES button (correct ink), progress rule 2–3px accent.
2. **Poster hero** (flat accent field full-bleed, NO gradient/scrim/grid/blobs; warm grain 0.04 ok):
   left-aligned 7/5. Kicker lockup in field ink: "QUESTION N · AUGUST 4, 2026" + name.
   cardPunch display w900. cardSub lede. Meta line plain small-caps: costChip · voteThreshold ·
   ordinance. Buttons: paper-primary yesCta + bordered "Read the official question" (#official).
   Right column bottom-aligned: bigStat figure (AnimatedCounter ok) + label + costChip STAMP
   landing last. Hero bottom: a per-measure ABSTRACT rule motif, subtle and typographic, drawn in
   the field's darkened shade along the bottom edge (water: three thin wave rules; sewers: a
   dashed rule at "85%" of the width; housing: a repeating roofline zigzag hairline; civic: a
   stepped cornice rule; central-city: a hatched band). Keep these quiet: rules, not
   illustrations. Golden + sunrise heroes use navy ink for ALL text.
3. **Key numbers ledger**: heroStats as an open ruled ledger (3px rule top, hairline verticals,
   no boxes), 2x2 → 4-across.
4. **Official question** (#official): the ballot clipping artifact — sheet with perforated top,
   letterhead OFFICIAL BALLOT (SAMPLE) + Issues Only · KCEB, swatch QUESTION N box, verbatim
   officialQuestion.text, at the foot YES + NO ovals with YES ink-filled coral + drawn check and
   margin note "our recommendation". Figcaption disclaimer verbatim. Identical across measures on
   purpose (the spine).
5. **The story**: keep the 200px/1fr asymmetric narrative grid; kickers become bar+label lockups
   in accent ink; first paragraph at lede; hairlines between blocks; measure.title as section h2.
   One pull-stat floats per measure in the left column (from constants).
6. **Key facts**: two-column ruled list on paper, square accent bullets / small filled oval glyphs,
   no card.
7. **Signature section** (per-slug, extracted to `components/august/signatures/<Slug>.tsx`,
   selected by a slug map, data-gated like current vizFlags):
   - **clean-water (Q4, sky)** "THE UTILITY STATEMENT": white bill artifact, perforated top,
     KC WATER letterhead; ruled items: property tax for these bonds $0.00 / sales tax $0.00 /
     earnings tax $0.00, rule-total NEW TAXES $0.00; honest caveat verbatim as footnote. Exhibits:
     CIP ledger bars w/ coral bracket "this question authorizes $750M of $1.2B"; FinancingLadder as
     3-step stair (revenue bonds rung highlighted "THIS QUESTION", srfNote caption); the issuance
     series as a ledger with "79% YES · APRIL 2014" stamp (derive all figures from
     bondHistory.points; do NOT invent remaining-balance numbers unless derivable from constants).
   - **sewers (Q5, navy)** "THE COURT FILE": case-file header "IN RE: the Clean Water Act consent
     decree · entered 2010 · deadline 2040". Centerpiece THE CAPTURE METER: horizontal meter
     45% (2012) → 85% (2040) with dashed coral mandate rule drawn first, fill chasing it. CIP bars
     (OCP dominating); the 3 SRF applications as docket entries with rule-total $400M; "79% YES ·
     APRIL 2022" stamp; green-acres progress line if in constants. Timeline section carries the
     full 2010→2040 docket.
   - **housing (Q1, coral)** "THE REGISTER": "64,000" figure + "affordable homes short";
     the ten completedProjects as a true ledger on a sheet (name w700 + address fine, units
     tabular right, leaders), rows posting 60–80ms, rule-total "UNITS COMPLETED ..... 365";
     "what your YES adds" ledger ($61M+ awarded / ~3,000 units / ~$20M per year through 2032 —
     from constants); golden-ink "NEEDS 4/7 · 57.1%" note.
   - **civic-buildings (Q2, golden, navy ink)** "THE WORK ORDER": estimate sheet "WORK ORDER"
     w/ "1937" figure (City Hall's year); $75M/$25M split bar; costed line items as ledger rows;
     THE PUNCH LIST: City Hall items as square checkboxes ticking on scroll (golden-ink checks);
     honesty ledger "identified at City Hall $51M / funded $25M" plainly printed; note fine print.
   - **central-city (Q3, sunrise)** "THE PLAT AND THE RECEIPT": side-by-side spread. Plat: tall
     narrow hatched rectangle honoring the district's true proportion, boundary streets typeset on
     their true sides (9th St N, Gregory Blvd S, The Paseo W, Indiana Ave E), corner registration
     marks. Receipt: register tape w/ zigzag tear: nine FY lines with leaders posting in sequence,
     rule-total "COLLECTED SINCE 2018 ..... $98,960,087" (sum from constants points), "58 projects
     ..... $88,000,000+", sunrise stamp "RENEWAL · NOT A NEW TAX", fine print "expires September 30,
     2027 if not renewed". Below: all twelve ccedProjects as a ruled two-column register.
8. **The record** (timeline, keep current slug gating): ruled docket table on paper-deep band —
   date column in accent-ink tabular w800, hairline, entry right. No dots/rail.
9. **The honest part** (navy band): heading "Read the fine print. We printed it big." honestCost
   verbatim at lede size in paper ink (the emotional center), rule, "HOW THE FINANCING WORKS"
   doc-label + mechanism verbatim. Supermajority: ruled inset with a big "4/7" figure + existing
   copy verbatim. costChip + "{voteThreshold} to pass" as bordered small-caps tags (no glass).
10. **FAQ**: "{name}, answered", ruled accordions.
11. **Sources**: paper-deep band; numbered ruled citation list (tabular numerals in accent ink),
    underlined links; relatedLinks as bordered rectangular links; disclaimer verbatim.
12. **Prev/next**: two ruled strips with neighbor swatch file-tabs / 3px left rule, doc-labels
    PREVIOUS/NEXT QUESTION, neighbor name w800. Flat, no cards.
13. **CTA band**: flat accent field (hero grammar): yesCta display, vote dates line, paper-primary
    "Find your polling place", the three date facts as one ruled ledger row, back link. Footer.

## Hard rules

- ALL substantive content renders: ballot language verbatim, honestCost, mechanism, FAQs, sources,
  timelines, keyFacts, realExamples where present. This is a redesign, not a content cut.
- Every number comes from `AUGUST_BALLOT` in lib/constants.ts. Never hardcode a figure that isn't
  in or derivable from constants. Sum checks must reconcile (register = 365, receipt = points sum).
- NO em dashes in any new copy. No "tax-free". $0 always means tax RATE (or itemized per-tax).
  Never imply the five questions are the whole ballot.
- Mobile-first; test 320px (leaders wrap: two-line labels, figure bottom-aligned). AA contrast on
  every accent pairing (use the ink variants). Reduced-motion complete.
- Keep routes, props, data shapes. Small ADDITIVE fields to constants allowed (e.g. accent ink
  variants); if constants copy/data changes, rerun `node scripts/generate-llms.mjs`.
- Existing aria labels and focus management survive or improve. The whole-card link pattern stays.
- Keep the `(august)` route group structure and AugustNav mount points untouched.

## File ownership (build phase)

- FOUNDATIONS (first, alone): globals.css additions; `components/august/paper/` primitives
  (Sheet, Ledger/LedgerRow/Leader, Stamp, BallotOval, FileTab, KickerRule, PaperButton);
  accent ink map (additive, e.g. `components/august/accent.ts`); AugustNav restyle
  (verify on /, /questions/*, /vote).
- HUB BUILDER: app/(august)/page.tsx; new components/august/BallotSheet.tsx; new
  components/august/BriefStrip.tsx (or per-brief components); hub-only inline charts. Does not
  touch MeasureDetail, viz components, or shared paper primitives.
- DETAIL BUILDER: MeasureDetail.client.tsx; components/august/signatures/*; restyles of
  FinancingLadder, BarChartReveal, TrendChart, ProjectShowcase, DistrictMap (detail-only after the
  hub stops importing BarChartReveal/BallotSnapshot). Does not touch page.tsx or paper primitives.
- MeasureCard.tsx + BallotSnapshot.tsx become unused by the hub; leave the files in place.
