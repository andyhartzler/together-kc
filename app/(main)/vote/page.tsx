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
    title: 'Where Do I Vote? | Together KC',
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
    title: 'Where Do I Vote? | Together KC',
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
      {/* Server-rendered SEO content -- always in HTML for Google to crawl.
          Hidden once the interactive VotePage mounts via the sr-only class on the outer div,
          but the text remains in the DOM for crawlers. */}
      <div className="sr-only" aria-hidden="true">
        <h1>Where Do I Vote? - Kansas City April 7, 2026 Earnings Tax Election</h1>
        <p>Find your polling place for the April 7, 2026 Kansas City earnings tax renewal election. Early voting and absentee voting is available March 24 through April 6, 2026 at locations across Jackson County, Clay County, Platte County, and Cass County. Vote YES to renew the KC earnings tax.</p>
        <h2>Early Voting Locations by County</h2>
        {(['Jackson', 'Clay', 'Platte', 'Cass'] as const).map((county) => (
          <div key={county}>
            <h3>{county} County Early Voting Locations</h3>
            <ul>
              {EARLY_VOTING_LOCATIONS.filter((l) => l.county === county).map((loc) => (
                <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
              ))}
            </ul>
            <p>{county} County Election Board: {COUNTY_ELECTION_BOARDS[county].name}, {COUNTY_ELECTION_BOARDS[county].phone}, {COUNTY_ELECTION_BOARDS[county].address}</p>
          </div>
        ))}
        <h2>Election Day - April 7, 2026</h2>
        <p>Polls are open from {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. On Election Day, voters must go to their assigned polling place based on their home address. Jackson County voters in Kansas City can vote at any Kansas City polling location.</p>
        <h2>What is the Kansas City Earnings Tax?</h2>
        <p>The Kansas City earnings tax (e-tax) is a 1% tax on income earned within Kansas City, Missouri. In place since 1963, it generates $373 million annually and funds 47% of city services including fire, police, EMS, road maintenance, trash collection, and snow removal. Voting YES renews the tax at the same rate -- it is not a tax increase.</p>
        <p>Check your voter registration at the Missouri Secretary of State website: voteroutreach.sos.mo.gov</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <VotePage />
      </Suspense>
    </>
  );
}
