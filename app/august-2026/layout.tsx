import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Vote YES on All Five | August 4, 2026 Kansas City Ballot',
  description:
    'Five Kansas City questions are on the August 4, 2026 ballot: clean water, sewers, affordable housing, civic buildings, and Central City reinvestment. None of them raises your tax rate. Vote YES on all five.',
  alternates: {
    canonical: 'https://together-kc.com/august-2026',
  },
  openGraph: {
    title: 'Vote YES on All Five | August 4, 2026 Kansas City Ballot',
    description:
      'Clean water, sewers, affordable housing, civic buildings, and Central City reinvestment. Five questions, no tax-rate increase. Vote YES on all five on August 4, 2026.',
    url: 'https://together-kc.com/august-2026',
    type: 'website',
    siteName: 'Together KC',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES on all five August 4, 2026 ballot questions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vote YES on All Five | August 4, 2026 KC Ballot',
    description:
      'Five Kansas City ballot questions, no tax-rate increase. Vote YES on all five on August 4, 2026.',
    images: ['/images/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
};

export default function AugustBallotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
