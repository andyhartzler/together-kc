'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsUnlocked(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 600);
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg shadow-navy/5 p-8 border border-gray-100">
          <div className="text-center mb-6 h-16 flex items-center justify-center">
            <div className="relative">
              {/* Success burst effect */}
              <AnimatePresence>
                {isUnlocked && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-500/30" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-green-500" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Padlock */}
              <motion.div
                animate={isUnlocked ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                } : {}}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <svg
                  className={`w-12 h-12 transition-colors duration-300 ${isUnlocked ? 'text-green-500' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  {/* Lock body */}
                  <motion.rect
                    x="4.5"
                    y="10.5"
                    width="15"
                    height="11.25"
                    rx="2.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Shackle - animates open */}
                  <motion.path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ d: "M7.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75" }}
                    animate={isUnlocked ? {
                      d: "M7.5 10.5V6.75a4.5 4.5 0 1 1 9 0v-1.5",
                      x: 2,
                      rotate: -30,
                      originX: "16.5px",
                      originY: "6.75px",
                    } : {
                      d: "M7.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75"
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors text-navy placeholder:text-gray-400`}
            />

            {error && (
              <p className="text-red-500 text-sm text-center">Incorrect password</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 bg-coral text-white font-semibold rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking...' : 'Enter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
