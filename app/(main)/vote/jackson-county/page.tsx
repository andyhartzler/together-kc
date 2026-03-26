import type { Metadata } from 'next';
import Link from 'next/link';
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
      <JsonLd data={generateCivicStructureSchemas()} />
      <JsonLd data={generateFaqSchema(COUNTY_FAQS)} />
      <JsonLd data={generateBreadcrumbSchema()} />

      {/* Hero Section */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="text-sm text-white/60 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/80">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/vote" className="hover:text-white/80">
              Where Do I Vote?
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Jackson County</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to Vote in Jackson County
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Find every early voting and Election Day polling location in Jackson
            County for the April 7, 2026 Kansas City earnings tax election.
          </p>
          <Link
            href="/vote?county=jackson"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Use the Interactive Polling Place Finder
          </Link>
        </div>
      </section>

      {/* Early Voting Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-2">
            Early Voting Locations
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            No-excuse absentee voting is available March 24 through April 6,
            2026. Jackson County has {earlyLocations.length} early voting
            locations -- more than any other county in the Kansas City area.
          </p>

          <div className="grid gap-6">
            {earlyLocations.map((loc) => (
              <div
                key={loc.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy">
                      {loc.name}
                      {loc.isElectionBoard && (
                        <span className="ml-2 inline-block bg-navy/10 text-navy text-xs font-medium px-2 py-1 rounded">
                          Election Board
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {loc.address}, {loc.city}, {loc.state} {loc.zip}
                    </p>
                    {loc.notes && (
                      <p className="text-sm text-coral mt-2 font-medium">
                        {loc.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Hours
                  </h4>
                  <ul className="space-y-1">
                    {loc.hours.map((schedule, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {schedule.closed ? (
                          <span className="text-coral">
                            {schedule.label}: Closed
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">
                              {schedule.label}
                            </span>{' '}
                            ({schedule.dates}): {schedule.open} -{' '}
                            {schedule.close}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Election Day Section */}
      <section className="py-16 px-4 bg-light-gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-2">
            Election Day - {ELECTION_DAY_INFO.dateFormatted}
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Polls are open from {ELECTION_DAY_INFO.hours.open} to{' '}
            {ELECTION_DAY_INFO.hours.close}.
          </p>
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-navy mb-2">
              Jackson County voters can vote at ANY polling location
            </h3>
            <p className="text-gray-600">
              Kansas City voters in Jackson County can vote at any of the{' '}
              {JACKSON_COUNTY_LOCATIONS.length} Election Day polling locations
              using a ballot marking device. For a pre-printed paper ballot, go
              to your assigned ward location. Find your assigned location at{' '}
              <a
                href={electionBoard.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline font-medium"
              >
                {electionBoard.website}
              </a>
              .
            </p>
          </div>

          <h3 className="text-2xl font-bold text-navy mb-6">
            All {JACKSON_COUNTY_LOCATIONS.length} Election Day Polling Places
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {JACKSON_COUNTY_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-navy">{loc.name}</h4>
                <p className="text-sm text-gray-600">
                  {loc.address}, {loc.city}, {loc.state} {loc.zip}
                </p>
                {loc.room && (
                  <p className="text-xs text-gray-500 mt-1">{loc.room}</p>
                )}
                {loc.ward && (
                  <p className="text-xs text-navy/60 mt-1">
                    Ward {loc.ward}
                    {loc.letterCode ? ` - ${loc.letterCode}` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Election Board Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-6">
            Jackson County Election Board
          </h2>
          <div className="bg-navy/5 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-navy mb-4">
              {electionBoard.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Address
                </p>
                <p className="text-gray-700">{electionBoard.address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-gray-700">
                  <a
                    href={`tel:${electionBoard.phone.replace(/[^\d]/g, '')}`}
                    className="text-coral hover:underline"
                  >
                    {electionBoard.phone}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Website
                </p>
                <p>
                  <a
                    href={electionBoard.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral hover:underline"
                  >
                    {electionBoard.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Find Your Polling Place */}
      <section className="py-16 px-4 bg-light-gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-6">
            How to Find Your Polling Place
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                1. Use our interactive tool
              </h3>
              <p className="text-gray-600">
                Our{' '}
                <Link
                  href="/vote?county=jackson"
                  className="text-coral hover:underline font-medium"
                >
                  interactive polling place finder
                </Link>{' '}
                shows you every early voting and Election Day location on a map
                with real-time hours and directions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                2. Check the Kansas City Election Board
              </h3>
              <p className="text-gray-600">
                Visit{' '}
                <a
                  href={electionBoard.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline font-medium"
                >
                  {electionBoard.website}
                </a>{' '}
                to look up your assigned ward polling place for Election Day.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                3. Check your voter registration
              </h3>
              <p className="text-gray-600">
                Verify your registration status at the{' '}
                <a
                  href={ELECTION_DAY_INFO.voterLookup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline font-medium"
                >
                  Missouri Secretary of State Voter Portal
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {COUNTY_FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find your polling place?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Use our interactive tool to see every Jackson County voting
            location on a map with directions and real-time status.
          </p>
          <Link
            href="/vote?county=jackson"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Find My Polling Place
          </Link>
        </div>
      </section>
    </>
  );
}
