import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { AUGUST_BALLOT } from '@/lib/constants';
import MeasureDetail from './MeasureDetail.client';

const measures = AUGUST_BALLOT.measures;

// Only the five known measures are valid. Anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return measures.map((m) => ({ slug: m.slug }));
}

// Per-measure theme color stays the campaign navy so the browser chrome matches
// the hub. This lives in the viewport export (Next 16) rather than metadata.
export const viewport: Viewport = {
  themeColor: '#1e3a5f',
};

function findMeasure(slug: string) {
  return measures.find((m) => m.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const measure = findMeasure(slug);

  if (!measure) {
    return {
      title: 'Measure not found | August 4, 2026 Kansas City Ballot',
      robots: { index: false, follow: true },
    };
  }

  const url = `https://together-kc.com/questions/${measure.slug}`;
  const title = `${measure.title} | Vote YES August 4, 2026`;
  const description = measure.cardSub;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Together KC',
      images: [
        {
          url: '/images/og-august.png',
          width: 1200,
          height: 630,
          alt: `Together KC - Vote YES on ${measure.name} on August 4, 2026`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Vote YES on ${measure.name} | August 4, 2026 KC Ballot`,
      description,
      images: ['/images/og-august.png'],
    },
  };
}

export default async function MeasureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = measures.findIndex((m) => m.slug === slug);
  if (index === -1) notFound();

  const measure = measures[index];
  const prevM = measures[(index - 1 + measures.length) % measures.length];
  const nextM = measures[(index + 1) % measures.length];

  const prev = { slug: prevM.slug, name: prevM.name, swatch: prevM.accent.swatch, motif: prevM.motif };
  const next = { slug: nextM.slug, name: nextM.name, swatch: nextM.accent.swatch, motif: nextM.motif };

  const vote = {
    electionDate: AUGUST_BALLOT.electionDate,
    earlyVotingDate: AUGUST_BALLOT.earlyVotingDate,
    pollsOpen: AUGUST_BALLOT.pollsOpen,
  };

  return <MeasureDetail measure={measure} prev={prev} next={next} vote={vote} />;
}
