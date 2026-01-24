'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';
import { FAQS, VOTE_DATE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function FAQsPage() {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'downloaded'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = useCallback(() => {
    if (downloadStatus !== 'idle') return;

    setDownloadStatus('downloading');
    setProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating progress for snappy feel
        const increment = Math.max(5, Math.floor((100 - prev) / 5));
        return Math.min(prev + increment, 100);
      });
    }, 80);

    // After progress completes, trigger actual download
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setDownloadStatus('downloaded');

      // Trigger the actual file download
      const link = document.createElement('a');
      link.href = '/ETax FAQ.pdf';
      link.download = 'ETax FAQ.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset after a moment
      setTimeout(() => {
        setDownloadStatus('idle');
        setProgress(0);
      }, 2000);
    }, 800);
  }, [downloadStatus]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-light-gray overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-sky/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-golden/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy mb-6">
              Frequently Asked
              <br />
              <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about the Kansas City earnings tax renewal on {VOTE_DATE}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={FAQS} />

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-navy/5 border border-gray-100">
              <h3 className="text-xl font-semibold text-navy mb-4">
                Want to share these FAQs?
              </h3>
              <p className="text-gray-600 mb-6">
                Download a printable version to share with friends, neighbors, and colleagues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Animated Download Button */}
                <motion.button
                  onClick={handleDownload}
                  whileHover={downloadStatus === 'idle' ? { scale: 1.05 } : {}}
                  whileTap={downloadStatus === 'idle' ? { scale: 0.95 } : {}}
                  className={cn(
                    "relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-full px-6 py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 min-w-[180px]",
                    downloadStatus === 'idle' && "bg-coral text-white hover:bg-coral/90 shadow-lg shadow-coral/25 cursor-pointer",
                    downloadStatus === 'downloading' && "bg-coral/70 text-white cursor-default",
                    downloadStatus === 'downloaded' && "bg-green-500 text-white cursor-default"
                  )}
                  disabled={downloadStatus !== 'idle'}
                >
                  {/* Progress bar background */}
                  {downloadStatus === 'downloading' && (
                    <motion.div
                      className="absolute inset-0 bg-coral"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                    />
                  )}

                  {/* Button content */}
                  <span className="relative z-10 flex items-center">
                    {downloadStatus === 'idle' && (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download PDF
                      </>
                    )}
                    {downloadStatus === 'downloading' && (
                      <>
                        <svg
                          className="w-5 h-5 mr-2 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {progress}%
                      </>
                    )}
                    {downloadStatus === 'downloaded' && (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Downloaded!
                      </>
                    )}
                  </span>
                </motion.button>
                <Button variant="outline" href="/">
                  Back to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              We&#39;re here to help. Reach out to learn more about how you can support the renewal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href="mailto:action@together-kc.com">
                Contact Us
              </Button>
              <Button
                variant="outline"
                href="/endorsements#endorse"
                className="border-white text-white hover:bg-white hover:text-navy"
              >
                Add Your Endorsement
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
