'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PaperButton } from '@/components/august/paper/PaperButton';
import { PAPER_EASE } from '@/components/august/paper/motion';

// August-section navigation, PAPER TRAIL restyle. Solid paper background at
// every scroll position (no transparent state, no logo swap), a hairline
// bottom rule that upgrades to the heavy 3px ink rule on scroll, doc-label
// links, and the coral rectangular Vote YES. Mounted on /, /questions/*,
// and /vote; the detail sticky bar relies on the h-16 md:h-20 row heights.
// Intentionally standalone: it does NOT use the shared NAV_LINKS (those
// serve the archived e-tax pages under /etax). Absolute hrefs so the
// anchors resolve from the /questions detail pages too.
const AUGUST_NAV_LINKS = [
  { label: 'The Five Questions', href: '/#questions' },
  { label: 'How to Vote', href: '/#vote' },
  { label: 'Find Your Polling Place', href: '/vote' },
  { label: 'FAQs', href: '/#faqs' },
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

  // The "Find Your Polling Place" link is the only one whose target is a real
  // route we can match; the rest are in-page anchors.
  const isActive = (href: string) => href === '/vote' && pathname.startsWith('/vote');

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: PAPER_EASE }}
        className="fixed top-0 left-0 right-0 z-[60] bg-paper"
      >
        <nav
          aria-label="August 2026 ballot"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo: the Vote Yes On All 5 campaign mark, full color at every
                scroll position (the bar is always solid paper). */}
            <Link
              href="/"
              aria-label="Vote Yes On All 5, August 2026 ballot home"
              className="shrink-0 rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <Image
                src="/images/august-logo.png"
                alt="Vote Yes On All 5"
                width={269}
                height={80}
                className="h-10 w-auto md:h-14"
                priority
              />
            </Link>

            {/* Desktop links: doc-label type, navy ink, coral press on hover */}
            <div className="hidden items-center gap-1 md:flex lg:gap-2">
              {AUGUST_NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'type-doc-label-lg relative whitespace-nowrap px-2 py-2 transition-colors duration-200 lg:px-3',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                      active ? 'text-coral-press' : 'text-ink hover:text-coral-press'
                    )}
                  >
                    {link.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-coral"
                      />
                    )}
                  </Link>
                );
              })}

              {/* Primary CTA: coral rectangle, hard offset shadow */}
              <PaperButton
                href="/vote"
                size="sm"
                className="ml-1 shadow-[3px_3px_0_var(--ink)] hover:shadow-[4px_4px_0_var(--ink)] lg:ml-2"
              >
                Vote YES
              </PaperButton>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="rounded-[3px] p-2 text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="august-mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Bottom rule: hairline at rest, upgrades to the heavy ink rule on
            scroll. Rendered as its own strip so the h-16 md:h-20 row heights
            the detail sticky bar depends on stay exact. */}
        <div
          aria-hidden="true"
          className={cn(
            'w-full transition-all duration-300',
            isScrolled ? 'h-[3px] bg-ink' : 'h-px bg-hairline'
          )}
        />
      </motion.header>

      {/* Mobile drawer: a paper sheet with ruled rows */}
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
              className="absolute inset-0 bg-[rgba(30,58,95,0.45)]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="august-mobile-menu"
              aria-label="August 2026 ballot"
              initial={reduce ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduce ? { x: 0 } : { x: '100%' }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: PAPER_EASE }}
              className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-72 border-l border-hairline bg-paper shadow-print"
            >
              <div className="flex items-center justify-between border-b border-hairline p-6">
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
                  className="rounded-[3px] p-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6">
                <div className="flex flex-col divide-y divide-hairline">
                  {AUGUST_NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'block px-1 py-4 text-base font-bold transition-colors duration-200',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral',
                          active
                            ? 'border-l-[3px] border-coral pl-3 text-coral-press'
                            : 'text-ink hover:text-coral-press'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  <div className="pt-6">
                    <PaperButton
                      href="/vote"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      Vote YES
                    </PaperButton>
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
