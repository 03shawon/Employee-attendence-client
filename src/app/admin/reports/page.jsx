'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    const email = prompt('Enter GM Email Address:', 'gm@company.com');
    if (!email) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/attendance/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reportType, date: selectedDate }),
      });
      const data = await res.json();
      setMessage(data.message || 'Report sent successfully to GM!');
    } catch (err) {
      setMessage('Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Attendance Reports</h2>
        <p className="text-sm text-zinc-400 mt-1">Generate daily or monthly attendance summaries for management.</p>
      </div>

      <div className="bg-[#121215] border border-[#1e1e22] p-6 rounded-2xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-lg border border-[#27272a] focus:outline-none"
            >
              <option value="daily">Daily Attendance Report</option>
              <option value="monthly">Monthly Attendance Summary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              {reportType === 'daily' ? 'Select Date' : 'Select Month'}
            </label>
            <input
              type={reportType === 'daily' ? 'date' : 'month'}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-lg border border-[#27272a] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSendEmail}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : '📧 Send Report to GM Email'}
          </button>
        </div>

        {message && (
          <p className="text-sm font-medium text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}