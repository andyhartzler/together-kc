'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { VOTE_DATE } from '@/lib/constants';
import { downloadCalendarEvent } from '@/lib/calendar';

export default function CallToAction() {
  const [isCalendarClicked, setIsCalendarClicked] = useState(false);
  const actions = [
    {
      icon: '✍️',
      title: 'Add Your Name',
      description: 'Show your support by endorsing the renewal.',
      buttonText: 'Endorse Now',
      href: '/endorsements#endorse',
      variant: 'primary' as const,
    },
    {
      icon: '💪',
      title: 'Spread the Word',
      description: 'Share with friends, family, and neighbors.',
      buttonText: 'Share',
      href: '#share',
      variant: 'secondary' as const,
    },
    {
      icon: '📋',
      title: 'Check Your Registration',
      description: 'Make sure you\'re registered to vote.',
      buttonText: 'Check Now',
      href: 'https://voteroutreach.sos.mo.gov/portal/',
      variant: 'primary' as const,
      external: true,
    },
  ];

  return (
    <section className="section-padding bg-navy relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-coral via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Make Your Voice Heard
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Vote YES on {VOTE_DATE} to keep<br className="sm:hidden" />
            <span className="whitespace-nowrap"> Kansas City strong.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 cursor-pointer"
            >
              {/* Mobile: horizontal layout */}
              <div className="flex items-center gap-4 sm:hidden">
                <div className="text-3xl flex-shrink-0">{action.icon}</div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-base font-semibold text-white">{action.title}</h3>
                  <p className="text-white/70 text-sm">{action.description}</p>
                </div>
                <a
                  href={action.href}
                  {...('external' in action && action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex-shrink-0 px-4 py-2 bg-coral text-white text-sm font-semibold rounded-full"
                >
                  {action.buttonText}
                </a>
              </div>
              {/* Desktop: vertical layout */}
              <div className="hidden sm:flex sm:flex-col sm:text-center">
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-white/70 text-base mb-6 flex-grow">{action.description}</p>
                <div className="flex justify-center">
                  <InteractiveHoverButton
                    text={action.buttonText}
                    href={action.href}
                    variant={action.variant}
                    size="default"
                    external={'external' in action && action.external}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Vote Date - Calendar Download Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 mb-8 sm:mb-12 text-center"
        >
          <motion.button
            onClick={() => {
              setIsCalendarClicked(true);
              downloadCalendarEvent();
              setTimeout(() => setIsCalendarClicked(false), 600);
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 25px 50px -12px rgba(229, 57, 53, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            animate={isCalendarClicked ? {
              scale: [1, 1.1, 1],
              rotate: [0, -2, 2, -2, 0],
            } : {}}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
            className="group relative inline-block bg-coral rounded-2xl px-6 py-4 sm:px-8 sm:py-6 shadow-2xl shadow-coral/30 cursor-pointer overflow-hidden border-0"
          >
            {/* Animated background shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />

            {/* Pulsing ring animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 flex items-center justify-center gap-3">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <motion.span
                    className="text-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    📅
                  </motion.span>
                  <p className="text-white font-medium text-lg">Mark your calendar!</p>
                </div>
                <p className="text-white font-bold text-3xl md:text-4xl">{VOTE_DATE}</p>
              </div>
            </div>

            {/* Click feedback checkmark */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={isCalendarClicked ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
              transition={{ duration: 0.6, times: [0, 0.2, 0.8, 1] }}
            >
              <motion.span
                className="text-white text-4xl"
                initial={{ scale: 0 }}
                animate={isCalendarClicked ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                ✓
              </motion.span>
            </motion.div>
          </motion.button>

        </motion.div>
      </div>
    </section>
  );
}
