'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg shadow-navy/5 p-8 border border-gray-100">
          <div className="text-center mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L9.5 9H7l-4 12h18l-4-12h-2.5L12 2zm0 3.24L13.58 9h-3.16L12 5.24zM7.92 11h8.16l3 9H4.92l3-9z" />
            </svg>
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
