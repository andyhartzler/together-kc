import type { Metadata } from 'next';

// POST-ELECTION SWITCH (August 5, 2026).
//
// The five-question ballot hub is UNCHANGED and still lives in its original
// file, app/(august)/page.tsx. Nothing was moved, rewritten, or deleted. That
// file is simply shadowed at the apex right now by a single 307 redirect in
// next.config.ts ('/' -> '/victory'), so this route gives the hub a real,
// linkable URL of its own at /ballot.
//
// To put the hub back on the front door, delete that one redirect entry in
// next.config.ts. '/' serves the hub again immediately and this route keeps
// working as an alias. That is the routing half only: next.config.ts lists the
// nav, footer, back-link, canonical, and sitemap edits that have to go with it,
// including the `alternates.canonical` below, which would otherwise point the
// apex-served hub at /ballot.
//
// The import is relative on purpose: the '@/' alias would have to carry the
// literal '(august)' route-group parentheses through the path, which is easy
// to break on a later rename.
export { default } from '../page';

export const metadata: Metadata = {
  // The root layout used to hardcode a canonical of https://together-kc.com for
  // every page. The apex now redirects, so the hub declares its own.
  alternates: { canonical: '/ballot' },
};
