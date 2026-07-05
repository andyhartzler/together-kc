import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import KeyMessage from '@/components/sections/KeyMessage';
import Services from '@/components/sections/Services';
import EndorsersPreview from '@/components/sections/EndorsersPreview';
import CallToAction from '@/components/sections/CallToAction';
import JsonLd, {
  electionEventSchema,
  governmentServiceSchema,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Together KC | Vote YES to Renew the Kansas City Earnings Tax - April 7, 2026',
  description:
    'Vote YES to renew the Kansas City earnings tax on April 7, 2026. The 1% e-tax generates $373 million annually, funding 47% of city services including fire, police, EMS, roads, and trash collection.',
  alternates: {
    canonical: 'https://together-kc.com/etax/home',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={electionEventSchema} />
      <JsonLd data={governmentServiceSchema} />
      <Hero />
      <KeyMessage />
      <Services />
      <EndorsersPreview />
      <CallToAction />
    </>
  );
}
