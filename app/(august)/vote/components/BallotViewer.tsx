'use client';

import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  subtitle?: string;
}

export default function BallotViewer({ isOpen, onClose, pdfUrl, title, subtitle }: Props) {
  if (!isOpen) return null;

  // Sample-ballot links now point to the Kansas City Election Board sample-ballot
  // tool (an HTML page), not a downloadable PDF, so only embed real PDFs and send
  // everyone else out to KCEB rather than rendering a blank PDF embed.
  const isPdf = /\.pdf($|\?|#)/i.test(pdfUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-navy border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-base">{title}</h3>
            {subtitle && <p className="text-white/50 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {/* Open / download button: download for real PDFs, open in a new tab for the KCEB tool */}
            {isPdf ? (
              <a
                href={pdfUrl}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            ) : (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open
              </a>
            )}
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF container for real PDFs; KCEB sample-ballot tool opens in a new tab */}
        <div className="flex-1 bg-white overflow-auto min-h-[60vh]">
          {isPdf ? (
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full min-h-[60vh]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center px-6 py-16 min-h-[60vh]">
              <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-navy font-bold text-lg">View your official sample ballot</h4>
              <p className="text-gray-600 text-sm mt-2 max-w-sm leading-relaxed">
                The Kansas City Election Board hosts the authenticated sample ballot for the August 4, 2026 election. Open it to see every question exactly as it appears on your ballot.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral text-white font-semibold px-6 py-3 text-sm shadow-lg shadow-coral/20 transition-transform hover:-translate-y-0.5"
              >
                Open sample ballot at KCEB
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
