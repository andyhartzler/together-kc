import type { Metadata } from 'next';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';
import { JACKSON_COUNTY_LOCATIONS } from '@/lib/election-day-data';

const COUNTY = 'Jackson' as const;
const SLUG = 'jackson-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Jackson County - Kansas City Polling Places | April 7, 2026',
  description:
    'Find every Jackson County polling place for the April 7, 2026 Kansas City earnings tax election. Early voting locations, Election Day sites, hours, addresses, and directions from the Kansas City Election Board (KCEB).',
  alternates: {
    canonical: `${BASE_URL}/vote/${SLUG}`,
  },
  keywords: [
    'where to vote Jackson County Kansas City',
    'Jackson County polling places',
    'Kansas City election board',
    'KCEB voting locations',
    'Jackson County early voting',
    'Kansas City earnings tax vote',
    'KC polling locations 2026',
    'early voting Kansas City Missouri',
    'Jackson County Election Day polling places',
    'Kansas City absentee voting',
  ],
  openGraph: {
    title: 'Jackson County Polling Places | KC Earnings Tax Election 2026',
    description:
      'All early voting and Election Day polling locations in Jackson County, Kansas City. Vote YES to renew the earnings tax on April 7, 2026.',
    url: `${BASE_URL}/vote/${SLUG}`,
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
    title: 'Jackson County Polling Places | KC Election 2026',
    description:
      'Find every early voting and Election Day polling location in Jackson County for the Kansas City earnings tax election.',
    images: ['/images/og-image.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];

const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Jackson County?',
    answer: `There are ${earlyLocations.length} early voting locations in Jackson County, including the Kansas City Election Board at ${electionBoard.address}. Early voting runs from March 24 through April 6, 2026.`,
  },
  {
    question:
      'Can I vote at any polling place in Kansas City on Election Day?',
    answer:
      'Yes. Jackson County voters in Kansas City can vote at ANY of the 53 Election Day polling locations using a ballot marking device. For a pre-printed paper ballot, go to your assigned ward location.',
  },
  {
    question: 'What are the Election Day hours for Jackson County?',
    answer: `Polls are open from ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close} on ${ELECTION_DAY_INFO.dateFormatted}.`,
  },
  {
    question:
      'How do I find my assigned polling place in Jackson County?',
    answer: `Visit the Kansas City Election Board website at ${electionBoard.website} or call ${electionBoard.phone} to find your assigned ward polling location.`,
  },
  {
    question: 'What is on the ballot for Jackson County voters?',
    answer:
      'The April 7, 2026 ballot includes the renewal of the Kansas City earnings tax (e-tax), a 1% tax on income earned in Kansas City that funds 47% of city services including fire, police, EMS, roads, and trash collection. Voting YES renews the tax at the same rate -- it is not a tax increase.',
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
    ...JACKSON_COUNTY_LOCATIONS.map((loc) => ({
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
    name: 'Jackson County Polling Places - April 7, 2026 Kansas City Election',
    description:
      'All early voting and Election Day polling locations in Jackson County for the Kansas City earnings tax renewal election.',
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
        name: 'Jackson County',
        item: `${BASE_URL}/vote/${SLUG}`,
      },
    ],
  };
}

export default function JacksonCountyVotePage() {
  return (
    <>
      {/* Instant redirect -- users never see this page */}
      <meta httpEquiv="refresh" content="0;url=/vote?county=jackson" />
      <JsonLd data={generateCivicStructureSchemas()} />
      <JsonLd data={generateFaqSchema(COUNTY_FAQS)} />
      <JsonLd data={generateBreadcrumbSchema()} />
      {/* Crawlable text for search engines (visually hidden) */}
      <div className="sr-only">
        <h1>Where to Vote in Jackson County - Kansas City April 7, 2026 Election</h1>
        <p>Find every Jackson County polling place for the April 7, 2026 Kansas City earnings tax election. Early voting runs March 24 through April 6, 2026.</p>
        <h2>Jackson County Early Voting Locations</h2>
        <ul>
          {earlyLocations.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Election Day Polling Places</h2>
        <p>Polls open {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. Jackson County voters in Kansas City can vote at any of the {JACKSON_COUNTY_LOCATIONS.length} polling locations.</p>
        <ul>
          {JACKSON_COUNTY_LOCATIONS.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Jackson County Election Board</h2>
        <p>{electionBoard.name}, {electionBoard.address}, Phone: {electionBoard.phone}</p>
        {COUNTY_FAQS.map((faq, idx) => (
          <div key={idx}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </div>
    </>
  );
}
