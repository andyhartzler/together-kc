'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { EndorserCard } from '@/components/ui/EndorserCard';
import EndorsementForm from '@/components/forms/EndorsementForm';
import { ENDORSERS, VOTE_DATE } from '@/lib/constants';

export default function EndorsementsPage() {
  const featuredEndorser = ENDORSERS.featured[0];

  return (
    <>
      {/* Hero Section with Mayor Quote */}
      <section className="relative pt-32 pb-72 sm:pb-96 bg-gradient-to-br from-navy via-navy/95 to-sky/80 overflow-x-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-coral via-transparent to-transparent" />
        </div>

        {/* Bottom fade overlay - fades the existing gradient to white */}
        <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-56 bg-gradient-to-b from-transparent to-white" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-bold text-white mb-8">
              <span className="block text-2xl sm:text-5xl md:text-6xl">Community Leaders Support</span>
              <span className="block text-3xl sm:text-5xl md:text-6xl text-coral">Renewal</span>
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
                <Image
                  src="/images/mayor-quinton-lucas.jpg"
                  alt={featuredEndorser.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                />
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
      <section className="section-padding pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-b from-white to-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-[clamp(1.5rem,6vw,2.25rem)] font-bold text-navy mb-4 whitespace-nowrap">
              Supporting Organizations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Businesses, unions, and civic organizations across Kansas City support renewal.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {ENDORSERS.organizations.map((org, index) => (
              <EndorserCard
                key={org.name}
                name={org.name}
                logo={org.logo}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* City Officials Section */}
      <section className="section-padding pt-8 sm:pt-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              City Officials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kansas City&apos;s Mayor and City Council support the earnings tax renewal.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {ENDORSERS.cityOfficials.map((official) => (
              <motion.div
                key={official.name}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white rounded-xl p-4 shadow-lg shadow-navy/5 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={official.photo}
                    alt={official.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-navy text-sm sm:text-base">{official.name}, {official.title}</span>
                  {official.district && (
                    <span className="text-gray-500 text-xs sm:text-sm">{official.district}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Other Elected Officials Section */}
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
              Elected Officials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              State and county leaders also support the earnings tax renewal.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {ENDORSERS.electedOfficials.map((official) => {
              const getObjectPosition = () => {
                if (official.name === 'Michael Johnson') return 'object-[center_30%]';
                if (official.name === 'Maggie Nurrenbern') return 'object-top';
                return '';
              };
              return (
                <motion.div
                  key={official.name}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-light-gray rounded-xl p-4 shadow-lg shadow-navy/5 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={official.photo}
                      alt={official.name}
                      fill
                      className={`object-cover ${getObjectPosition()}`}
                      sizes="48px"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-navy text-sm sm:text-base">{official.name}, {official.title}</span>
                    {official.district && (
                      <span className="text-gray-500 text-xs sm:text-sm">{official.district}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
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
      <section className="section-padding pb-48 bg-navy">
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
