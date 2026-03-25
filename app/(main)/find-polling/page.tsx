import type { Metadata } from 'next';
import FindPollingPage from './FindPollingPage';

export const metadata: Metadata = {
  title: 'Find Your Polling Location',
  description:
    'Find your Election Day polling location in Kansas City. Enter your address to see which county you are in and find where to vote on April 7, 2026.',
  openGraph: {
    title: 'Find Your Polling Location | Together KC',
    description:
      'Find where to vote on Election Day in Kansas City. Vote YES to renew the earnings tax on April 7, 2026.',
    url: 'https://together-kc.com/find-polling',
  },
};

export default function Page() {
  return <FindPollingPage />;
}
