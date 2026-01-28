'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { downloadCalendarEvent } from '@/lib/calendar';
import { VoteYesModal } from '@/components/ui/VoteYesModal';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const pathname = usePathname();

  // Pages with dark hero backgrounds where we need white text
  const hasDarkHero = pathname === '/' || pathname === '/endorsements' || pathname === '/donate';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active nav item based on pathname
  const getIsActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white md:bg-white/95 md:backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={!isScrolled && hasDarkHero ? "/images/renew-kc-logo-white.png" : "/images/renew kc logo.png"}
                alt="Renew KC Earnings Tax"
                width={180}
                height={60}
                className="h-10 md:h-14 w-auto transition-all duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {NAV_LINKS.map((link) => {
                const isActive = getIsActive(link.href);
                const showLamp = isActive && link.href !== '/';

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 hover:scale-105',
                      isScrolled || !hasDarkHero
                        ? 'text-navy hover:text-coral'
                        : 'text-white hover:text-coral',
                      showLamp && 'text-coral'
                    )}
                  >
                    {link.label}
                    {/* Lamp glow indicator for active non-home pages */}
                    {showLamp && (
                      <motion.div
                        layoutId="nav-lamp"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="w-8 h-1 bg-coral rounded-full">
                          <div className="absolute w-12 h-4 bg-coral/30 rounded-full blur-md -top-1 -left-2" />
                          <div className="absolute w-8 h-4 bg-coral/20 rounded-full blur-lg -top-2 left-0" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                );
              })}
              {/* Shimmer Vote YES Button */}
              <button
                onClick={() => setIsVoteModalOpen(true)}
                className="group relative z-0 ml-2 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-5 py-2.5 text-white font-semibold bg-coral rounded-full transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px hover:scale-105 shadow-lg"
                style={{ '--speed': '3s', '--spread': '90deg', '--shimmer-color': '#ffffff' } as React.CSSProperties}
              >
                {/* Shimmer spark container */}
                <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
                  <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                    <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
                  </div>
                </div>
                Vote YES
                {/* Highlight */}
                <div className="insert-0 absolute size-full rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
                {/* Backdrop */}
                <div className="absolute -z-20 bg-coral rounded-full inset-[0.05em]" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                isScrolled || !hasDarkHero ? 'text-navy' : 'text-white'
              )}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-72 bg-white shadow-xl"
            >
              <div className="p-6 pt-20">
                <div className="flex flex-col space-y-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-navy font-medium rounded-lg hover:bg-light-gray transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-3">
                    {/* Shimmer Vote YES Button - Mobile */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsVoteModalOpen(true);
                      }}
                      className="group relative z-0 flex w-full cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white font-semibold bg-coral rounded-full transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px"
                      style={{ '--speed': '3s', '--spread': '90deg', '--shimmer-color': '#ffffff' } as React.CSSProperties}
                    >
                      {/* Shimmer spark container */}
                      <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
                        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                          <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
                        </div>
                      </div>
                      Vote YES
                      {/* Highlight */}
                      <div className="insert-0 absolute size-full rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
                      {/* Backdrop */}
                      <div className="absolute -z-20 bg-coral rounded-full inset-[0.05em]" />
                    </button>
                    <button
                      onClick={() => {
                        downloadCalendarEvent();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-6 py-3 bg-navy text-white font-semibold rounded-full text-center hover:bg-navy/90 transition-all"
                    >
                      Remind Me to Vote
                    </button>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote YES Modal */}
      <VoteYesModal isOpen={isVoteModalOpen} onClose={() => setIsVoteModalOpen(false)} />
    </>
  );
}
