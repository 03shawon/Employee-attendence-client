'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    officeStartTime: '09:00',
    lateCutoffTime: '09:15',
    officeEndTime: '17:00',
    autoCheckoutTime: '23:59',
    weeklyOff: ['Friday', 'Saturday'],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Fetch Existing Settings from Backend
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data) setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeeklyOffToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.weeklyOff.includes(day);
      return {
        ...prev,
        weeklyOff: exists
          ? prev.weeklyOff.filter((d) => d !== day)
          : [...prev.weeklyOff, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatusMsg({ success: true, text: 'Settings updated successfully!' });
      } else {
        setStatusMsg({ success: false, text: 'Failed to update settings.' });
      }
    } catch (error) {
      setStatusMsg({ success: false, text: 'Server connection error.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) {
    return (
      <div className="p-6 text-zinc-400 text-xs flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6 bg-[#09090b] text-zinc-100 min-h-screen antialiased">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-xs text-zinc-400">Configure attendance rules and operational hours</p>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-medium border ${
            statusMsg.success
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Time Rules Section */}
        <div className="bg-[#121215] border border-[#1e1e22] rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white pb-2 border-b border-[#1e1e22]">
            ⏱️ Shift & Attendance Time Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Official Office Start Time
              </label>
              <input
                type="time"
                name="officeStartTime"
                value={formData.officeStartTime}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Late Check-In Cutoff Time
              </label>
              <input
                type="time"
                name="lateCutoffTime"
                value={formData.lateCutoffTime}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
                required
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Check-ins after this time will be marked as <span className="text-amber-400">Late</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Official Office End Time
              </label>
              <input
                type="time"
                name="officeEndTime"
                value={formData.officeEndTime}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Auto Check-Out Cutoff
              </label>
              <input
                type="time"
                name="autoCheckoutTime"
                value={formData.autoCheckoutTime}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-zinc-500"
                required
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                System automatically closes unclosed sessions at midnight.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Off Days Section */}
        <div className="bg-[#121215] border border-[#1e1e22] rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white pb-2 border-b border-[#1e1e22]">
            📅 Weekly Off Days
          </h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = formData.weeklyOff.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleWeeklyOffToggle(day)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md'
                      : 'bg-[#1a1a1e] text-zinc-400 border border-[#27272a] hover:text-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition-all shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}