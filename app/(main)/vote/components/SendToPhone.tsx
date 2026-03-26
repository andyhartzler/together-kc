'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  address: string;
  locationName: string;
}

export default function SendToPhone({ address, locationName }: Props) {
  const [showChoice, setShowChoice] = useState(false);
  const [mapType, setMapType] = useState<'apple' | 'google' | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const encoded = encodeURIComponent(address);
  const appleUrl = `https://maps.apple.com/?daddr=${encoded}`;
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  const qrUrl = mapType === 'apple' ? appleUrl : googleUrl;

  // Generate styled QR code when mapType is selected
  useEffect(() => {
    if (!mapType || !qrRef.current) return;

    // Dynamic import to avoid SSR issues
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (!qrRef.current) return;
      qrRef.current.innerHTML = '';

      const qr = new QRCodeStyling({
        width: 280,
        height: 280,
        type: 'svg',
        data: qrUrl,
        dotsOptions: {
          color: '#1e3a5f',
          type: 'dots',
        },
        cornersSquareOptions: {
          color: '#1e3a5f',
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: '#e53935',
          type: 'dot',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        qrOptions: {
          errorCorrectionLevel: 'M',
        },
      });

      qr.append(qrRef.current);
    });
  }, [mapType, qrUrl]);

  const handleClose = () => {
    setMapType(null);
    setShowChoice(false);
  };

  return (
    <div className="hidden md:block">
      <button
        onClick={(e) => { e.stopPropagation(); setShowChoice(!showChoice); setMapType(null); }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-white/50 text-xs font-medium hover:bg-white/10 hover:text-white/70 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Send Directions to Phone
      </button>

      <AnimatePresence>
        {showChoice && !mapType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setMapType('apple')}
                className="flex-1 flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Image src="/images/apple-maps-icon.png" alt="Apple Maps" width={28} height={28} className="w-7 h-7 rounded-md" priority />
                <span className="text-white/70 text-sm font-medium">Apple Maps</span>
              </button>
              <button
                onClick={() => setMapType('google')}
                className="flex-1 flex items-center justify-center gap-3 px-3 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Image src="/images/google-maps-icon.png" alt="Google Maps" width={28} height={28} className="w-7 h-7 rounded-md" priority />
                <span className="text-white/70 text-sm font-medium">Google Maps</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {mapType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2.5 mb-3">
                  <Image
                    src={mapType === 'apple' ? '/images/apple-maps-icon.png' : '/images/google-maps-icon.png'}
                    alt={mapType === 'apple' ? 'Apple Maps' : 'Google Maps'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg"
                  />
                  <h3 className="text-gray-900 font-bold text-lg">
                    {mapType === 'apple' ? 'Apple Maps' : 'Google Maps'}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm mb-1">
                  Scan to get directions to
                </p>
                <p className="text-gray-800 font-semibold text-sm mb-5">{locationName}</p>

                {/* Styled QR Code */}
                <div className="flex justify-center">
                  <div ref={qrRef} className="inline-block rounded-2xl overflow-hidden" />
                </div>

                <p className="text-gray-400 text-xs mt-5">
                  Point your phone camera at the QR code
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
