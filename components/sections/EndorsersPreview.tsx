'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ENDORSERS } from '@/lib/constants';
import { getOrderedQuotes } from '@/lib/endorser-quotes';
import Button from '@/components/ui/Button';
import { EndorserCard } from '@/components/ui/EndorserCard';
import { EndorserCardStack } from '@/components/ui/EndorserCardStack';

export default function EndorsersPreview() {
  const previewOrgs = ENDORSERS.organizations.slice(0, 8);

  // Get quotes ordered alphabetically by person, random within each person
  const quotes = useMemo(() => getOrderedQuotes(), []);

  return (
    <section className="section-padding bg-gradient-to-b from-white via-light-gray/30 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
            Endorsed by Leaders Across Kansas City
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from the voices championing our city&apos;s future
          </p>
        </motion.div>

        {/* Endorser Card Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >
          <EndorserCardStack
            quotes={quotes}
            intervalMs={6000}
            springStiffness={120}
            springDamping={20}
          />
        </motion.div>

        {/* Organization Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-navy text-center mb-8">
            Supported by organizations<br className="sm:hidden" /> across Kansas City
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {previewOrgs.map((org, index) => (
              <EndorserCard
                key={org.name}
                name={org.name}
                fullName={org.fullName}
                logo={org.logo}
                website={org.website}
                index={index}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/endorsements">
              <Button variant="outline" size="md">
                See All Endorsements
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
