import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import JsonLd, {
  organizationSchema,
  websiteSchema,
  localGovernmentSchema,
} from '@/components/seo/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://together-kc.com'),
  title: {
    default: 'Together KC | Vote YES on All Five Kansas City Ballot Questions, August 4, 2026',
    template: '%s | Together KC',
  },
  description:
    'Five Kansas City questions are on the August 4, 2026 ballot: clean water, sewers, affordable housing, civic buildings, and Central City reinvestment. None of them raises your tax rate. Vote YES on all five.',
  keywords: [
    // Primary keywords
    'August 4 2026 Kansas City ballot',
    'Vote YES on all five',
    'Kansas City ballot questions',
    'KC clean water bonds',
    'KC sewer bonds',
    // Secondary keywords
    'Kansas City affordable housing bond',
    'Kansas City civic buildings bond',
    'Central City reinvestment Kansas City',
    'Vote YES Kansas City',
    'Together KC',
    // Local keywords
    'Kansas City Missouri election',
    'KCMO August election',
    'Jackson County election',
    // Long-tail keywords
    'how to vote Kansas City August 2026',
    'Kansas City ballot guide 2026',
  ],
  authors: [{ name: SITE_CONFIG.organization }],
  creator: 'Together KC',
  publisher: 'Together KC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Together KC | Vote YES on All Five Kansas City Ballot Questions',
    description:
      'Clean water, sewers, affordable housing, civic buildings, and Central City reinvestment. Five questions on the August 4, 2026 ballot, none raising your tax rate. Vote YES on all five.',
    type: 'website',
    locale: 'en_US',
    url: 'https://together-kc.com',
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
    title: 'Together KC | Vote YES on All Five',
    description:
      'Five Kansas City ballot questions, none raising your tax rate. Vote YES on all five on August 4, 2026.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://together-kc.com',
  },
  category: 'politics',
  other: {
    // Geo meta tags for local SEO
    'geo.region': 'US-MO',
    'geo.placename': 'Kansas City',
    'geo.position': '39.0997;-94.5786',
    ICBM: '39.0997, -94.5786',
    // Search engine verification
    'msvalidate.01': 'A178FB640646379103FB19B51B4D3987',
    // 'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={localGovernmentSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
