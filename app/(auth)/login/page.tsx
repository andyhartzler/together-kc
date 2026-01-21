'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { CoinTrail } from '@/components/ui/CoinTrail';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      router.push('/');
      router.refresh();
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Coin trail background */}
      <CoinTrail pixelSize={60} fadeDuration={1200} />

      <div className="w-full max-w-xs relative z-10">
        <BackgroundGradient className="rounded-3xl p-8 bg-white">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                autoFocus
                autoComplete="one-time-code"
                data-lpignore="true"
                data-form-type="other"
                className={`w-full px-4 py-3 rounded-xl border ${
                  error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all text-slate-800 placeholder:text-slate-400`}
              />

              {error && (
                <p className="text-red-500 text-xs text-center">Incorrect password</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Enter'}
              </button>
            </div>
          </form>
        </BackgroundGradient>
      </div>
    </div>
  );
}
