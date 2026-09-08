'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

export default function LeaveModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    leaveType: 'Sick Leave',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/employees`)
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : data.employees || [];
          setEmployees(list);
        })
        .catch((err) => console.error('Error fetching employees:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/attendance/manual-leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Leave marked successfully!');
        onSuccess && onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to mark leave.');
      }
    } catch (err) {
      alert('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121215] border border-[#1e1e22] text-zinc-100 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#1e1e22] pb-3">
          <h2 className="text-sm font-bold text-white">🏖️ Assign Leave / Sick Day</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Select Employee</label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="">Choose Employee</option>
              {employees.map((emp) => (
                <option key={emp._id || emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Leave Type</label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="Sick Leave">Sick Leave (অসুস্থতাজনিত ছুটি)</option>
              <option value="Casual Leave">Casual Leave (নৈমিত্তিক ছুটি)</option>
              <option value="Paid Leave">Paid Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Note / Reason (Optional)</label>
            <textarea
              rows="2"
              placeholder="e.g. Doctor advice for rest"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1e1e22]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#1a1a1e] hover:bg-[#27272a] text-zinc-300 font-medium rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Leave'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}