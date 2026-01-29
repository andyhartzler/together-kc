import type { Metadata } from 'next';
import { ENDORSERS } from '@/lib/constants';
import JsonLd, { generateEndorsersSchema } from '@/components/seo/JsonLd';
import EndorsementsContent from './EndorsementsContent';

export const metadata: Metadata = {
  title: 'Endorsements | Who Supports Renewing the KC Earnings Tax',
  description:
    'See who supports renewing the Kansas City earnings tax. Mayor Quinton Lucas, the entire City Council, Greater KC Chamber of Commerce, AFL-CIO, and dozens of community organizations endorse voting YES on April 7, 2026.',
  alternates: {
    canonical: 'https://together-kc.com/endorsements',
  },
  openGraph: {
    title: 'Endorsements | Who Supports Renewing the KC Earnings Tax',
    description:
      'Mayor Lucas, City Council, KC Chamber, AFL-CIO, and dozens of organizations support the earnings tax renewal. Add your endorsement.',
    url: 'https://together-kc.com/endorsements',
  },
  keywords: [
    'Kansas City earnings tax endorsements',
    'who supports KC e-tax',
    'Mayor Lucas earnings tax',
    'KC Chamber earnings tax',
    'organizations supporting KC tax renewal',
    'endorse earnings tax',
  ],
};

export default function EndorsementsPage() {
  // Combine all endorsers for the schema
  const allEndorsers = [
    ...ENDORSERS.organizations,
    ...ENDORSERS.cityOfficials.map((o) => ({ name: `${o.name}, ${o.title}` })),
    ...ENDORSERS.electedOfficials.map((o) => ({ name: `${o.name}, ${o.title}` })),
  ];

  return (
    <>
      <JsonLd data={generateEndorsersSchema(allEndorsers)} />
      <EndorsementsContent />
    </>
  );
}
