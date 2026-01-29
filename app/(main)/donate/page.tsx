import type { Metadata } from 'next';
import DonateContent from './DonateContent';

export const metadata: Metadata = {
  title: 'Donate | Support the KC Earnings Tax Renewal Campaign',
  description:
    'Support the Together KC campaign to renew the Kansas City earnings tax. Your donation helps fund outreach to ensure voters know the facts about the April 7, 2026 election.',
  alternates: {
    canonical: 'https://together-kc.com/donate',
  },
  openGraph: {
    title: 'Donate | Support the KC Earnings Tax Renewal Campaign',
    description:
      'Help spread the word about the importance of renewing the KC earnings tax. Every dollar supports voter outreach.',
    url: 'https://together-kc.com/donate',
  },
  keywords: [
    'donate Together KC',
    'support KC earnings tax',
    'contribute to earnings tax campaign',
    'Kansas City political donation',
  ],
};

export default function DonatePage() {
  return <DonateContent />;
}
