import type { Metadata } from 'next';
import { Suspense } from 'react';
import VotePage from './VotePage';
import JsonLd from '@/components/seo/JsonLd';
import { EARLY_VOTING_LOCATIONS, COUNTY_ELECTION_BOARDS, ELECTION_DAY_INFO } from '@/lib/polling-data';

export const metadata: Metadata = {
  title: 'Where Do I Vote? - Kansas City August 4, 2026 Ballot',
  description:
    'Find your polling place for the August 4, 2026 Kansas City election. Vote YES on all five Kansas City measures. Early voting, Election Day polling places, and directions for Jackson County, Clay County, Platte County, and Cass County.',
  alternates: {
    canonical: 'https://together-kc.com/vote',
  },
  keywords: [
    'where do I vote Kansas City',
    'Kansas City polling places',
    'KC voting locations',
    'August 4 2026 election',
    'Kansas City August ballot',
    'vote yes on all five Kansas City',
    'early voting Kansas City',
    'Jackson County polling places',
    'Clay County polling locations',
    'Platte County where to vote',
    'Cass County polling places',
    'KC early voting locations',
    'Kansas City sample ballot',
    'KCMO where to vote',
    'Kansas City election 2026',
    'KC ballot measures vote locations',
    'find my polling place Kansas City',
    'absentee voting Kansas City Missouri',
    'vote yes KC August measures',
  ],
  openGraph: {
    title: 'Find Your Polling Place | Vote YES on All Five',
    description:
      'Find early voting and Election Day polling places in Kansas City. Covers Jackson, Clay, Platte, and Cass counties. Vote YES on all five Kansas City measures August 4, 2026.',
    url: 'https://together-kc.com/vote',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES on all five Kansas City measures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Polling Place | Vote YES on All Five',
    description:
      'Find your polling place for the August 4, 2026 Kansas City ballot. Early voting July 21 through August 3.',
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
    // Only emit coordinates for verified locations; never fabricate geo.
    ...(typeof loc.lat === 'number' && typeof loc.lng === 'number'
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: loc.lat,
            longitude: loc.lng,
          },
        }
      : {}),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kansas City Early Voting Locations - August 4, 2026 Election',
    description: 'Early voting locations for the August 4, 2026 Kansas City election. Early in-person voting runs Tuesday, July 21 through Monday, August 3, 2026 at the county election board. Covers Jackson County, Clay County, Platte County, and Cass County.',
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
        name: 'Vote on the Kansas City August 4, 2026 Ballot',
        description: 'Vote YES on all five Kansas City measures on the August 4, 2026 ballot. Early in-person voting runs July 21 through August 3, 2026.',
        startTime: '2026-07-21',
        endTime: '2026-08-04',
        location: { '@type': 'City', name: 'Kansas City', addressRegion: 'MO' },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SpecialAnnouncement',
        name: 'Kansas City August 4, 2026 Election - Vote YES on All Five',
        text: 'Early in-person voting runs July 21 through August 3, 2026. Election Day is August 4, 2026 with polls open 6:00 AM to 7:00 PM. Find your polling place for the five Kansas City measures.',
        datePosted: '2026-07-21',
        expires: '2026-08-05',
        spatialCoverage: { '@type': 'City', name: 'Kansas City', addressRegion: 'MO', addressCountry: 'US' },
        category: 'https://www.wikidata.org/wiki/Q40231',
      }} />
      {/* Server-rendered SEO content -- visually hidden but in DOM for Google crawlers.
          sr-only uses clip/position:absolute which Google treats as legitimate accessible content. */}
      <div className="sr-only">
        <h1>Find Your Polling Place - Kansas City August 4, 2026 Ballot</h1>
        <p>Early in-person voting runs Tuesday, July 21 through Monday, August 3, 2026 at the county election board for Jackson, Clay, Platte, and Cass counties. Election Day is Tuesday, August 4, 2026. Polls open 6:00 AM to 7:00 PM. Vote YES on all five Kansas City measures.</p>
        <h2>Early Voting Locations by County</h2>
        {(['Jackson', 'Clay', 'Platte', 'Cass'] as const).map((county) => (
          <div key={county}>
            <h3>{county} County Early Voting Locations</h3>
            <ul>
              {EARLY_VOTING_LOCATIONS.filter((l) => l.county === county).map((loc) => (
                <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
              ))}
            </ul>
            <p>{county} County Election Board: {COUNTY_ELECTION_BOARDS[county].name}, {COUNTY_ELECTION_BOARDS[county].phone}</p>
          </div>
        ))}
        <p>For the full list of early-voting satellite sites and their hours, check the Kansas City Election Board at https://kceb.org.</p>
        <h2>Election Day - August 4, 2026</h2>
        <p>Polls are open from {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. On Election Day, voters must go to their assigned polling place.</p>
        <h2>What is on the August 4, 2026 Kansas City Ballot?</h2>
        <p>The August 4, 2026 ballot has five Kansas City measures. Four are city-wide bond questions and one is the Central City Economic Development (CCED) question on the East Side. None of the measures raises the tax rate. Together KC urges voters to vote YES on all five. To review your specific ballot, use the Kansas City Election Board sample ballot tool at https://kceb.org/elections/ballot/.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <VotePage />
      </Suspense>
    </>
  );
}
