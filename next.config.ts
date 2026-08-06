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
      // ===================================================================
      // POST-ELECTION FRONT DOOR (August 5, 2026)
      //
      // together-kc.com now lands on the five-question result page. This ONE
      // entry is the entire switch. The ballot hub was not moved, rewritten,
      // or deleted: it is still app/(august)/page.tsx and it is still served
      // at /ballot (app/(august)/ballot/page.tsx re-exports it).
      //
      // TO FLIP BACK: deleting this single object is the ROUTING half, and on
      // its own it leaves the apex as an unlinked, uncanonicalized duplicate of
      // /ballot. The full revert is this object plus five follow-on edits:
      //   1. components/august/AugustNav.tsx  - three '/ballot#...' anchors
      //   2. components/layout/Footer.tsx     - 'The Five Questions' href
      //   3. app/(august)/questions/[slug]/MeasureDetail.client.tsx and
      //      .../not-found.tsx and app/(august)/privacy/page.tsx - back-links
      //   4. app/(august)/ballot/page.tsx     - drop the /ballot canonical, or
      //      point it at the apex, so the hub does not self-canonicalize away
      //      from the URL it is being served on
      //   5. app/sitemap.ts                  - add the apex entry back (there
      //      is no site-wide canonical in app/layout.tsx to fall back on)
      // The victory page's own "Explore the full site" link is fine either way:
      // it points at /ballot, which keeps working as an alias.
      //
      // permanent: false (307) is deliberate. A 308 would be hard-cached by
      // browsers and could not be flipped back, which is the same trap this
      // file already documents for /press-kit below.
      // ===================================================================
      {
        source: '/',
        destination: '/victory',
        permanent: false,
      },
      // The old /august-2026 URLs that were shared publicly forward to the
      // ballot hub's own URL.
      {
        source: '/august-2026',
        destination: '/ballot',
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
        destination: '/ballot#questions',
        permanent: true,
      },
      // NOTE: /victory used to 308 to /etax/victory. As of the August 4, 2026
      // election, /victory is a real page again (app/(august)/victory) for the
      // five-question result, so that redirect is gone. Config redirects run
      // before filesystem routing, so leaving it in place would have made the
      // new page unreachable. The e-tax victory page still lives at its own
      // canonical URL, /etax/victory.
      // The e-tax campaign (April 7, 2026 - won) is archived under /etax.
      // Old root-level e-tax URLs forward there so shared links keep working.
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
      // The press kit now covers the August 4, 2026 ballot and lives at /press.
      // The old /press-kit URL (and a /media-kit variant) forward to it.
      // Intentionally non-permanent (307): this URL's target changes each
      // election cycle (it previously pointed at the e-tax kit), so we avoid a
      // 308 that browsers hard-cache and that would be hard to repoint later.
      {
        source: '/press-kit',
        destination: '/press',
        permanent: false,
      },
      {
        source: '/media-kit',
        destination: '/press',
        permanent: false,
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
      // NOTE: /privacy previously 308-redirected to / as an old-site ghost
      // page. It is now a real page again (app/(august)/privacy) because the
      // voter-outreach call and text programs need a published policy URL, so
      // no redirect here. Browsers that cached the old 308 may still forward
      // until their cache expires; fresh visitors get the page.
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/privacy',
        permanent: false,
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
