import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import {
  EARLY_VOTING_LOCATIONS,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
} from '@/lib/polling-data';
import { PLATTE_COUNTY_LOCATIONS } from '@/lib/platte-county-data';

const COUNTY = 'Platte' as const;
const SLUG = 'platte-county';
const BASE_URL = 'https://together-kc.com';

export const metadata: Metadata = {
  title:
    'Where to Vote in Platte County - Polling Places & Early Voting | April 7, 2026',
  description:
    'Find Platte County polling places for the April 7, 2026 Kansas City earnings tax election. Early voting in Platte City, Election Day sites across 29 locations, hours, and directions.',
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
    'Kansas City Northland election',
  ],
  openGraph: {
    title: 'Platte County Polling Places | KC Earnings Tax Election 2026',
    description:
      'Find early voting and Election Day polling locations in Platte County for the Kansas City earnings tax election on April 7, 2026.',
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
    title: 'Platte County Polling Places | KC Election 2026',
    description:
      'Find early voting and Election Day polling locations in Platte County for the Kansas City earnings tax election.',
    images: ['/images/og-image.png'],
  },
};

const earlyLocations = EARLY_VOTING_LOCATIONS.filter(
  (l) => l.county === COUNTY
);
const electionBoard = COUNTY_ELECTION_BOARDS[COUNTY];
const kcLocations = PLATTE_COUNTY_LOCATIONS.filter((l) => l.isKC);
const nonKcLocations = PLATTE_COUNTY_LOCATIONS.filter((l) => !l.isKC);

const COUNTY_FAQS = [
  {
    question: 'Where can I vote early in Platte County?',
    answer: `Platte County has one early voting location: the ${earlyLocations[0]?.name} at ${earlyLocations[0]?.address}, ${earlyLocations[0]?.city}, MO. Early voting is available weekdays from March 24 through April 6, 2026, plus Saturday April 4 from 8:00 AM to 12:00 PM.`,
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
    answer: `Visit the Platte County Board of Elections website at ${electionBoard.website} or call ${electionBoard.phone}. You can also use the Missouri Secretary of State voter lookup at voteroutreach.sos.mo.gov.`,
  },
  {
    question:
      'Which Platte County residents vote on the Kansas City earnings tax?',
    answer:
      'Only Platte County residents who live within Kansas City city limits vote on the earnings tax. This includes parts of the Northland near KCI Airport, Tiffany Springs, Park Hill, Platte Woods, and other areas within KC city limits. Residents of Platte City, Weston, and other communities outside KC limits do not vote on the e-tax.',
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
    name: 'Platte County Polling Places - April 7, 2026 Kansas City Election',
    description:
      'All early voting and Election Day polling locations in Platte County for the Kansas City earnings tax renewal election.',
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
            <span className="text-white/90">Platte County</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to Vote in Platte County
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Find early voting and Election Day polling locations in Platte
            County for the April 7, 2026 Kansas City earnings tax election.
          </p>
          <Link
            href="/vote?county=platte"
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
            Platte County has one early voting location at the Board of
            Elections office in Platte City. No-excuse absentee voting is
            available March 24 through April 6, 2026, including Saturday April
            4.
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
              On Election Day, Platte County voters must go to their assigned
              precinct polling place. Find your assigned location at{' '}
              <a
                href={electionBoard.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline font-medium"
              >
                {electionBoard.website}
              </a>{' '}
              or call {electionBoard.phone}.
            </p>
          </div>

          {/* KC Locations */}
          <h3 className="text-2xl font-bold text-navy mb-4">
            Kansas City (Platte County) Polling Places ({kcLocations.length})
          </h3>
          <p className="text-gray-600 mb-6">
            These polling places serve Kansas City residents who live in Platte
            County and vote on the earnings tax. Includes the Northland, KCI
            area, Park Hill, Platte Woods, and Tiffany Springs.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {kcLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-navy">{loc.name}</h4>
                <p className="text-sm text-gray-600">
                  {loc.address}, {loc.city}, {loc.state} {loc.zip}
                </p>
                <p className="text-xs text-navy/60 mt-1">
                  Precincts: {loc.precincts.join(', ')}
                </p>
              </div>
            ))}
          </div>

          {/* Non-KC Locations */}
          <h3 className="text-2xl font-bold text-navy mb-4">
            Other Platte County Polling Places ({nonKcLocations.length})
          </h3>
          <p className="text-gray-600 mb-6">
            These locations serve Platte County residents outside Kansas City
            city limits (Parkville, Platte City, Weston, Dearborn, Edgerton,
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
                  {loc.address}, {loc.city}, {loc.state} {loc.zip}
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
            Platte County Election Board
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
                  href="/vote?county=platte"
                  className="text-coral hover:underline font-medium"
                >
                  interactive polling place finder
                </Link>{' '}
                shows Platte County voting locations on a map with directions
                and hours.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                2. Platte County Board of Elections
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
                for precinct maps and voter information specific to Platte
                County.
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
            Use our interactive tool to see every Platte County voting location
            on a map with directions.
          </p>
          <Link
            href="/vote?county=platte"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Find My Polling Place
          </Link>
        </div>
      </section>
    </>
  );
}
