'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const documents = [
  {
    title: 'E-Tax FAQ',
    description: 'Frequently asked questions about the Kansas City earnings tax renewal.',
    filename: 'KC-E-Tax-FAQ.pdf',
    icon: '📋',
    category: 'Documents',
  },
  {
    title: 'E-Tax One Pager',
    description: 'Key facts and talking points in a single-page format.',
    filename: 'KC-E-Tax-One-Pager.pdf',
    icon: '📄',
    category: 'Documents',
  },
];

const images = [
  {
    title: 'Mayor Quinton Lucas',
    description: 'Official photo of Mayor Quinton Lucas for media use.',
    filename: 'mayor-quinton-lucas.jpg',
    preview: '/press-kit/mayor-quinton-lucas.jpg',
    category: 'Photos',
  },
];

const logos = [
  {
    title: 'Together KC Logo',
    description: 'High-resolution logo for print materials.',
    filename: 'together-kc-logo-print.jpg',
    icon: '🏛️',
    category: 'Logos',
  },
  {
    title: 'E-Tax Renewal Logo',
    description: 'Campaign logo for print materials.',
    filename: 'e-tax-renewal-logo-print.jpg',
    icon: '✅',
    category: 'Logos',
  },
];

function PreviewModal({
  isOpen,
  onClose,
  title,
  filename,
  type
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filename: string;
  type: 'pdf' | 'image';
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-3">
              <a
                href={`/press-kit/${filename}`}
                download={filename}
                className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg hover:bg-coral/90 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[70vh] overflow-auto bg-gray-100">
            {type === 'pdf' ? (
              <object
                data={`/press-kit/${filename}`}
                type="application/pdf"
                className="w-full h-full"
              >
                {/* Fallback for browsers that can't display PDF */}
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mb-4">PDF preview not available in your browser</p>
                  <a
                    href={`/press-kit/${filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky text-white rounded-lg hover:bg-sky/90 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in New Tab
                  </a>
                </div>
              </object>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <Image
                  src={`/press-kit/${filename}`}
                  alt={title}
                  width={800}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DownloadCard({
  title,
  description,
  filename,
  icon,
  preview,
  tall,
  onPreview
}: {
  title: string;
  description: string;
  filename: string;
  icon?: string;
  preview?: string;
  tall?: boolean;
  onPreview: () => void;
}) {
  const isPdf = filename.endsWith('.pdf');
  const isImage = filename.endsWith('.jpg') || filename.endsWith('.png');
  const canPreview = isPdf || isImage;

  return (
    <motion.div
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${tall ? 'h-full' : ''}`}
      whileHover={{ y: -4 }}
    >
      {preview ? (
        <div className={`relative w-full overflow-hidden bg-gray-100 ${tall ? 'flex-1 min-h-48' : 'h-48'}`}>
          <Image
            src={preview}
            alt={title}
            fill
            className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative h-32 w-full flex items-center justify-center bg-gradient-to-br from-sky/10 to-coral/10">
          <span className="text-5xl">{icon}</span>
        </div>
      )}

      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-coral transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm flex-grow">{description}</p>

        <div className="flex items-center gap-3 mt-4">
          {canPreview && (
            <button
              onClick={onPreview}
              className="flex items-center gap-2 text-sky font-medium text-sm hover:text-sky/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </button>
          )}
          <a
            href={`/press-kit/${filename}`}
            download={filename}
            className="flex items-center gap-2 text-coral font-medium text-sm hover:text-coral/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function PressKitPage() {
  const [previewItem, setPreviewItem] = useState<{ title: string; filename: string; type: 'pdf' | 'image' } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Preview Modal */}
      {previewItem && (
        <PreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
          filename={previewItem.filename}
          type={previewItem.type}
        />
      )}

      {/* Hero Section */}
      <header className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky/30 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-coral/20 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Media Resources</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Press Kit
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Official media resources for the Together KC E-Tax Renewal Campaign.
              Download logos, photos, and key documents for press coverage.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Quick Facts Bar */}
      <section className="relative -mt-8 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {/* Desktop: 5 columns */}
          <div className="hidden md:grid md:grid-cols-5 gap-3">
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-coral mb-1">$373.7M</div>
              <div className="text-gray-500 text-sm">Annual Revenue</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-coral mb-1">47%</div>
              <div className="text-gray-500 text-sm">General Fund</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-coral mb-1">1963</div>
              <div className="text-gray-500 text-sm">In Place Since</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-coral mb-1">77%</div>
              <div className="text-gray-500 text-sm">2021 Approval</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-xl font-bold text-coral mb-1">April 7, 2026</div>
              <div className="text-gray-500 text-sm">Election Date</div>
            </motion.div>
          </div>

          {/* Mobile: 2 columns top row, then full-width election date */}
          <div className="md:hidden space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-coral mb-1">$373.7M</div>
                <div className="text-gray-500 text-sm">Annual Revenue</div>
              </motion.div>
              <motion.div
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-coral mb-1">47%</div>
                <div className="text-gray-500 text-sm">General Fund</div>
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-coral mb-1">1963</div>
                <div className="text-gray-500 text-sm">In Place Since</div>
              </motion.div>
              <motion.div
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-coral mb-1">77%</div>
                <div className="text-gray-500 text-sm">2021 Approval</div>
              </motion.div>
            </div>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-2xl font-bold text-coral mb-1">April 7, 2026</div>
              <div className="text-gray-500 text-lg">Election Date</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Downloads Grid - Desktop: 3 cols with Mayor spanning 2 rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Documents - first two columns */}
          {documents.map((doc, index) => (
            <motion.div
              key={doc.filename}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <DownloadCard
                title={doc.title}
                description={doc.description}
                filename={doc.filename}
                icon={doc.icon}
                onPreview={() => setPreviewItem({ title: doc.title, filename: doc.filename, type: 'pdf' })}
              />
            </motion.div>
          ))}

          {/* Mayor Photo - spans 2 rows on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:row-span-2"
          >
            <DownloadCard
              title={images[0].title}
              description={images[0].description}
              filename={images[0].filename}
              preview={images[0].preview}
              tall
              onPreview={() => setPreviewItem({ title: images[0].title, filename: images[0].filename, type: 'image' })}
            />
          </motion.div>

          {/* Logos - bottom row */}
          {logos.map((logo, index) => (
            <motion.div
              key={logo.filename}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            >
              <DownloadCard
                title={logo.title}
                description={logo.description}
                filename={logo.filename}
                icon={logo.icon}
                onPreview={() => setPreviewItem({ title: logo.title, filename: logo.filename, type: 'image' })}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Key Messages Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Key Messages
          </h2>

          <div className="bg-gradient-to-br from-navy to-navy/90 rounded-2xl p-6 md:p-10 text-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-coral font-semibold text-lg mb-4">Core Message</h3>
                <p className="text-white/90 leading-relaxed">
                  The earnings tax funds nearly half the cost of city services: first responders,
                  street repair, trash pickup, and more. Without it, we face devastating cuts,
                  including first responder layoffs and longer emergency response times.
                  <strong className="text-white"> Vote YES to renew the E-Tax on or before April 7, 2026.</strong>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-coral font-semibold text-lg mb-4">Key Points</h3>
                <ul className="space-y-3">
                  {[
                    'This is a RENEWAL, not a tax increase. No one\'s taxes will go up.',
                    'Nearly half of police and fire funding comes from E-Tax revenue.',
                    'A portion of E-Tax revenue is legally mandated for street repairs.',
                    'The E-Tax has been in place since 1963, renewed successfully every five years.',
                    'There is no realistic replacement for this revenue source.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white/90 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Media Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Media Contact
          </h2>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 max-w-md"
            whileHover={{ y: -2 }}
          >
            <h4 className="font-semibold text-gray-900 text-lg">Tammy Edwards</h4>
            <p className="text-coral text-sm font-medium mb-3">Campaign Manager</p>
            <div className="space-y-2">
              <a href="mailto:action@together-kc.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-coral transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                action@together-kc.com
              </a>
              <a href="tel:913-269-5075" className="flex items-center gap-2 text-sm text-gray-600 hover:text-coral transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (913) 269-5075
              </a>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="https://together-kc.com"
            className="inline-flex items-center gap-2 text-coral hover:text-coral/80 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Together KC
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Paid for by Together KC, Dan Kopp, Treasurer.<br />
            Not authorized by any candidate or candidate committee.
          </p>
        </div>
      </footer>
    </div>
  );
}
