import type { Metadata, Viewport } from 'next';

// The page itself is a client component (counters, confetti, scroll reveals),
// so its metadata lives here. Title is `absolute` because the root layout sets
// a "%s | Together KC" template and this title already carries the org name.
const TITLE = 'Kansas City Voted YES on All Five | Together KC';
const DESCRIPTION =
  'Kansas City passed all five questions on the August 4, 2026 ballot: affordable housing 74.6%, civic buildings 68.4%, Central City 68.1%, clean water 80.5%, and sewers 81.2%. About 97,000 ballots cast.';
const SHORT_DESCRIPTION =
  'All five August 4, 2026 ballot questions passed, authorizing about $1.7 billion for clean water, sewers, affordable housing, and the civic buildings we share. None of the five raises your tax rate. Thank you, Kansas City.';

// Its own card, not the pre-election /images/og-august.png. The apex redirects
// here, so every share of together-kc.com renders this: a "voted YES on all
// five" headline over artwork that still asked people to go vote read as a
// stale or wrong link.
const OG_IMAGE = '/images/og-victory.png';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/victory' },
  openGraph: {
    title: 'Kansas City Voted YES on All Five',
    description: SHORT_DESCRIPTION,
    url: 'https://together-kc.com/victory',
    siteName: 'Together KC',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Kansas City voted YES on all five: housing 74.6%, civic buildings 68.4%, Central City 68.1%, clean water 80.5%, sewers 81.2%. August 4, 2026.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kansas City Voted YES on All Five',
    description: SHORT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
};

export default function VictoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
