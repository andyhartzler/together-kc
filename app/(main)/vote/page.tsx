import type { Metadata } from 'next';
import ModalLandingPage from '@/components/ui/ModalLandingPage';

export const metadata: Metadata = {
  title: 'Vote YES | Together KC',
  description:
    'Vote YES to renew the Kansas City earnings tax on April 7, 2026. The 1% e-tax generates $373 million annually, funding 47% of city services.',
  openGraph: {
    title: 'Vote YES | Together KC',
    description:
      'Vote YES to renew the KC earnings tax on April 7, 2026. Fund fire, police, EMS, roads, and trash collection.',
    url: 'https://together-kc.com/vote',
  },
};

export default function VotePage() {
  return <ModalLandingPage view="main" />;
}
