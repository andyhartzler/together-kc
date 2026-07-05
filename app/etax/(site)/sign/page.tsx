import type { Metadata } from 'next';
import ModalLandingPage from '@/components/ui/ModalLandingPage';

export const metadata: Metadata = {
  title: 'Get a Free Yard Sign',
  description:
    'Request a free Vote Yes yard sign to show your support for renewing the Kansas City earnings tax. Pick up or get it delivered!',
  openGraph: {
    title: 'Get a Free Vote Yes Yard Sign | Together KC',
    description:
      'Request a free yard sign to show your support for renewing the KC earnings tax on April 7, 2026.',
    url: 'https://together-kc.com/etax/sign',
  },
};

export default function SignPage() {
  return <ModalLandingPage view="yardSign" />;
}
