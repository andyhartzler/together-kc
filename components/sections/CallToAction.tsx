'use client';

import { motion } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { VOTE_DATE } from '@/lib/constants';

export default function CallToAction() {
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
      icon: '📧',
      title: 'Stay Informed',
      description: 'Get updates on the campaign and how to help.',
      buttonText: 'Sign Up',
      href: '#signup',
      variant: 'outline' as const,
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
            Vote YES on {VOTE_DATE} to keep Kansas City strong.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20"
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
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Vote Date */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-coral rounded-2xl px-6 py-4 sm:px-8 sm:py-6 shadow-2xl shadow-coral/30">
            <p className="text-white font-medium text-lg mb-1">Mark your calendar!</p>
            <p className="text-white font-bold text-3xl md:text-4xl">{VOTE_DATE}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
