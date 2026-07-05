import type { Metadata } from 'next';
import { FAQS } from '@/lib/constants';
import JsonLd, { generateFaqSchema } from '@/components/seo/JsonLd';
import FAQsContent from './FAQsContent';

export const metadata: Metadata = {
  title: 'FAQs | Kansas City Earnings Tax Renewal 2026',
  description:
    'Get answers to frequently asked questions about the Kansas City earnings tax renewal. Learn about the 1% e-tax rate, what it funds, who pays, and how to vote YES on April 7, 2026.',
  alternates: {
    canonical: 'https://together-kc.com/etax/faqs',
  },
  openGraph: {
    title: 'FAQs | Kansas City Earnings Tax Renewal 2026',
    description:
      'Everything you need to know about the KC earnings tax: what it is, who pays, what it funds, and why renewal matters.',
    url: 'https://together-kc.com/etax/faqs',
  },
  keywords: [
    'Kansas City earnings tax FAQ',
    'KC e-tax questions',
    'what is Kansas City earnings tax',
    'who pays KC earnings tax',
    'earnings tax renewal questions',
    'KC e-tax explained',
  ],
};

export default function FAQsPage() {
  return (
    <>
      <JsonLd data={generateFaqSchema(FAQS)} />
      <FAQsContent />
    </>
  );
}
