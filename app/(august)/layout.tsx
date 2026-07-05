import type { Viewport } from 'next';
import AugustNav from '@/components/august/AugustNav';

// The August 4, 2026 ballot campaign is the front door of together-kc.com.
// Page-level metadata (title, OG, canonical) comes from the root layout for
// the hub and from generateMetadata for the /questions detail pages. The
// archived e-tax site lives under /etax with its own layout.

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
  return (
    <>
      <AugustNav />
      {children}
    </>
  );
}
