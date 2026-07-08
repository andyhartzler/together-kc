import type { Metadata } from 'next';

// The August press/media kit lives at /press (the old /press-kit URL forwards
// here from next.config). It is a public resource for reporters, so it is
// indexable, unlike the archived e-tax press kit under /etax.
export const metadata: Metadata = {
  // Absolute title: the root layout sets a `%s | Together KC` template, so a
  // plain string here would duplicate the suffix.
  title: { absolute: 'Press & Media Kit for the August 4 Ballot | Together KC' },
  description:
    'Media resources for the five Kansas City questions on the August 4, 2026 ballot: official ballot language, key facts, talking points, downloadable one-pager, logos, and a media contact.',
  alternates: { canonical: '/press' },
  openGraph: {
    title: 'Press & Media Kit for the August 4 Ballot | Together KC',
    description:
      'Everything reporters need to cover the five questions on the August 4, 2026 Kansas City ballot.',
    url: 'https://together-kc.com/press',
    siteName: 'Together KC',
    images: [{ url: '/images/og-august.png', width: 1200, height: 630, alt: 'Together KC: Vote YES on all five' }],
    type: 'website',
  },
};

export default function PressKitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
