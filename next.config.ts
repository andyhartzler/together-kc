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
      // Ensure proper content type for llms.txt
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
      // FAQ variants
      {
        source: '/faq',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/questions',
        destination: '/faqs',
        permanent: true,
      },
      // E-tax/etax variants redirect to home
      {
        source: '/etax',
        destination: '/',
        permanent: true,
      },
      {
        source: '/e-tax',
        destination: '/',
        permanent: true,
      },
      {
        source: '/earnings-tax',
        destination: '/',
        permanent: true,
      },
      // Support/contribute redirect to donate
      {
        source: '/support',
        destination: '/donate',
        permanent: true,
      },
      {
        source: '/contribute',
        destination: '/donate',
        permanent: true,
      },
      // Endorsement singular redirect
      {
        source: '/endorsement',
        destination: '/endorsements',
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
    ];
  },
};

export default nextConfig;
