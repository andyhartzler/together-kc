'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// August-section navigation. Intentionally standalone: it does NOT use the
// shared NAV_LINKS (those serve the archived e-tax pages under /etax).
// Absolute hrefs so the anchors resolve from the /questions detail pages too.
// The hub's anchors are on /ballot: since the August 4, 2026 result went up,
// the apex redirects to /victory (one entry in next.config.ts).
const AUGUST_NAV_LINKS = [
  { label: 'The Five Questions', href: '/ballot#questions' },
  { label: 'How to Vote', href: '/ballot#vote' },
  { label: 'Find Your Polling Place', href: '/vote' },
  { label: 'FAQs', href: '/ballot#faqs' },
] as const;

export default function AugustNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileMenuOpen]);

  // Every hero in the august section is dark (navy hub hero + accent detail
  // heroes with a scrim), so white text reads over the transparent state and
  // navy reads over the solid scrolled state.
  const onLight = isScrolled;

  // The "Find Your Polling Place" link is the only one whose target is a real
  // route we can match; the rest are in-page anchors.
  const isActive = (href: string) => href === '/vote' && pathname.startsWith('/vote');

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[60] transition-all duration-300',
          isScrolled
            ? 'bg-white md:bg-white/95 md:backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
      >
        <nav
          aria-label="August 2026 ballot"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo: the Vote Yes On All 5 campaign mark. All-white over the
                dark hero, full color once the bar turns white on scroll (same
                treatment the e-tax nav used). */}
            <Link
              href="/"
              aria-label="Vote Yes On All 5, August 2026 ballot home"
              className="flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <Image
                src={onLight ? '/images/august-logo.png' : '/images/august-logo-white.png'}
                alt="Vote Yes On All 5"
                width={269}
                height={80}
                className="h-10 md:h-14 w-auto transition-all duration-300"
                priority
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {AUGUST_NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative px-2 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-semibold transition-colors duration-200 whitespace-nowrap',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2',
                      onLight
                        ? 'text-navy hover:text-coral focus-visible:ring-offset-white'
                        : 'text-white hover:text-coral focus-visible:ring-offset-transparent',
                      active && 'text-coral'
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-coral rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Primary CTA */}
              <Link
                href="/vote"
                className="ml-1 lg:ml-2 px-3 lg:px-5 py-2 lg:py-2.5 text-sm lg:text-base text-white font-semibold bg-coral rounded-full transition-all duration-300 hover:scale-105 hover:bg-coral/90 shadow-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Vote YES
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral',
                onLight ? 'text-navy' : 'text-white'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="august-mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-[70] md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="august-mobile-menu"
              aria-label="August 2026 ballot"
              initial={reduce ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduce ? { x: 0 } : { x: '100%' }}
              transition={reduce ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-72 bg-white shadow-xl"
            >
              <div className="p-6 pt-6 flex items-center justify-between">
                <Image
                  src="/images/august-logo.png"
                  alt="Vote Yes On All 5"
                  width={235}
                  height={70}
                  className="h-7 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6">
                <div className="flex flex-col space-y-1">
                  {AUGUST_NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'relative px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral',
                          active ? 'text-coral bg-coral/10' : 'text-navy hover:bg-light-gray'
                        )}
                      >
                        {link.label}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-coral rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                  <div className="pt-6">
                    <Link
                      href="/vote"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-6 py-4 text-lg text-white font-semibold bg-gradient-to-r from-coral to-coral/90 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                      style={{ boxShadow: '0 4px 20px rgba(229, 57, 53, 0.3)' }}
                    >
                      Vote YES
                    </Link>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
