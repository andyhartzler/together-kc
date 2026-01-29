type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema for Together KC
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'PoliticalOrganization',
  name: 'Together KC',
  url: 'https://together-kc.com',
  logo: 'https://together-kc.com/images/og-image.png',
  description:
    'Together KC is the official campaign supporting the renewal of the Kansas City earnings tax in the April 7, 2026 election.',
  email: 'action@together-kc.com',
  areaServed: {
    '@type': 'City',
    name: 'Kansas City',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  knowsAbout: [
    'Kansas City earnings tax',
    'KC e-tax',
    'Municipal taxation',
    'City services funding',
  ],
};

// Website schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Together KC',
  url: 'https://together-kc.com',
  description:
    'Vote YES to renew the Kansas City earnings tax on April 7, 2026. The e-tax funds 47% of city services including fire, police, EMS, roads, and trash collection.',
  publisher: {
    '@type': 'PoliticalOrganization',
    name: 'Together KC',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://together-kc.com/faqs?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

// Election event schema
export const electionEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Kansas City Earnings Tax Renewal Election 2026',
  description:
    'Vote YES to renew the Kansas City earnings tax. The 1% e-tax funds 47% of city services including fire, police, EMS, road maintenance, and trash collection.',
  startDate: '2026-04-07',
  endDate: '2026-04-07',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'City',
    name: 'Kansas City',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kansas City',
      addressRegion: 'MO',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'GovernmentOrganization',
    name: 'Kansas City, Missouri',
    url: 'https://www.kcmo.gov',
  },
  about: {
    '@type': 'GovernmentService',
    name: 'Kansas City Earnings Tax',
    serviceType: 'Municipal Income Tax',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Kansas City, Missouri',
    },
  },
};

// Government service schema for the earnings tax
export const governmentServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentService',
  name: 'Kansas City Earnings Tax',
  alternateName: ['KC E-Tax', 'Kansas City E-Tax', 'KC Earnings Tax', 'KCMO Income Tax'],
  description:
    'A 1% tax on income earned within Kansas City, Missouri. In place since 1963, it funds 47% of city services including fire, police, EMS, road maintenance, trash collection, and snow removal.',
  serviceType: 'Municipal Income Tax',
  provider: {
    '@type': 'GovernmentOrganization',
    name: 'Kansas City, Missouri',
    url: 'https://www.kcmo.gov',
  },
  areaServed: {
    '@type': 'City',
    name: 'Kansas City',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'People who earn income in Kansas City, Missouri',
  },
};

// Helper to generate FAQ schema from FAQ items
export function generateFaqSchema(
  faqs: readonly { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Helper to generate ItemList schema for endorsers
export function generateEndorsersSchema(
  endorsers: readonly { name: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kansas City Earnings Tax Renewal Endorsers',
    description:
      'Organizations and leaders supporting the renewal of the Kansas City earnings tax in 2026',
    numberOfItems: endorsers.length,
    itemListElement: endorsers.map((endorser, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: endorser.name,
      },
    })),
  };
}

// Local business/government schema with geo coordinates
export const localGovernmentSchema = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Kansas City, Missouri',
  url: 'https://www.kcmo.gov',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '414 E 12th St',
    addressLocality: 'Kansas City',
    addressRegion: 'MO',
    postalCode: '64106',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.0997,
    longitude: -94.5786,
  },
  areaServed: {
    '@type': 'City',
    name: 'Kansas City',
    addressRegion: 'MO',
  },
};
