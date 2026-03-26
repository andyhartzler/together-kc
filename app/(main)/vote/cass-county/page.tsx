import type { Metadata } from 'next';
import Link from 'next/link';
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
            <span className="text-white/90">Cass County</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Where to Vote in Cass County
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Find early voting and Election Day information for Cass County
            residents in the April 7, 2026 Kansas City earnings tax election.
          </p>
          <Link
            href="/vote?county=cass"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Use the Interactive Polling Place Finder
          </Link>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-8 px-4 bg-golden/10 border-b border-golden/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-navy text-center">
            <span className="font-semibold">Note:</span> Very few Kansas City
            residents live in the Cass County portion of Kansas City. If you
            live in south Kansas City, you likely live in{' '}
            <Link
              href="/vote/jackson-county"
              className="text-coral hover:underline font-medium"
            >
              Jackson County
            </Link>
            . Check your voter registration to confirm your county.
          </p>
        </div>
      </section>

      {/* Early Voting Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-2">
            Early Voting Location
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Cass County has one early voting location at the County Clerk
            Election Office in Harrisonville. No-excuse absentee voting is
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
                        Election Office
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
              On Election Day, Cass County voters must go to their assigned
              precinct polling place. Contact the Cass County Clerk Election
              Office at{' '}
              <a
                href={`tel:${electionBoard.phone.replace(/[^\d]/g, '')}`}
                className="text-coral hover:underline font-medium"
              >
                {electionBoard.phone}
              </a>{' '}
              or visit{' '}
              <a
                href={electionBoard.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline font-medium"
              >
                the Cass County website
              </a>{' '}
              to find your assigned location.
            </p>
          </div>
        </div>
      </section>

      {/* Election Board Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-navy mb-6">
            Cass County Election Office
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
                  href="/vote?county=cass"
                  className="text-coral hover:underline font-medium"
                >
                  interactive polling place finder
                </Link>{' '}
                shows Cass County voting information with directions and hours.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-navy mb-2">
                2. Contact Cass County Clerk
              </h3>
              <p className="text-gray-600">
                Call{' '}
                <a
                  href={`tel:${electionBoard.phone.replace(/[^\d]/g, '')}`}
                  className="text-coral hover:underline font-medium"
                >
                  {electionBoard.phone}
                </a>{' '}
                or visit{' '}
                <a
                  href={electionBoard.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline font-medium"
                >
                  the Cass County website
                </a>{' '}
                for your assigned Election Day polling location.
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
            Use our interactive tool to see Cass County voting information with
            directions.
          </p>
          <Link
            href="/vote?county=cass"
            className="inline-block bg-coral text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-coral/90 transition-colors"
          >
            Find My Polling Place
          </Link>
        </div>
      </section>
    </>
  );
}
