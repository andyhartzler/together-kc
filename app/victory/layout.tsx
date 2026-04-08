import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Kansas City E-Tax Renewed! | Together KC',
  description:
    'Kansas City voters overwhelmingly renewed the earnings tax with 75.45% voting YES on April 7, 2026. Thank you, Kansas City!',
  openGraph: {
    title: 'Kansas City E-Tax Renewed! | Together KC',
    description:
      '75.45% of voters said YES to renewing the Kansas City earnings tax on April 7, 2026.',
    url: 'https://together-kc.com/victory',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Kansas City E-Tax Renewed',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kansas City E-Tax Renewed! | Together KC',
    description:
      '75.45% of voters said YES to renewing the KC earnings tax.',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
};

export default function VictoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
