'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PopoverFormProps {
  onVoteYes: () => void;
  onEndorse: () => void;
  className?: string;
}

export function PopoverForm({ onVoteYes, onEndorse, className }: PopoverFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Initial collapsed state - single Vote YES button
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-8 py-4 text-lg text-white font-semibold bg-coral rounded-full transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px hover:scale-105 shadow-lg"
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
          </motion.button>
        ) : (
          // Expanded state - two stacked buttons
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-3"
          >
            {/* Vote YES Option */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              onClick={() => {
                setIsExpanded(false);
                onVoteYes();
              }}
              className="group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-white/10 px-8 py-4 text-lg text-white font-semibold bg-coral rounded-full transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px hover:scale-105 shadow-lg"
              style={{ '--speed': '3s', '--spread': '90deg', '--shimmer-color': '#ffffff' } as React.CSSProperties}
            >
              {/* Shimmer spark container */}
              <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
                <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                  <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
                </div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vote YES
              {/* Highlight */}
              <div className="insert-0 absolute size-full rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
              {/* Backdrop */}
              <div className="absolute -z-20 bg-coral rounded-full inset-[0.05em]" />
            </motion.button>

            {/* Add Endorsement Option */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                setIsExpanded(false);
                onEndorse();
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg text-white font-semibold bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Add Endorsement
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
