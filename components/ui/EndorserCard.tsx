'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface EndorserCardProps {
  name: string;
  fullName?: string;
  logo: string;
  website?: string | null;
  index?: number;
}

export function EndorserCard({ name, fullName, logo, website, index = 0 }: EndorserCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Prevent body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const handleClick = () => {
    setIsExpanded(true);
    // Delay flip to allow expand animation
    setTimeout(() => setIsFlipped(true), 300);
  };

  const handleClose = () => {
    setIsFlipped(false);
    // Delay collapse to allow flip back
    setTimeout(() => setIsExpanded(false), 300);
  };

  const displayFullName = fullName || name;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative cursor-pointer"
    >
      <motion.div
        animate={{
          y: isHovered ? -6 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative bg-navy rounded-2xl overflow-hidden aspect-[4/3] shadow-lg"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px rgba(30, 58, 95, 0.3), 0 10px 20px rgba(30, 58, 95, 0.2)'
            : '0 4px 12px rgba(30, 58, 95, 0.15)',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/40" />

        {/* Subtle animated glow on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-sky/10"
        />

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-full h-full">
            <Image
              src={logo}
              alt={name}
              fill
              className="object-contain drop-shadow-lg"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>

        {/* Organization name that slides up on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/95 to-transparent pt-12 pb-4 px-4"
            >
              <p className="text-white text-sm font-semibold text-center leading-tight">
                {name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner accent */}
        <motion.div
          animate={{
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-8 -right-8 w-24 h-24 bg-coral rounded-full blur-2xl"
        />

        {/* Click hint icon */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const expandedOverlay = (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
          />

          {/* Card container with perspective for 3D flip */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md"
            style={{ perspective: '1000px' }}
          >
            {/* Flippable card */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full aspect-[4/3]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0 bg-navy rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/40" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full">
                    <Image
                      src={logo}
                      alt={name}
                      fill
                      className="object-contain drop-shadow-lg"
                      sizes="400px"
                    />
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-coral rounded-full blur-2xl opacity-40" />
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-sky/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-coral rounded-full blur-3xl opacity-20" />
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-sky rounded-full blur-3xl opacity-20" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
                    {displayFullName}
                  </h3>

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-coral hover:bg-coral/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {!website && (
                    <p className="text-white/60 text-sm">
                      Proudly supporting the KC Earnings Tax renewal
                    </p>
                  )}
                </div>

                {/* Close hint */}
                <p className="absolute bottom-4 text-white/40 text-xs">
                  Click anywhere to close
                </p>
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {cardContent}
      {mounted && createPortal(expandedOverlay, document.body)}
    </>
  );
}
