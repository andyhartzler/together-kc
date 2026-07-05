import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Ensure proper content type for llms.txt and llms-full.txt
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // Cache for 1 day
          },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // Cache for 1 day
          },
        ],
      },
      // Cache control for sitemap
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // Cache for 1 hour
          },
        ],
      },
    ];
  },

  // Redirects for common URL variants
  async redirects() {
    return [
      // The August 4, 2026 ballot campaign now lives AT the apex (no redirect).
      // The old /august-2026 URLs that were shared publicly forward to the new
      // canonical locations.
      {
        source: '/august-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/august-2026/:slug',
        destination: '/questions/:slug',
        permanent: true,
      },
      // Bare /questions has no page of its own; send it to the hub section.
      {
        source: '/questions',
        destination: '/#questions',
        permanent: true,
      },
      // The e-tax campaign (April 7, 2026 - won) is archived under /etax.
      // Old root-level e-tax URLs forward there so shared links keep working.
      {
        source: '/victory',
        destination: '/etax/victory',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/etax/home',
        permanent: true,
      },
      {
        source: '/donate',
        destination: '/etax/donate',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/etax/faqs',
        permanent: true,
      },
      {
        source: '/endorse',
        destination: '/etax/endorse',
        permanent: true,
      },
      {
        source: '/endorsements',
        destination: '/etax/endorsements',
        permanent: true,
      },
      {
        source: '/sign',
        destination: '/etax/sign',
        permanent: true,
      },
      {
        source: '/press-kit',
        destination: '/etax/press-kit',
        permanent: true,
      },
      {
        source: '/social',
        destination: '/etax/social',
        permanent: true,
      },
      // FAQ variants
      {
        source: '/faq',
        destination: '/etax/faqs',
        permanent: true,
      },
      // Old site ghost pages still in Google's index
      {
        source: '/facts',
        destination: '/etax/faqs',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/',
        permanent: true,
      },
      // E-tax name variants
      {
        source: '/e-tax',
        destination: '/etax',
        permanent: true,
      },
      {
        source: '/earnings-tax',
        destination: '/etax',
        permanent: true,
      },
      // Support/contribute redirect to donate
      {
        source: '/support',
        destination: '/etax/donate',
        permanent: true,
      },
      {
        source: '/contribute',
        destination: '/etax/donate',
        permanent: true,
      },
      // Endorsement singular redirect
      {
        source: '/endorsement',
        destination: '/etax/endorsements',
        permanent: true,
      },
      // Vote-yes variant redirects to /vote
      {
        source: '/vote-yes',
        destination: '/vote',
        permanent: true,
      },
      {
        source: '/vote-early',
        destination: '/vote',
        permanent: true,
      },
      {
        source: '/find-polling',
        destination: '/vote',
        permanent: true,
      },
      // Voting location search variants
      {
        source: '/where-to-vote',
        destination: '/vote',
        permanent: true,
      },
      {
        source: '/polling-places',
        destination: '/vote',
        permanent: true,
      },
      {
        source: '/polling-locations',
        destination: '/vote',
        permanent: true,
      },
      {
        source: '/where-do-i-vote',
        destination: '/vote',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
