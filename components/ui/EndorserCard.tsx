'use client';

import { useState, useEffect, useRef } from 'react';
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

// Global styles for the glow effect (injected once)
const glowStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }

  @media (max-width: 768px) {
    [data-glow]::before,
    [data-glow]::after,
    [data-glow] [data-glow] {
      display: none;
    }
  }
`;

// Track if styles have been injected
let stylesInjected = false;

export function EndorserCard({ name, fullName, logo, website, index = 0 }: EndorserCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Inject glow styles once
    if (!stylesInjected && typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = glowStyles;
      document.head.appendChild(styleElement);
      stylesInjected = true;
    }
  }, []);

  // Track pointer position for glow effect
  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
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

  // Glow effect CSS variables
  const glowVars = {
    '--base': '210', // Blue hue
    '--spread': '60',
    '--radius': '16',
    '--border': '2',
    '--backdrop': 'transparent',
    '--backup-border': 'transparent',
    '--size': '250',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--saturation': '100',
    '--lightness': '60',
    '--border-spot-opacity': '0.8',
    '--border-light-opacity': '0.4',
    '--bg-spot-opacity': '0.1',
  } as React.CSSProperties;

  const cardContent = (
    <motion.div
      ref={cardRef}
      data-glow
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative cursor-pointer"
      style={{
        ...glowVars,
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
        )`,
        backgroundAttachment: 'fixed',
        touchAction: 'none',
      }}
    >
      {/* Inner glow element */}
      <div data-glow className="hidden md:block" />

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

        {/* Corner accent */}
        <motion.div
          animate={{
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-8 -right-8 w-24 h-24 bg-coral rounded-full blur-2xl"
        />

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
                  <h3
                    className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight transition-all duration-500 ease-out"
                    style={{
                      transform: isFlipped ? 'translateY(0)' : 'translateY(-20px)',
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: '200ms',
                    }}
                  >
                    {displayFullName}
                  </h3>

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-coral hover:bg-coral/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 ease-out"
                      style={{
                        transform: isFlipped ? 'translateY(0)' : 'translateY(-15px)',
                        opacity: isFlipped ? 1 : 0,
                        transitionDelay: '350ms',
                      }}
                    >
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {!website && (
                    <p
                      className="text-white/60 text-sm transition-all duration-500 ease-out"
                      style={{
                        transform: isFlipped ? 'translateY(0)' : 'translateY(-15px)',
                        opacity: isFlipped ? 1 : 0,
                        transitionDelay: '350ms',
                      }}
                    >
                      Proudly supporting the KC Earnings Tax renewal
                    </p>
                  )}
                </div>

                {/* Close hint */}
                <p
                  className="absolute bottom-4 text-white/40 text-xs transition-all duration-500 ease-out"
                  style={{
                    transform: isFlipped ? 'translateY(0)' : 'translateY(10px)',
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: '500ms',
                  }}
                >
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
