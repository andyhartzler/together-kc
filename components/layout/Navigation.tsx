'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Pages with dark hero backgrounds where we need white text
  const hasDarkHero = pathname === '/' || pathname === '/endorsements';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 hover:scale-105',
                    isScrolled || !hasDarkHero
                      ? 'text-navy hover:text-coral'
                      : 'text-white hover:text-coral',
                    'after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-coral after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/endorsements#endorse"
                className="ml-2 px-5 py-2.5 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-all hover:scale-105 shadow-lg"
              >
                Vote YES
              </Link>
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
                  <div className="pt-4">
                    <Link
                      href="/endorsements#endorse"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-3 bg-coral text-white font-semibold rounded-full text-center hover:bg-coral/90 transition-all"
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
