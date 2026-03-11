'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'togetherkc_yard_sign_banner_dismissed';

export default function YardSignBanner() {
  const [show, setShow] = useState(false);

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

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 bg-coral text-white shadow-lg"
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Link
              href="/sign"
              onClick={dismiss}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold hover:underline"
            >
              <span>🪧</span>
              <span>Want a free Vote Yes yard sign?</span>
              <span className="hidden sm:inline text-white/80 font-normal">Get yours now!</span>
            </Link>
            <button
              onClick={dismiss}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
