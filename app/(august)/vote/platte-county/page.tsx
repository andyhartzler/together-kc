import type { Metadata } from 'next';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';
import { PLATTE_COUNTY_LOCATIONS } from '@/lib/platte-county-data';
import { AUGUST_BALLOT } from '@/lib/constants';

const COUNTY = 'Platte' as const;
const SLUG = 'platte-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Platte County - Polling Places & Early Voting | August 4, 2026',
  description:
    'Find Platte County polling places for the August 4, 2026 Kansas City ballot. Vote YES on all five Kansas City measures. Early voting in Platte City, Election Day sites across 29 locations, hours, and directions.',
  alternates: {
    canonical: `${BASE_URL}/vote/${SLUG}`,
  },
  keywords: [
    'where to vote Platte County',
    'Platte County polling places',
    'Platte City voting',
    'Platte County election board',
    'Northland KC voting',
    'Platte County early voting',
    'Parkville voting locations',
    'KCI area polling places',
    'Platte County Election Day',
    'Kansas City Northland August election',
  ],
  openGraph: {
    title: 'Platte County Polling Places | KC August 4, 2026 Ballot',
    description:
      'Find early voting and Election Day polling locations in Platte County for the August 4, 2026 Kansas City ballot. Vote YES on all five.',
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
    title: 'Platte County Polling Places | KC August 4, 2026 Ballot',
    description:
      'Find early voting and Election Day polling locations in Platte County for the August 4, 2026 Kansas City ballot.',
    images: ['/images/og-august.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];
const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Platte County?',
    answer: `The verified early in-person voting site is the ${electionBoard.name} at ${electionBoard.address} in Platte City. No-excuse early voting runs ${AUGUST_BALLOT.earlyVotingDate} through August 3, 2026. Confirm exact hours with the county election board or the Kansas City Election Board at kceb.org.`,
  },
  {
    question:
      'Do I have to vote at my assigned polling place in Platte County?',
    answer:
      'Yes. On Election Day, Platte County voters must vote at their assigned precinct polling place. Use the Missouri Secretary of State voter lookup tool to find your assigned location.',
  },
  {
    question: 'What are the Election Day hours for Platte County?',
    answer: `Polls are open from ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close} on ${ELECTION_DAY_INFO.dateFormatted}.`,
  },
  {
    question:
      'How do I find my assigned polling place in Platte County?',
    answer: `Visit the Platte County Board of Elections website at ${electionBoard.website} or call ${electionBoard.phone}. You can also use the Missouri Secretary of State voter lookup at voteroutreach.sos.mo.gov. The voter registration deadline is about July 8, 2026; confirm the exact date with your county election board.`,
  },
  {
    question:
      'Which Platte County residents vote on the Kansas City measures?',
    answer:
      'Only Platte County residents who live within Kansas City city limits vote on the five Kansas City measures. This includes parts of the Northland near KCI Airport, Tiffany Springs, Park Hill, Platte Woods, and other areas within KC city limits. Residents of Platte City, Weston, and other communities outside KC limits do not vote on these measures. Four of the five are city-wide bond questions and the fifth renews the Central City Economic Development sales tax on the East Side; Together KC urges a YES vote on all five, and none of them raises your tax rate.',
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
    ...PLATTE_COUNTY_LOCATIONS.map((loc) => ({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      zip: loc.zip,
      lat: loc.lat,
      lng: loc.lng,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Platte County Polling Places - August 4, 2026 Kansas City Election',
    description:
      'All early voting and Election Day polling locations in Platte County for the August 4, 2026 Kansas City ballot of five measures.',
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
        name: 'Platte County',
        item: `${BASE_URL}/vote/${SLUG}`,
      },
    ],
  };
}

export default function PlatteCountyVotePage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/vote?county=platte" />
      <JsonLd data={generateCivicStructureSchemas()} />
      <JsonLd data={generateFaqSchema(COUNTY_FAQS)} />
      <JsonLd data={generateBreadcrumbSchema()} />
      <div className="sr-only">
        <h1>Where to Vote in Platte County - Kansas City August 4, 2026 Election</h1>
        <p>Find Platte County polling places for the August 4, 2026 Kansas City ballot. Vote YES on all five Kansas City measures.</p>
        <h2>Platte County Early Voting</h2>
        <ul>
          {earlyLocations.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Platte County Election Day Polling Places</h2>
        <p>Polls open {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. You must vote at your assigned precinct location.</p>
        <ul>
          {PLATTE_COUNTY_LOCATIONS.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Platte County Election Board</h2>
        <p>{electionBoard.name}, {electionBoard.address}, Phone: {electionBoard.phone}</p>
        {COUNTY_FAQS.map((faq, idx) => (
          <div key={idx}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </div>
    </>
  );
}
