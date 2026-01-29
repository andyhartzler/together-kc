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
    default: 'Together KC | Vote YES to Renew the Kansas City Earnings Tax - April 7, 2026',
    template: '%s | Together KC',
  },
  description:
    'Vote YES to renew the Kansas City earnings tax on April 7, 2026. The 1% e-tax funds $373 million annually — 47% of city services including fire, police, EMS, roads, and trash collection.',
  keywords: [
    // Primary keywords
    'Kansas City earnings tax',
    'KC e-tax',
    'KC etax',
    'e-tax renewal',
    'earnings tax renewal 2026',
    // Secondary keywords
    'Vote YES Kansas City',
    'April 7 2026 election',
    'KC first responders funding',
    'Together KC',
    // Local keywords
    'Kansas City Missouri tax',
    'KCMO earnings tax',
    'Jackson County election',
    // Long-tail keywords
    'what does KC earnings tax fund',
    'KC municipal tax renewal',
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
    title: 'Together KC | Vote YES to Renew the Kansas City Earnings Tax',
    description:
      'The earnings tax funds 47% of city services: fire, police, EMS, roads, and trash collection. Vote YES on April 7, 2026.',
    type: 'website',
    locale: 'en_US',
    url: 'https://together-kc.com',
    siteName: 'Together KC',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES to renew the earnings tax on April 7, 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Together KC | Vote YES to Renew the KC Earnings Tax',
    description:
      'The e-tax funds 47% of KC city services. Vote YES on April 7, 2026.',
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
