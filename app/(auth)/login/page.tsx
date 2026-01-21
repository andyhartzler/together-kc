'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { CoinTrail } from '@/components/ui/CoinTrail';
import { Button } from '@/components/ui/3d-button';

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
      <CoinTrail pixelSize={70} fadeDuration={1400} />

      <div className="w-full max-w-xs relative z-10">
        <BackgroundGradient className="rounded-3xl p-6 bg-[#23374D] border-4 border-[#1a2736] border-b-[6px]">
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Retro coin-style padlock */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-[#FDBE19] rounded-full flex items-center justify-center border-4 border-[#c4960e] border-b-[5px] shadow-lg">
                <svg
                  className="w-8 h-8 text-[#23374D]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              {/* Retro 3D input field */}
              <div className="relative">
                <input
                  type="text"
                  name="access_code"
                  id="access_code"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  data-bwignore="true"
                  className={`w-full px-4 py-3 rounded-xl border-2 border-b-4 font-medium transition-all text-center tracking-widest ${
                    error
                      ? 'border-red-400 border-b-red-500 bg-red-50 text-red-800'
                      : 'border-[#1a2736] border-b-[#0f1a24] bg-[#2D445D] text-white'
                  } focus:outline-none focus:ring-2 focus:ring-[#FDBE19]/50`}
                  style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                />
              </div>

              {error && (
                <p className="text-[#FDBE19] text-sm text-center font-medium">Wrong password!</p>
              )}

              {/* 3D Button with glow */}
              <div className="relative pt-1">
                <div
                  className={`absolute inset-x-2 inset-y-1 rounded-xl bg-[#FDBE19] blur-md transition-opacity duration-500 ${
                    password ? 'opacity-40' : 'opacity-0'
                  }`}
                />
                <Button
                  type="submit"
                  disabled={!password}
                  isLoading={isLoading}
                  size="full"
                  variant={password ? 'default' : 'dark'}
                  className="relative"
                >
                  Enter
                </Button>
              </div>
            </div>
          </form>
        </BackgroundGradient>
      </div>
    </div>
  );
}
