'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { EndorserCard } from '@/components/ui/EndorserCard';
import { LinkCard } from '@/components/ui/LinkCard';
import { ShareCard } from '@/components/ui/ShareCard';
import EndorsementForm from '@/components/forms/EndorsementForm';
import { ENDORSERS, VOTE_DATE } from '@/lib/constants';

export default function EndorsementsPage() {
  const featuredEndorser = ENDORSERS.featured[0];

  return (
    <>
      {/* Hero Section with Mayor Quote */}
      <section className="relative pt-44 sm:pt-52 pb-72 sm:pb-96 bg-gradient-to-br from-navy via-navy/95 to-sky/80 overflow-x-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-coral via-transparent to-transparent" />
        </div>

        {/* Bottom fade overlay - very gradual fade that eases in slowly */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 sm:h-64"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.8) 85%, rgba(255,255,255,1) 100%)'
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-bold text-white mb-14 sm:mb-20">
              {/* Community Leaders Support - word by word reveal */}
              <span className="block text-2xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
                {['Community', 'Leaders', 'Support'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="inline-block mr-[0.3em] last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              {/* Renewal - dramatic entrance with glow */}
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  filter: 'blur(20px)',
                  textShadow: '0 0 0px rgba(229, 57, 53, 0)'
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  textShadow: [
                    '0 0 0px rgba(229, 57, 53, 0)',
                    '0 0 60px rgba(229, 57, 53, 0.8)',
                    '0 0 30px rgba(229, 57, 53, 0.4)'
                  ]
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  textShadow: {
                    duration: 1.2,
                    delay: 0.8,
                    times: [0, 0.5, 1]
                  }
                }}
                className="block text-3xl sm:text-5xl md:text-6xl text-coral relative"
              >
                Renewal
                {/* Animated underline sweep */}
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-coral to-transparent origin-center"
                />
              </motion.span>
            </h1>

            {/* Featured Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
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
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                  <Image
                    src="/images/mayor-quinton-lucas.jpg"
                    alt={featuredEndorser.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover scale-125 object-top"
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{featuredEndorser.name}</div>
                  <div className="text-white/70">{featuredEndorser.role}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Organizations Section */}
      <section className="section-padding pt-8 sm:pt-12 pb-6 sm:pb-8 bg-gradient-to-b from-white to-light-gray">
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
      <section className="section-padding pt-6 sm:pt-8 bg-light-gray">
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

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {ENDORSERS.cityOfficials.map((official, index) => (
              <motion.div
                key={official.name}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  <span className="font-medium text-navy text-xs sm:text-base whitespace-nowrap">{official.name}, {official.title}</span>
                  {official.district && (
                    <span className="text-gray-500 text-xs sm:text-sm">{official.district}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Elected Officials Section */}
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
              State and county leaders also support the earnings tax renewal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {ENDORSERS.electedOfficials.map((official, index) => {
              const getObjectPosition = () => {
                if (official.name === 'Michael Johnson') return 'object-[center_30%]';
                if (official.name === 'Maggie Nurrenbern') return 'object-top';
                return '';
              };
              return (
                <motion.div
                  key={official.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            <p className="text-base sm:text-lg text-white/80">
              There are many ways to support the renewal campaign.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            <ShareCard
              title="Spread the Word"
              description="Share with friends, family, and coworkers. Every conversation matters."
              icon="📢"
              buttonText="Share Now"
            />
            <LinkCard
              title="Display a Sign"
              description="Show your neighborhood that you support renewal with a yard sign."
              icon="🏠"
              href="mailto:action@together-kc.com?subject=Request a Yard Sign"
              buttonText="Get a Sign"
            />
            <LinkCard
              title="Vote Early"
              description="Don't wait until Election Day. Vote early to make sure your voice counts."
              icon="🗳️"
              href="https://www.kceb.org/voters/how-do-i-vote"
              buttonText="Learn How"
            />
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
              href="mailto:action@together-kc.com?subject=Volunteer for Together KC"
            >
              Contact Us to Volunteer
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
