'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';

const ONE_PAGER_PDF = '/press-kit/August-One-Pager.pdf';
const ONE_PAGER_FILENAME = 'Together-KC-August-One-Pager.pdf';
// The one-pager is displayed as a pre-rendered image rather than an embedded
// PDF: iOS Safari cannot scroll or zoom PDFs inside <object>/<iframe>, and an
// image keeps the in-page viewer working identically on every device.
const ONE_PAGER_IMAGE = '/press-kit/august-one-pager-preview.png';

function OnePagerModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Dialog a11y: close on Escape, lock body scroll, move focus into the dialog
  // on open and restore it to the trigger on close.
  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="August one-pager"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 p-3 sm:p-4">
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close one-pager"
            className="p-2 rounded-full hover:bg-light-gray transition-colors text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="flex-1 font-bold text-navy">The August one-pager</h3>
          <a
            href={ONE_PAGER_PDF}
            download={ONE_PAGER_FILENAME}
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
        <div className="flex-1 overflow-auto bg-light-gray">
          <Image
            src={ONE_PAGER_IMAGE}
            alt="Together KC August one-pager: what each of the five ballot questions does and why it matters"
            width={1600}
            height={2071}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function OnePagerButton({
  variant = 'outline',
  size = 'lg',
}: {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'lg';
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <InteractiveHoverButton text="View the one-pager" onClick={() => setOpen(true)} variant={variant} size={size} />
      {/* Portal to <body>: the hero's transformed/stacked containers would
          otherwise trap the fixed overlay below the fixed site header. */}
      {mounted &&
        createPortal(
          <AnimatePresence>{open && <OnePagerModal key="one-pager" onClose={close} />}</AnimatePresence>,
          document.body
        )}
    </>
  );
}
