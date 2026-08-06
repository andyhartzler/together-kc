// Why this route group exists.
//
// /victory is a post-election result page. It must NOT carry the pre-election
// August chrome: app/(august)/layout.tsx renders AugustNav, which still says
// "How to Vote", "Find Your Polling Place", and a coral "Vote YES" pill that
// points at the polling-place finder. On August 5 that chrome is wrong, and
// the nav's white campaign lockup duplicated the one in the victory hero.
//
// Route groups do not affect the URL, so moving the directory here keeps the
// page at /victory while dropping it out of the (august) layout. This mirrors
// app/etax/victory, which sits outside app/etax/(site) for the same reason.
//
// Page metadata and the theme color live one level down, in
// app/(victory)/victory/layout.tsx.

export default function VictoryGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
