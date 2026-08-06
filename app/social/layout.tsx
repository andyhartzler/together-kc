import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Together KC | Kansas City Voted YES on All Five',
  description:
    'Kansas City passed all five questions on the August 4, 2026 ballot: affordable housing 74.6%, civic buildings 68.4%, Central City 68.1%, clean water 80.5%, and sewers 81.2%. About 97,000 ballots cast.',
  openGraph: {
    title: 'Kansas City Voted YES on All Five',
    description:
      'All five August 4, 2026 ballot questions passed, authorizing about $1.7 billion for clean water, sewers, affordable housing, and the civic buildings we share. None of the five raises your tax rate. Thank you, Kansas City.',
    url: 'https://together-kc.com/social',
    images: [
      {
        url: '/images/og-victory.png',
        width: 1200,
        height: 630,
        alt: 'Kansas City voted YES on all five, August 4, 2026.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kansas City Voted YES on All Five',
    description: 'All five August 4, 2026 ballot questions passed. About $1.7 billion authorized, and none of the five raises your tax rate.',
    images: ['/images/og-victory.png'],
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
