import type { Metadata } from 'next';

// Committee-level privacy policy and calling/texting terms. Restored for the
// August 4, 2026 cycle (the old Squarespace-era /privacy page was retired when
// the site was rebuilt) because voter-outreach call and text programs require
// a published policy URL.
export const metadata: Metadata = {
  // Absolute title: the root layout sets a `%s | Together KC` template, so a
  // plain string here would duplicate the suffix.
  title: { absolute: 'Privacy Policy & Terms | Together KC' },
  description:
    'How Together KC collects, uses, and protects your personal information, plus the terms for our informational call and text message programs.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy & Terms | Together KC',
    description:
      'How Together KC collects, uses, and protects your personal information.',
    url: 'https://together-kc.com/privacy',
    siteName: 'Together KC',
    images: [{ url: '/images/og-august.png', width: 1200, height: 630, alt: 'Together KC' }],
    type: 'website',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
