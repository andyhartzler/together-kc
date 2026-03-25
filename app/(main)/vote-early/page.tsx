import type { Metadata } from 'next';
import VoteEarlyPage from './VoteEarlyPage';

export const metadata: Metadata = {
  title: 'Vote Early - Find Your Polling Location',
  description:
    'Find early voting locations in Kansas City for the April 7, 2026 election. Interactive map with hours, directions, and real-time open/closed status.',
  openGraph: {
    title: 'Vote Early | Together KC',
    description:
      'Early voting is open now! Find the nearest early voting location in Kansas City. Vote YES to renew the earnings tax.',
    url: 'https://together-kc.com/vote-early',
  },
};

export default function Page() {
  return <VoteEarlyPage />;
}
