'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ENDORSERS } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function EndorsersPreview() {
  const featuredEndorser = ENDORSERS.featured[0];
  const previewOrgs = ENDORSERS.organizations.slice(0, 8);

  return (
    <section className="section-padding bg-gradient-to-b from-white to-light-gray relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-8">
            Endorsed by Leaders Across KC
          </h2>

          {/* Quote Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl shadow-navy/10 border border-gray-100">
            <svg
              className="w-12 h-12 text-coral/20 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-xl md:text-2xl text-navy/80 italic mb-6 leading-relaxed">
              &#34;{featuredEndorser.quote}&#34;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-2xl font-bold text-navy">
                QL
              </div>
              <div className="text-left">
                <div className="font-semibold text-navy">{featuredEndorser.name}</div>
                <div className="text-gray-600">{featuredEndorser.role}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Organization Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-navy text-center mb-8">
            Supported by organizations across Kansas City
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {previewOrgs.map((org, index) => (
              <motion.div
                key={org}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 text-center shadow-lg shadow-navy/5 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <span className="text-sm font-medium text-navy">{org}</span>
              </motion.div>
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
