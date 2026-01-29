'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Generate bar positions every 25px - extended to 1175px to cover full container + extra
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

export default function DonatePage() {
  // State for left and right bar widths at each position
  const [leftBars, setLeftBars] = useState<Record<number, number>>(
    Object.fromEntries(BAR_POSITIONS.map(pos => [pos, 24])) // default w-6 = 24px
  );
  const [rightBars, setRightBars] = useState<Record<number, number>>(
    Object.fromEntries(BAR_POSITIONS.map(pos => [pos, 24])) // default w-6 = 24px
  );
  const [showConfig, setShowConfig] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Prevent iframe from stealing scroll position when it auto-focuses
  useEffect(() => {
    window.scrollTo(0, 0);
    const timeouts = [100, 300, 500, 1000].map(delay =>
      setTimeout(() => window.scrollTo(0, 0), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const adjustBar = (side: 'left' | 'right', position: number, delta: number) => {
    if (side === 'left') {
      setLeftBars(prev => ({
        ...prev,
        [position]: Math.max(0, Math.min(100, (prev[position] || 24) + delta))
      }));
    } else {
      setRightBars(prev => ({
        ...prev,
        [position]: Math.max(0, Math.min(100, (prev[position] || 24) + delta))
      }));
    }
  };

  return (
    <>
      {/* Hero Section - pure white to match iframe */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy">
              Support
              <br />
              <span className="gradient-text">Together KC</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section - white background to match iframe */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Iframe container - fixed height for tallest scenario */}
          <div
            className="relative overflow-hidden"
            style={{ height: 1100 }}
          >
            <iframe
              src="https://secure.numero.ai/contribute/Together-KC"
              title="Donate to Together KC"
              className="w-full absolute left-0"
              tabIndex={-1}
              style={{
                height: '2100px',
                top: -115,
                border: 'none',
              }}
              allow="payment"
            />

            {/* Render adjustable white bars on LEFT side */}
            {BAR_POSITIONS.map(pos => (
              <div
                key={`left-${pos}`}
                className="absolute left-0 bg-white z-10"
                style={{
                  top: pos,
                  height: 25,
                  width: leftBars[pos] || 24,
                }}
              />
            ))}

            {/* Render adjustable white bars on RIGHT side */}
            {BAR_POSITIONS.map(pos => (
              <div
                key={`right-${pos}`}
                className="absolute right-0 bg-white z-10"
                style={{
                  top: pos,
                  height: 25,
                  width: rightBars[pos] || 24,
                }}
              />
            ))}

            {/* Control panel toggle */}
            {showControls && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white p-4 rounded-lg max-h-96 overflow-y-auto" style={{ width: 340 }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Bar Width Editor (TEMP)</span>
                  <button onClick={() => setShowControls(false)} className="text-xs bg-red-500 px-2 py-1 rounded">Hide</button>
                </div>

                <div className="text-xs mb-2 text-gray-300">Scroll to see all positions. +/- adjusts width by 4px.</div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="font-bold mb-1 text-blue-300">LEFT SIDE</div>
                    {BAR_POSITIONS.map(pos => (
                      <div key={`ctrl-left-${pos}`} className="flex items-center justify-between py-0.5">
                        <span className="text-gray-400">{pos}:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustBar('left', pos, -4)}
                            className="bg-gray-700 hover:bg-gray-600 px-2 rounded"
                          >-</button>
                          <span className="w-10 text-center font-mono">{leftBars[pos]}</span>
                          <button
                            onClick={() => adjustBar('left', pos, 4)}
                            className="bg-gray-700 hover:bg-gray-600 px-2 rounded"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-green-300">RIGHT SIDE</div>
                    {BAR_POSITIONS.map(pos => (
                      <div key={`ctrl-right-${pos}`} className="flex items-center justify-between py-0.5">
                        <span className="text-gray-400">{pos}:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustBar('right', pos, -4)}
                            className="bg-gray-700 hover:bg-gray-600 px-2 rounded"
                          >-</button>
                          <span className="w-10 text-center font-mono">{rightBars[pos]}</span>
                          <button
                            onClick={() => adjustBar('right', pos, 4)}
                            className="bg-gray-700 hover:bg-gray-600 px-2 rounded"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowConfig(true)}
                  className="mt-3 w-full bg-green-600 hover:bg-green-500 py-2 rounded font-bold"
                >
                  💾 SAVE / SHOW CONFIG
                </button>
              </div>
            )}

            {!showControls && (
              <button
                onClick={() => setShowControls(true)}
                className="absolute top-2 right-8 z-50 bg-black/80 text-white px-3 py-1 rounded text-sm"
              >
                Show Editor
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">📋 Current Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">Share this with Claude to make the changes permanent:</p>

            <div className="bg-gray-100 p-4 rounded font-mono text-xs overflow-auto">
              <div className="font-bold mb-2 text-blue-600">LEFT BARS (changed from default 24px):</div>
              {Object.entries(leftBars)
                .filter(([_, width]) => width !== 24)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([pos, width]) => (
                  <div key={`config-left-${pos}`}>Position {pos}px → Width: {width}px</div>
                ))}
              {Object.entries(leftBars).filter(([_, width]) => width !== 24).length === 0 && (
                <div className="text-gray-500 italic">All at default (24px)</div>
              )}

              <div className="font-bold mt-4 mb-2 text-green-600">RIGHT BARS (changed from default 24px):</div>
              {Object.entries(rightBars)
                .filter(([_, width]) => width !== 24)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([pos, width]) => (
                  <div key={`config-right-${pos}`}>Position {pos}px → Width: {width}px</div>
                ))}
              {Object.entries(rightBars).filter(([_, width]) => width !== 24).length === 0 && (
                <div className="text-gray-500 italic">All at default (24px)</div>
              )}

              <div className="font-bold mt-4 mb-2 border-t pt-4">JSON (for Claude):</div>
              <pre className="whitespace-pre-wrap break-all bg-gray-200 p-2 rounded">
{JSON.stringify({
  left: Object.fromEntries(
    Object.entries(leftBars)
      .filter(([_, w]) => w !== 24)
      .sort(([a], [b]) => Number(a) - Number(b))
  ),
  right: Object.fromEntries(
    Object.entries(rightBars)
      .filter(([_, w]) => w !== 24)
      .sort(([a], [b]) => Number(a) - Number(b))
  )
}, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => setShowConfig(false)}
              className="mt-4 bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CTA Section - matching FAQ page */}
      <section className="section-padding bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Other Ways to Help
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Can&apos;t donate right now? There are many other ways to support the campaign.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href="/endorsements#endorse">
                Add Your Endorsement
              </Button>
              <Button
                variant="outline"
                href="mailto:action@together-kc.com?subject=Volunteer for Together KC"
                className="border-white text-white hover:bg-white hover:text-navy"
              >
                Volunteer With Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
