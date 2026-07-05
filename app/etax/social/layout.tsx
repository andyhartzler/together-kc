import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Together KC | Vote YES on April 7, 2026',
  description: 'Vote YES to renew the Kansas City earnings tax. Check your registration, find your polling location, and add your endorsement.',
  openGraph: {
    title: 'Together KC | Vote YES on April 7, 2026',
    description: 'Vote YES to renew the Kansas City earnings tax. The e-tax funds nearly half of city services.',
    url: 'https://together-kc.com/etax/social',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Together KC | Vote YES on April 7, 2026',
    description: 'Vote YES to renew the Kansas City earnings tax.',
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
