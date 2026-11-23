'use client';

import { useEffect, useState } from 'react';
import API_BASE_URL from '@/lib/api';

const getToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
const inputClass = 'w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500/60';

export default function HomeOfficeModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ employeeId: '', date: getToday(), note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    fetch(`${API_BASE_URL}/employees`)
      .then((res) => res.json())
      .then((data) => setEmployees(Array.isArray(data) ? data : data.employees || []))
      .catch(() => setError('Failed to load employees.'));
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  const close = () => {
    if (loading) return;
    setFormData({ employeeId: '', date: getToday(), note: '' });
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/assign-home-office`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, note: formData.note.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(
          data.message ||
            (res.status === 404
              ? 'The backend does not have POST /api/attendance/assign-home-office yet.'
              : `Failed to assign home office (HTTP ${res.status}).`)
        );
        return;
      }
      onSuccess?.();
      close();
    } catch {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121215] border border-[#1e1e22] text-zinc-100 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#1e1e22] pb-3">
          <h2 className="text-sm font-bold text-white">🏠 Assign Home Office</h2>
          <button type="button" onClick={close} className="text-zinc-400 hover:text-white text-lg" aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Select Employee</label>
            <select required value={formData.employeeId} onChange={updateField('employeeId')} className={inputClass}>
              <option value="">{employees.length === 0 ? 'Loading employees...' : 'Choose Employee'}</option>
              {employees.map((emp) => <option key={emp._id || emp.employeeId} value={emp.employeeId}>{emp.name} ({emp.employeeId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Date</label>
            <input type="date" required value={formData.date} onChange={updateField('date')} className={`${inputClass} [color-scheme:dark]`} />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Note (Optional)</label>
            <textarea rows="2" maxLength={500} placeholder="Add a note for this assignment" value={formData.note} onChange={updateField('note')} className={inputClass} />
          </div>
          {error && <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#1e1e22]">
            <button type="button" onClick={close} disabled={loading} className="px-4 py-2.5 bg-[#1a1a1e] hover:bg-[#27272a] text-zinc-300 font-medium rounded-xl disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading || employees.length === 0} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl disabled:opacity-50">{loading ? 'Assigning...' : 'Assign Home Office'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
