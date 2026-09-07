'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Mock Credential Validation
      if (email === 'admin@company.com' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin');
      } else {
        setError('Invalid email address or password.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-sm bg-[#121215] border border-[#1e1e22] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Login</h1>
          <p className="text-xs text-zinc-400">Access the attendance management panel</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500 placeholder-zinc-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm py-3 rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a href="/scan" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Go back to Employee Scan Page
          </a>
        </div>
      </div>
    </div>
  );
}