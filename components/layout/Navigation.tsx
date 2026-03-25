'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Pages with dark hero backgrounds where we need white text
  const hasDarkHero = pathname === '/' || pathname === '/endorsements' || pathname === '/vote';

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
              {/* Vote YES Button - hidden on home page until scrolled */}
              <button
                onClick={() => {
                  if (pathname.startsWith('/vote')) {
                    // Already on vote page - reset to county selection
                    router.push('/vote');
                    window.location.href = '/vote';
                  } else {
                    router.push('/vote');
                  }
                }}
                className={cn(
                  "ml-2 px-5 py-2.5 text-white font-semibold bg-coral rounded-full transition-all duration-300 hover:scale-105 hover:bg-coral/90 shadow-lg",
                  pathname === '/' && !isScrolled
                    ? 'opacity-0 scale-90 pointer-events-none'
                    : 'opacity-100 scale-100'
                )}
              >
                Vote YES
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
                <div className="flex flex-col space-y-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = getIsActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "relative px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200",
                          isActive
                            ? "text-coral bg-coral/10"
                            : "text-navy hover:bg-light-gray"
                        )}
                      >
                        {link.label}
                        {/* Active indicator bar */}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-nav-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-coral rounded-full"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    );
                  })}
                  <div className="pt-6">
                    {/* Vote YES Button - Mobile - Glass style */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (pathname.startsWith('/vote')) {
                          window.location.href = '/vote';
                        } else {
                          router.push('/vote');
                        }
                      }}
                      className="w-full px-6 py-4 text-lg text-white font-semibold bg-gradient-to-r from-coral to-coral/90 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-coral/30 border border-white/20"
                      style={{
                        boxShadow: '0 4px 20px rgba(229, 57, 53, 0.3)',
                      }}
                    >
                      Vote YES
                    </button>
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
