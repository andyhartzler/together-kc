import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press Kit | Together KC',
  description: 'Media resources and press materials for the Together KC E-Tax Renewal Campaign.',
  robots: 'noindex, nofollow',
};

export default function PressKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
