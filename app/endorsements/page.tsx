'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import EndorsementForm from '@/components/forms/EndorsementForm';
import { ENDORSERS, VOTE_DATE } from '@/lib/constants';

export default function EndorsementsPage() {
  const featuredEndorser = ENDORSERS.featured[0];

  return (
    <>
      {/* Hero Section with Mayor Quote */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-navy via-navy/95 to-sky/80 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-coral via-transparent to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
              Community Leaders Support
              <br />
              <span className="text-coral">Renewal</span>
            </h1>

            {/* Featured Quote */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <svg
                className="w-12 h-12 text-coral/60 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-xl md:text-2xl text-white italic mb-6 leading-relaxed">
                &#34;{featuredEndorser.quote}&#34;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                  QL
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{featuredEndorser.name}</div>
                  <div className="text-white/70">{featuredEndorser.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Supporting Organizations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Businesses, unions, and civic organizations across Kansas City support renewal.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ENDORSERS.organizations.map((org, index) => (
              <motion.div
                key={org}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="bg-light-gray rounded-xl p-4 text-center hover:bg-navy hover:text-white transition-colors cursor-default"
              >
                <span className="text-sm font-medium">{org}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elected Officials Section */}
      <section className="section-padding bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Elected Officials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leaders at every level of government support the earnings tax renewal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {ENDORSERS.electedOfficials.map((official, index) => (
              <motion.div
                key={official}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-lg shadow-navy/5 border border-gray-100 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-coral"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium text-navy">{official}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Endorsement Form Section */}
      <section id="endorse" className="section-padding bg-gradient-to-b from-white to-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Message */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
                Make Your Voice Heard
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join hundreds of Kansas Citians who support the earnings tax renewal.
                Add your name to show the community stands together.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Endorse as an Individual</h4>
                    <p className="text-gray-600 text-sm">
                      Show your personal support for Kansas City&#39;s essential services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Endorse as an Organization</h4>
                    <p className="text-gray-600 text-sm">
                      Add your business or group to the growing coalition of supporters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-navy/5 rounded-xl p-6">
                <p className="text-sm text-navy/80">
                  <strong>Vote on or before {VOTE_DATE}</strong> to ensure your voice is counted.
                  Early voting and mail-in ballots are available.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <EndorsementForm />
          </div>
        </div>
      </section>

      {/* How Else Can I Help Section */}
      <section className="section-padding bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Else Can I Help?
            </h2>
            <p className="text-lg text-white/80">
              There are many ways to support the renewal campaign.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📢',
                title: 'Spread the Word',
                description: 'Share with friends, family, and coworkers. Every conversation matters.',
              },
              {
                icon: '🏠',
                title: 'Display a Sign',
                description: 'Show your neighborhood that you support renewal with a yard sign.',
              },
              {
                icon: '🗳️',
                title: 'Vote Early',
                description: 'Don\'t wait until Election Day. Vote early to make sure your voice counts.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              variant="primary"
              size="lg"
              href="mailto:info@togetherkc.com?subject=Volunteer for Together KC"
            >
              Contact Us to Volunteer
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
