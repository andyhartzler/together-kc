'use client';

import { motion } from 'framer-motion';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import { FAQS, VOTE_DATE } from '@/lib/constants';

export default function FAQsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-b from-sky/10 via-white to-light-gray overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-sky/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-golden/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy mb-6">
              Frequently Asked
              <br />
              <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about the Kansas City earnings tax renewal on {VOTE_DATE}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={FAQS} />

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-navy/5 border border-gray-100">
              <h3 className="text-xl font-semibold text-navy mb-4">
                Want to share these FAQs?
              </h3>
              <p className="text-gray-600 mb-6">
                Download a printable version to share with friends, neighbors, and colleagues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </Button>
                <Button variant="outline" href="/">
                  Back to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              We&#39;re here to help. Reach out to learn more about how you can support the renewal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href="mailto:info@togetherkc.com">
                Contact Us
              </Button>
              <Button
                variant="outline"
                href="/endorsements#endorse"
                className="border-white text-white hover:bg-white hover:text-navy"
              >
                Add Your Endorsement
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
