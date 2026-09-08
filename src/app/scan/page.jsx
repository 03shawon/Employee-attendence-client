'use client';

import { useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/api';

export default function ScanPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState('in');
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !pin) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/attendance/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, pin, type }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ success: true, text: data.message });
        setEmployeeId('');
        setPin('');
      } else {
        setStatusMsg({ success: false, text: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setStatusMsg({ success: false, text: 'Server connection failed' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-[#121215] border border-[#1e1e22] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Office Attendance</h1>
          <p className="text-xs text-zinc-400">Mark your daily check-in or check-out</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#1a1a1e] p-1.5 rounded-xl border border-[#27272a]">
          <button
            type="button"
            onClick={() => setType('in')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'in' ? 'bg-emerald-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Check In
          </button>
          <button
            type="button"
            onClick={() => setType('out')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              type === 'out' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Check Out
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium text-center border ${
              statusMsg.success
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Employee ID</label>
            <input
              type="text"
              placeholder="e.g. EMP001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-[#1a1a1e] text-center text-lg tracking-widest text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
              type === 'in' ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-amber-500 hover:bg-amber-400 text-black'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : `Confirm Check ${type === 'in' ? 'In' : 'Out'}`}
          </button>
        </form>

        {/* Admin Login Button */}
        <div className="pt-4 border-t border-[#1e1e22] text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1e] hover:bg-[#222226] border border-[#27272a] hover:border-zinc-500 text-xs font-medium text-zinc-300 hover:text-white transition-all w-full"
          >
            🔑 Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}