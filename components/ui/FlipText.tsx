"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  words: string[];
  duration?: number;
  className?: string;
  finalWord?: string;
}

export function FlipText({
  words,
  duration = 2000,
  className,
  finalWord,
}: FlipTextProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only start when 80% in view
  const isInView = useInView(containerRef, { once: true, amount: 0.8 });

  const allWords = finalWord ? [...words, finalWord] : words;

  // Auto-advance, pause on hover
  useEffect(() => {
    if (!isInView || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= allWords.length) return 0;
        return next;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [isInView, isPaused, duration, allWords.length]);

  const isFinal = finalWord && index === allWords.length - 1;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center select-none cursor-default"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main text */}
      <div className="relative overflow-hidden py-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              "inline-block font-bold",
              className,
              isFinal && "text-coral"
            )}
          >
            {allWords[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
