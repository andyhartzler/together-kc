import type { Metadata } from 'next';
import ModalLandingPage from '@/components/ui/ModalLandingPage';

export const metadata: Metadata = {
  title: 'Find Your Polling Location',
  description:
    'Find your polling location in Kansas City. KC spans Jackson, Clay, Platte, and Cass counties. Vote YES on April 7, 2026.',
  openGraph: {
    title: 'Find Your Polling Location | Together KC',
    description:
      'Find where to vote in Kansas City. Vote YES to renew the earnings tax on April 7, 2026.',
    url: 'https://together-kc.com/find-polling',
  },
};

export default function FindPollingPage() {
  return <ModalLandingPage view="findPolling" />;
}
