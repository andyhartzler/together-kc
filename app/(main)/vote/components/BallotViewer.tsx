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
            {/* Download button */}
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

        {/* PDF container - white background for the document */}
        <div className="flex-1 bg-white overflow-auto min-h-[60vh]">
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="w-full h-full min-h-[60vh]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
