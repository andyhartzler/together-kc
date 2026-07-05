'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'togetherkc_yard_sign_banner_dismissed';

export default function YardSignBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show for first-time visitors
    if (localStorage.getItem(STORAGE_KEY)) return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when hero leaves viewport (user scrolled past it)
        if (!entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // The August polling tool at /vote uses AugustNav, not the e-tax chrome, so
  // suppress this e-tax yard-sign banner there.
  if (pathname === '/vote' || pathname.startsWith('/vote/')) {
    return null;
  }

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-coral text-white shadow-lg h-16 md:h-20"
        >
          <div className="h-full max-w-6xl mx-auto px-4 flex items-center">
            <Link
              href="/etax/sign"
              onClick={dismiss}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <span className="text-2xl md:text-3xl">🪧</span>
              <div>
                <span className="text-base md:text-lg font-bold block">Want a free Vote Yes yard sign?</span>
                <span className="text-sm md:text-base text-white/80">Tap here to get yours!</span>
              </div>
            </Link>
            <button
              onClick={dismiss}
              className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors ml-4"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
