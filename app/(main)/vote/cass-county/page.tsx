import type { Metadata } from 'next';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';

const COUNTY = 'Cass' as const;
const SLUG = 'cass-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Cass County - Polling Places & Early Voting | April 7, 2026',
  description:
    'Find Cass County polling places for the April 7, 2026 Kansas City earnings tax election. Early voting in Harrisonville, Election Day information, hours, and how to find your assigned polling place.',
  alternates: {
    canonical: `${BASE_URL}/vote/${SLUG}`,
  },
  keywords: [
    'where to vote Cass County',
    'Cass County Missouri polling places',
    'Harrisonville voting',
    'Cass County election',
    'Cass County early voting',
    'Cass County Clerk election office',
    'Kansas City Cass County voting',
    'Cass County voter registration',
    'Cass County Election Day',
    'absentee voting Cass County Missouri',
  ],
  openGraph: {
    title: 'Cass County Polling Places | KC Earnings Tax Election 2026',
    description:
      'Find early voting and Election Day polling locations in Cass County for the Kansas City earnings tax election on April 7, 2026.',
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
    title: 'Cass County Polling Places | KC Election 2026',
    description:
      'Find early voting and Election Day information for Cass County in the Kansas City earnings tax election.',
    images: ['/images/og-image.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];

const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Cass County?',
    answer: `Cass County has one early voting location: the ${electionBoard.name} at ${electionBoard.address} in Harrisonville. Early voting is available weekdays from March 24 through April 6, 2026, 8:00 AM to 4:30 PM.`,
  },
  {
    question:
      'Do many Kansas City residents live in the Cass County portion?',
    answer:
      'Very few Kansas City residents live in the Cass County portion of Kansas City. If you live in this area and are within Kansas City city limits, you still vote on the earnings tax renewal.',
  },
  {
    question: 'What are the Election Day hours for Cass County?',
    answer: `Polls are open from ${ELECTION_DAY_INFO.hours.open} to ${ELECTION_DAY_INFO.hours.close} on ${ELECTION_DAY_INFO.dateFormatted}.`,
  },
  {
    question:
      'How do I find my assigned polling place in Cass County?',
    answer: `Contact the Cass County Clerk Election Office at ${electionBoard.phone} or visit ${electionBoard.website}. You can also use the Missouri Secretary of State voter lookup at voteroutreach.sos.mo.gov.`,
  },
  {
    question: 'What is on the ballot for Cass County KC residents?',
    answer:
      'Kansas City residents in Cass County will vote on the renewal of the Kansas City earnings tax (e-tax), a 1% tax on income earned in Kansas City that funds 47% of city services including fire, police, EMS, roads, and trash collection. Voting YES renews the tax at the same rate -- it is not a tax increase.',
  },
] as const;

function generateCivicStructureSchemas() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cass County Polling Places - April 7, 2026 Kansas City Election',
    description:
      'Early voting location in Cass County for the Kansas City earnings tax renewal election.',
    numberOfItems: earlyLocations.length,
    itemListElement: earlyLocations.map((loc, i) => ({
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
        name: 'Cass County',
        item: `${BASE_URL}/vote/${SLUG}`,
      },
    ],
  };
}

export default function CassCountyVotePage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/vote?county=cass" />
      <JsonLd data={generateCivicStructureSchemas()} />
      <JsonLd data={generateFaqSchema(COUNTY_FAQS)} />
      <JsonLd data={generateBreadcrumbSchema()} />
      <div className="sr-only">
        <h1>Where to Vote in Cass County - Kansas City April 7, 2026 Election</h1>
        <p>Find Cass County polling places for the April 7, 2026 Kansas City earnings tax election. Very few Kansas City residents live in the Cass County portion of Kansas City.</p>
        <h2>Cass County Early Voting</h2>
        <ul>
          {earlyLocations.map((loc) => (
            <li key={loc.id}>{loc.name}, {loc.address}, {loc.city}, {loc.state} {loc.zip}</li>
          ))}
        </ul>
        <h2>Election Day - April 7, 2026</h2>
        <p>Polls open {ELECTION_DAY_INFO.hours.open} to {ELECTION_DAY_INFO.hours.close}. You must vote at your assigned precinct location.</p>
        <h2>Cass County Election Office</h2>
        <p>{electionBoard.name}, {electionBoard.address}, Phone: {electionBoard.phone}</p>
        {COUNTY_FAQS.map((faq, idx) => (
          <div key={idx}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </div>
    </>
  );
}
