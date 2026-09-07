'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [officeStartTime, setOfficeStartTime] = useState('09:00');
  const [lateThreshold, setLateThreshold] = useState('09:15');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">System Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Configure attendance time rules and system rules.</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#121215] border border-[#1e1e22] p-6 rounded-2xl space-y-4 shadow-2xl">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Official Office Start Time</label>
          <input
            type="time"
            value={officeStartTime}
            onChange={(e) => setOfficeStartTime(e.target.value)}
            className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-lg border border-[#27272a] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">Late Check-In Cutoff Time (Late Rule)</label>
          <input
            type="time"
            value={lateThreshold}
            onChange={(e) => setLateThreshold(e.target.value)}
            className="w-full bg-[#1a1a1e] text-sm text-white px-3.5 py-2.5 rounded-lg border border-[#27272a] focus:outline-none"
          />
          <p className="text-xs text-zinc-500 mt-1">Any check-in after this time will automatically be marked as Late.</p>
        </div>

        <button
          type="submit"
          className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Save Settings
        </button>

        {saved && <p className="text-sm text-emerald-400 font-medium">Settings updated successfully!</p>}
      </form>
    </div>
  );
}