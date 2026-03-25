import type { Metadata } from 'next';
import { Suspense } from 'react';
import VotePage from './VotePage';

export const metadata: Metadata = {
  title: 'Where Do I Vote? | Together KC',
  description:
    'Find your voting location for the April 7, 2026 Kansas City earnings tax election. Early voting locations, Election Day polling places, directions, and hours.',
  openGraph: {
    title: 'Where Do I Vote? | Together KC',
    description:
      'Find early voting and Election Day locations in Kansas City. Vote YES to renew the earnings tax.',
    url: 'https://together-kc.com/vote',
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <VotePage />
    </Suspense>
  );
}
