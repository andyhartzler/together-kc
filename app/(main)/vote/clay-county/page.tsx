import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';
import { CLAY_COUNTY_LOCATIONS } from '@/lib/clay-county-data';

const COUNTY = 'Clay' as const;
const SLUG = 'clay-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Clay County - Polling Places & Early Voting | April 7, 2026',
  description:
    'Find Clay County polling places for the April 7, 2026 Kansas City earnings tax election. Early voting location in Liberty, Election Day sites across Clay County, hours, and directions.',
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
    'KC earnings tax Clay County',
    'Clay County voter registration',
    'absentee voting Clay County Missouri',
  ],
  openGraph: {
    title: 'Clay County Polling Places | KC Earnings Tax Election 2026',
    description:
      'Find early voting and Election Day polling locations in Clay County for the Kansas City earnings tax election on April 7, 2026.',
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
    title: 'Clay County Polling Places | KC Election 2026',
    description:
      'Find early voting and Election Day polling locations in Clay County for the Kansas City earnings tax election.',
    images: ['/images/og-image.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];
const kcLocations = CLAY_COUNTY_LOCATIONS.filter((l) => l.isKC);
const nonKcLocations = CLAY_COUNTY_LOCATIONS.filter((l) => !l.isKC);

const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Clay County?',
    answer: `Clay County has one early voting location: the ${electionBoard.name} at ${electionBoard.address} in Liberty. Early voting is available weekdays from March 24 through April 6, 2026, 8:00 AM to 5:00 PM.`,
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
    answer: `Visit the Clay County Board of Election Commissioners website at ${electionBoard.website} or call ${electionBoard.phone}. You can also use the Missouri Secretary of State voter lookup at voteroutreach.sos.mo.gov.`,
  },
  {
    question:
      'Do Kansas City residents in Clay County vote on the earnings tax?',
    answer:
      'Yes. If you live within Kansas City city limits in Clay County (the Northland), you vote on the earnings tax renewal. This includes neighborhoods in Gladstone, Liberty, and North Kansas City areas that are within KC city limits.',
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
    name: 'Clay County Polling Places - April 7, 2026 Kansas City Election',
    description:
      'All early voting and Election Day polling locations in Clay County for the Kansas City earnings tax renewal election.',
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
            <span className="text-white/90">Clay County</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to Vote in Clay County
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Find early voting and Election Day polling locations in Clay County
            for the April 7, 2026 Kansas City earnings tax election.
          </p>
          <Link
            href="/vote?county=clay"
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
            Early Voting Location
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Clay County has one early voting location at the County
            Administration Building in Liberty. No-excuse absentee voting is
            available March 24 through April 6, 2026.
          </p>

          <div className="grid gap-6">
            {earlyLocations.map((loc) => (
              <div
                key={loc.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
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
              You must vote at your assigned precinct location
            </h3>
            <p className="text-gray-600">
              On Election Day, Clay County voters must go to their assigned
              precinct polling place. Find your assigned location at{' '}
              <a
                href={ELECTION_DAY_INFO.lookupUrls.clay}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline font-medium"
              >
                the Clay County polling place lookup
              </a>{' '}
              or call {electionBoard.phone}.
            </p>
          </div>

          {/* KC Locations */}
          <h3 className="text-2xl font-bold text-navy mb-4">
            Kansas City (Clay County) Polling Places ({kcLocations.length})
          </h3>
          <p className="text-gray-600 mb-6">
            These polling places serve Kansas City residents who live in Clay
            County and vote on the earnings tax.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {kcLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-navy">{loc.name}</h4>
                <p className="text-sm text-gray-600">
                  {loc.address}, {loc.city}, MO {loc.zip}
                </p>
                <p className="text-xs text-navy/60 mt-1">
                  Precincts: {loc.precincts.join(', ')}
                </p>
              </div>
            ))}
          </div>

          {/* Non-KC Locations */}
          <h3 className="text-2xl font-bold text-navy mb-4">
            Other Clay County Polling Places ({nonKcLocations.length})
          </h3>
          <p className="text-gray-600 mb-6">
            These locations serve Clay County residents outside Kansas City city
            limits (Gladstone, Liberty, Excelsior Springs, Kearney, Smithville,
            and other communities).
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {nonKcLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-navy">{loc.name}</h4>
                <p className="text-sm text-gray-600">
                  {loc.address}, {loc.city}, MO {loc.zip}
                </p>
                <p className="text-xs text-navy/60 mt-1">
                  Precincts: {loc.precincts.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Election Board Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-6">
            Clay County Election Board
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
                  href="/vote?county=clay"
                  className="text-coral hover:underline font-medium"
                >
                  interactive polling place finder
                </Link>{' '}
                shows Clay County voting locations on a map with directions and
                hours.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                2. Clay County precinct lookup
              </h3>
              <p className="text-gray-600">
                Use the{' '}
                <a
                  href={ELECTION_DAY_INFO.lookupUrls.clay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline font-medium"
                >
                  Clay County ArcGIS polling place lookup
                </a>{' '}
                to find your assigned precinct and Election Day location.
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
            Use our interactive tool to see every Clay County voting location on
            a map with directions.
          </p>
          <Link
            href="/vote?county=clay"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Find My Polling Place
          </Link>
        </div>
      </section>
    </>
  );
}
