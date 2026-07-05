import type { Metadata } from 'next';
import ModalLandingPage from '@/components/ui/ModalLandingPage';

export const metadata: Metadata = {
  title: 'Add Your Endorsement',
  description:
    'Join the growing list of individuals and organizations endorsing the renewal of the Kansas City earnings tax.',
  openGraph: {
    title: 'Add Your Endorsement | Together KC',
    description:
      'Join supporters endorsing the renewal of the KC earnings tax. Vote YES on April 7, 2026.',
    url: 'https://together-kc.com/etax/endorse',
  },
};

export default function EndorsePage() {
  return <ModalLandingPage view="endorse" />;
}
