'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const CYCLING_WORDS = [
  'Firefighters',
  'EMTs',
  'Emergency Response',
  'Street Repairs',
  'Trash Pickup',
  'Bulky Item Pickup',
  'Recycling',
  'Illegal Dumping Cleanup',
  'Snow Removal',
  'Street Lighting',
  'Road Maintenance',
  'Infrastructure Investments',
  'City Jobs',
  'Transportation',
  'Parks',
  'Recreation Centers',
  'City Programs',
  'Housing Services',
  'Water Services',
  'Public Works',
  'Municipal Court',
  'Economic Development',
  'City Planning',
  'Neighborhood Services',
  'Community Investment',
];

const FINAL_WORD = 'Kansas City';

export default function AnimatedTextCycle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Find the longest word to set fixed container width
  const longestWord = useMemo(() => {
    const allWords = [...CYCLING_WORDS, FINAL_WORD];
    return allWords.reduce((longest, word) =>
      word.length > longest.length ? word : longest
    , '');
  }, []);

  // Measure the longest word on mount
  useEffect(() => {
    if (measureRef.current) {
      setContainerWidth(measureRef.current.offsetWidth);
    }
  }, []);

  // Start animation when in view and width is measured
  useEffect(() => {
    if (isInView && containerWidth > 0 && !hasStarted) {
      // Use a small delay to ensure smooth start
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, containerWidth, hasStarted]);

  // Cycle through words with accelerating speed
  useEffect(() => {
    if (!hasStarted || isComplete) return;

    // Calculate interval - starts at 100ms, accelerates to 60ms
    const progress = currentIndex / CYCLING_WORDS.length;
    const interval = Math.max(60, 100 - (progress * 40));

    const timer = setTimeout(() => {
      if (currentIndex < CYCLING_WORDS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Pause before showing final word
        setTimeout(() => {
          setIsComplete(true);
        }, 300);
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [hasStarted, currentIndex, isComplete]);

  const currentWord = isComplete ? FINAL_WORD : CYCLING_WORDS[currentIndex];

  return (
    <div ref={containerRef} className="text-2xl md:text-3xl font-bold text-navy mb-8 text-center">
      {/* Hidden span to measure longest word */}
      <span
        ref={measureRef}
        className="invisible absolute whitespace-nowrap text-2xl md:text-3xl font-bold"
        aria-hidden="true"
      >
        {longestWord}
      </span>

      <span>The E-Tax Funds </span>
      <span
        className="inline-block text-left"
        style={{ width: containerWidth > 0 ? containerWidth : 'auto' }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWord}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isComplete ? [1, 1.05, 1] : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: isComplete ? 0.3 : 0.05 },
              scale: { duration: 0.4, ease: 'easeOut' }
            }}
            className={isComplete ? 'text-coral' : 'text-navy'}
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
