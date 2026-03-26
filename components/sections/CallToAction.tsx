'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { EndorsementPopup } from '@/components/ui/EndorsementPopup';
import { VOTE_DATE } from '@/lib/constants';
import { downloadCalendarEvent } from '@/lib/calendar';

const shareData = {
  title: 'Vote YES to Renew the KC Earnings Tax',
  text: 'The earnings tax funds nearly half of KC\'s essential services. Vote YES on April 7, 2026 to keep Kansas City strong.',
  url: 'https://together-kc.com',
};

const socialLinks = [
  {
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
  },
  {
    name: 'X',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
  },
  {
    name: 'Email',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    href: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareData.url)}`,
  },
];

export default function CallToAction() {
  const [isCalendarClicked, setIsCalendarClicked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try native share API first (works on mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or error - fall through to show modal
        if ((err as Error).name === 'AbortError') return;
      }
    }
    // Show share modal on desktop
    setShowShareModal(true);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    {
      icon: '🗳️',
      title: 'Find Your Polling Place',
      description: 'Look up early voting and Election Day locations.',
      buttonText: 'Find Where to Vote',
      href: '/vote',
      variant: 'primary' as const,
    },
    {
      icon: '✍️',
      title: 'Add Your Name',
      description: 'Show your support by endorsing the renewal.',
      buttonText: 'Endorse Now',
      onClick: () => setShowEndorseModal(true),
      variant: 'primary' as const,
    },
    {
      icon: '💪',
      title: 'Spread the Word',
      description: 'Share with friends, family, and neighbors.',
      buttonText: 'Share',
      onClick: handleShare,
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
    <>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
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
                  {'onClick' in action && action.onClick ? (
                    <button
                      onClick={action.onClick}
                      className="flex-shrink-0 px-4 py-2 bg-coral text-white text-sm font-semibold rounded-full hover:bg-coral/90 transition-colors"
                    >
                      {action.buttonText}
                    </button>
                  ) : (
                    <a
                      href={action.href}
                      {...('external' in action && action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex-shrink-0 px-4 py-2 bg-coral text-white text-sm font-semibold rounded-full"
                    >
                      {action.buttonText}
                    </a>
                  )}
                </div>
                {/* Desktop: vertical layout */}
                <div className="hidden sm:flex sm:flex-col sm:text-center">
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-white/70 text-base mb-6 flex-grow">{action.description}</p>
                  <div className="flex justify-center">
                    {'onClick' in action && action.onClick ? (
                      <button
                        onClick={action.onClick}
                        className="group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 bg-navy text-white hover:bg-navy/85 px-5 py-2.5 text-sm"
                      >
                        <span>{action.buttonText}</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <InteractiveHoverButton
                        text={action.buttonText}
                        href={action.href}
                        variant={action.variant}
                        size="default"
                        external={'external' in action && action.external}
                      />
                    )}
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

      {/* Endorsement Popup */}
      <EndorsementPopup isOpen={showEndorseModal} onClose={() => setShowEndorseModal(false)} />

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📢</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Spread the Word</h3>
                <p className="text-gray-500 text-sm">
                  Share with friends, family, and neighbors
                </p>
              </div>

              {/* Social share buttons */}
              <div className="flex justify-center gap-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-coral hover:text-white flex items-center justify-center text-gray-600 transition-all duration-200"
                    title={`Share on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Copy link */}
              <div className="relative">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={shareData.url}
                    readOnly
                    className="flex-grow bg-transparent text-gray-600 text-sm outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-coral text-white hover:bg-coral/90'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
