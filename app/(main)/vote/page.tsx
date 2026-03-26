import type { Metadata } from 'next';
import { Suspense } from 'react';
import VotePage from './VotePage';
import JsonLd from '@/components/seo/JsonLd';
import { EARLY_VOTING_LOCATIONS, COUNTY_ELECTION_BOARDS, ELECTION_DAY_INFO } from '@/lib/polling-data';

export const metadata: Metadata = {
  title: 'Where Do I Vote? - Kansas City April 7, 2026 Election',
  description:
    'Find your polling place for the April 7, 2026 Kansas City earnings tax election. Early voting locations, Election Day polling places, sample ballots, and directions for Jackson County, Clay County, Platte County, and Cass County.',
  alternates: {
    canonical: 'https://together-kc.com/vote',
  },
  keywords: [
    'where do I vote Kansas City',
    'Kansas City polling places',
    'KC voting locations',
    'April 7 2026 election',
    'Kansas City earnings tax vote',
    'early voting Kansas City',
    'Jackson County polling places',
    'Clay County polling locations',
    'Platte County where to vote',
    'Cass County polling places',
    'KC early voting locations',
    'Kansas City sample ballot',
    'KCMO where to vote',
    'Kansas City election 2026',
    'KC e-tax vote locations',
    'find my polling place Kansas City',
    'absentee voting Kansas City Missouri',
    'vote yes KC earnings tax',
  ],
  openGraph: {
    title: 'Find Your Polling Place | Renew the E-Tax',
    description:
      'Find early voting and Election Day polling places in Kansas City. Covers Jackson, Clay, Platte, and Cass counties. Vote YES to renew the earnings tax.',
    url: 'https://together-kc.com/vote',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES to renew the earnings tax',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Polling Place | Renew the E-Tax',
    description:
      'Find your polling place for the Kansas City earnings tax election. Early voting open now through April 6.',
    images: ['/images/og-image.png'],
  },
};

// Generate structured data for all polling locations
function generateVotingLocationSchema() {
  const locations = EARLY_VOTING_LOCATIONS.map((loc) => ({
    '@type': 'CivicStructure',
    name: loc.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address,
      addressLocality: loc.city,
      addressRegion: loc.state,
      postalCode: loc.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.lat,
      longitude: loc.lng,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kansas City Early Voting Locations - April 7, 2026 Election',
    description: 'Early voting and absentee voting locations for the Kansas City earnings tax renewal election on April 7, 2026. Covers Jackson County, Clay County, Platte County, and Cass County.',
    numberOfItems: locations.length,
    itemListElement: locations.map((loc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: loc,
    })),
  };
}

function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Together KC',
        item: 'https://together-kc.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Where Do I Vote?',
        item: 'https://together-kc.com/vote',
      },
    ],
  };
}

export default function Page() {
  return (
    <>
      <JsonLd data={generateVotingLocationSchema()} />
      <JsonLd data={generateBreadcrumbSchema()} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'VoteAction',
        name: 'Vote on Kansas City Earnings Tax Renewal',
        description: 'Vote YES or NO on renewing the 1% Kansas City earnings tax on April 7, 2026',
        startTime: '2026-03-24',
        endTime: '2026-04-07',
        location: { '@type': 'City', name: 'Kansas City', addressRegion: 'MO' },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SpecialAnnouncement',
        name: 'Kansas City Earnings Tax Renewal Election - Vote by April 7, 2026',
        text: 'Early voting is open now through April 6. Find your polling place for the Kansas City earnings tax renewal election.',
        datePosted: '2026-03-24',
        expires: '2026-04-08',
        spatialCoverage: { '@type': 'City', name: 'Kansas City', addressRegion: 'MO', addressCountry: 'US' },
        category: 'https://www.wikidata.org/wiki/Q40231',
      }} />
      {/* Server-rendered SEO content -- visible to all users and crawlers.
          Provides crawlable text for Google featured snippets and AI search. */}
      <div className="bg-navy text-white px-4 py-8 text-center max-w-3xl mx-auto" id="vote-info">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Find Your Polling Place - Kansas City Earnings Tax Election</h1>
        <p className="text-white/80 text-sm sm:text-base mb-4">Early voting is open now through April 6, 2026 at locations across Jackson, Clay, Platte, and Cass counties. Election Day is April 7, 2026 -- polls open 6:00 AM to 7:00 PM.</p>
        <p className="text-white/60 text-xs">Select your county below to find your nearest voting location, get directions, and view your sample ballot.</p>
      </div>
      {/* Additional crawlable content below the fold -- structured for featured snippets */}
      <div className="bg-navy text-white px-4 pb-2 max-w-3xl mx-auto text-xs text-white/40 space-y-2" aria-label="Voting locations reference">
        {(['Jackson', 'Clay', 'Platte', 'Cass'] as const).map((county) => (
          <details key={county} className="[&>summary]:cursor-pointer">
            <summary className="font-semibold text-white/50">{county} County Early Voting Locations</summary>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              {EARLY_VOTING_LOCATIONS.filter((l) => l.county === county).map((loc) => (
                <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
              ))}
            </ul>
            <p className="mt-1">{COUNTY_ELECTION_BOARDS[county].name}: {COUNTY_ELECTION_BOARDS[county].phone}</p>
          </details>
        ))}
      </div>
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <VotePage />
      </Suspense>
    </>
  );
}
