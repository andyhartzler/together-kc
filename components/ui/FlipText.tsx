"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipText({
  words,
  duration = 2000,
  className,
}: FlipTextProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only start when 80% in view
  const isInView = useInView(containerRef, { once: true, amount: 0.8 });

  // Continuous loop - never stops
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [isInView, duration, words.length]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center select-none"
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
              className
            )}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
