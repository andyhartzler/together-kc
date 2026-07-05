import type { Metadata } from 'next';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';
import { CLAY_COUNTY_LOCATIONS } from '@/lib/clay-county-data';
import { AUGUST_BALLOT } from '@/lib/constants';

const COUNTY = 'Clay' as const;
const SLUG = 'clay-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Clay County - Polling Places & Early Voting | August 4, 2026',
  description:
    'Find Clay County polling places for the August 4, 2026 Kansas City ballot. Vote YES on all five Kansas City measures. Early voting in Liberty, Election Day sites across Clay County, hours, and directions.',
  alternates: {
    canonical: `${BASE_URL}/vote/${SLUG}`,
  },
  keywords: [
    'where to vote Clay County',
    'Clay County Missouri polling places',
    'Liberty MO voting',
    'Clay County election board',
    'Clay County early voting',
    'Kansas City Northland voting',
    'Clay County Election Day polling',
    'Kansas City August ballot Clay County',
    'Clay County voter registration',
    'absentee voting Clay County Missouri',
  ],
  openGraph: {
    title: 'Clay County Polling Places | KC August 4, 2026 Ballot',
    description:
      'Find early voting and Election Day polling locations in Clay County for the August 4, 2026 Kansas City ballot. Vote YES on all five.',
    url: `${BASE_URL}/vote/${SLUG}`,
    images: [
      {
        url: '/images/og-august.png',
        width: 1200,
        height: 630,
        alt: 'Together KC - Vote YES on all five Kansas City measures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clay County Polling Places | KC August 4, 2026 Ballot',
    description:
      'Find early voting and Election Day polling locations in Clay County for the August 4, 2026 Kansas City ballot.',
    images: ['/images/og-august.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];
const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Clay County?',
    answer: `The verified early in-person voting site is the ${electionBoard.name} at ${electionBoard.address} in Liberty. No-excuse early voting runs ${AUGUST_BALLOT.earlyVotingDate} through August 3, 2026. Confirm exact hours with the county election board or the Kansas City Election Board at kceb.org.`,
  },
  {
    question:
      'Do I have to vote at my assigned polling place in Clay County?',
    answer:
      'Yes. On Election Day, Clay County voters must vote at their assigned precinct polling place. You can look up your assigned location using the Clay County ArcGIS lookup tool or by calling the Clay County Board of Election Commissioners.',
  },
  {
    question: 'What are the Election Day hours for Clay County?',
    answer: `Polls are open from ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close} on ${ELECTION_DAY_INFO.dateFormatted}.`,
  },
  {
    question:
      'How do I find my assigned polling place in Clay County?',
    answer: `Visit the Clay County Board of Election Commissioners website at ${electionBoard.website} or call ${electionBoard.phone}. You can also use the Missouri Secretary of State voter lookup at voteroutreach.sos.mo.gov. The voter registration deadline is about July 8, 2026; confirm the exact date with your county election board.`,
  },
  {
    question:
      'What do Kansas City residents in Clay County vote on this August?',
    answer:
      'If you live within Kansas City city limits in Clay County (the Northland), you vote on the five Kansas City measures on the August 4, 2026 ballot. Four are city-wide bond questions for clean drinking water, river and sewer cleanup, affordable housing, and repairs to the convention center and City Hall; the fifth renews the Central City Economic Development sales tax on the East Side. Together KC urges a YES vote on all five, and none of them raises your tax rate.',
  },
] as const;

function generateCivicStructureSchemas() {
  const allLocations = [
    ...earlyLocations.map((loc) => ({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      zip: loc.zip,
      lat: loc.lat,
      lng: loc.lng,
    })),
    ...CLAY_COUNTY_LOCATIONS.map((loc) => ({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      state: 'MO',
      zip: loc.zip,
      lat: loc.lat,
      lng: loc.lng,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Clay County Polling Places - August 4, 2026 Kansas City Election',
    description:
      'All early voting and Election Day polling locations in Clay County for the August 4, 2026 Kansas City ballot of five measures.',
    numberOfItems: allLocations.length,
    itemListElement: allLocations.map((loc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
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
      },
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
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Where Do I Vote?',
        item: `${BASE_URL}/vote`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Clay County',
        item: `${BASE_URL}/vote/${SLUG}`,
      },
    ],
  };
}

export default function ClayCountyVotePage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/vote?county=clay" />
      <JsonLd data={generateCivicStructureSchemas()} />
      <JsonLd data={generateFaqSchema(COUNTY_FAQS)} />
      <JsonLd data={generateBreadcrumbSchema()} />
      <div className="sr-only">
        <h1>Where to Vote in Clay County - Kansas City August 4, 2026 Election</h1>
        <p>Find Clay County polling places for the August 4, 2026 Kansas City ballot. Vote YES on all five Kansas City measures.</p>
        <h2>Clay County Early Voting</h2>
        <ul>
          {earlyLocations.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Clay County Election Day Polling Places</h2>
        <p>Polls open {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. You must vote at your assigned precinct location.</p>
        <ul>
          {CLAY_COUNTY_LOCATIONS.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, MO {loc.zip}</li>
          ))}
        </ul>
        <h2>Clay County Election Board</h2>
        <p>{electionBoard.name}, {electionBoard.address}, Phone: {electionBoard.phone}</p>
        {COUNTY_FAQS.map((faq, idx) => (
          <div key={idx}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </div>
    </>
  );
}
