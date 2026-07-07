import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Together KC | Vote YES on All Five · August 4, 2026',
  description:
    'Five Kansas City questions are on the August 4 ballot: clean water, sewers, affordable housing, civic buildings, and Central City. None of them raises your tax rate. Vote YES on all five.',
  openGraph: {
    title: 'Together KC | Vote YES on All Five · August 4, 2026',
    description:
      'Five Kansas City questions, one ballot, zero new tax rates. Learn each question and make your plan to vote by August 4, 2026.',
    url: 'https://together-kc.com/social',
    images: [
      {
        url: '/images/og-august.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES on All 5',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Together KC | Vote YES on All Five · August 4, 2026',
    description: 'Five Kansas City questions, one ballot, zero new tax rates.',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
