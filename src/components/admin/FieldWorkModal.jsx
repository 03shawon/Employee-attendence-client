'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

export const FIELD_WORK_CATEGORIES = ['Market Visit', 'Listing', 'Client Meeting', 'Other'];

const getToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });

const getCurrentTime = () =>
  new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false });

// "14:30" -> "02:30 PM"
export const formatClockTime = (value) => {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return value || '';
  const [h, m] = value.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

export const formatFieldWorkTime = (record) => {
  if (!record?.fieldWorkStartTime) return '';
  const start = formatClockTime(record.fieldWorkStartTime);
  return record.fieldWorkEndTime ? `${start} – ${formatClockTime(record.fieldWorkEndTime)}` : `From ${start}`;
};

const getInitialForm = () => ({
  employeeId: '',
  date: getToday(),
  startTime: getCurrentTime(),
  endTime: '',
  reasonCategory: FIELD_WORK_CATEGORIES[0],
  customReason: '',
  remarks: '',
});

const inputClass =
  'w-full bg-[#1a1a1e] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500/60';

export default function FieldWorkModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(getInitialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_BASE_URL}/employees`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.employees || [];
        setEmployees(list);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees.');
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const isOther = formData.reasonCategory === 'Other';

  const resetAndClose = () => {
    setFormData(getInitialForm());
    setError('');
    onClose();
  };

  const handleClose = () => {
    if (!loading) resetAndClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isOther && !formData.customReason.trim()) {
      setError('Please enter a custom reason.');
      return;
    }

    if (formData.endTime && formData.endTime <= formData.startTime) {
      setError('End time must be after start time.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/assign-field-work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customReason: isOther ? formData.customReason.trim() : '',
          remarks: formData.remarks.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        alert(data.message || 'Field work assigned successfully!');
        onSuccess && onSuccess();
        resetAndClose();
      } else {
        setError(data.message || 'Failed to assign field work.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121215] border border-[#1e1e22] text-zinc-100 p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#1e1e22] pb-3">
          <h2 className="text-sm font-bold text-white">🚗 Assign Field Work</h2>
          <button onClick={handleClose} className="text-zinc-400 hover:text-white text-lg" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Select Employee</label>
            <select required value={formData.employeeId} onChange={updateField('employeeId')} className={inputClass}>
              <option value="">{employees.length === 0 ? 'Loading employees...' : 'Choose Employee'}</option>
              {employees.map((emp) => (
                <option key={emp._id || emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Date</label>
            <input type="date" required value={formData.date} onChange={updateField('date')} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={updateField('startTime')}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">End Time (Optional)</label>
              <input
                type="time"
                value={formData.endTime}
                min={formData.startTime || undefined}
                onChange={updateField('endTime')}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Reason Category</label>
            <select value={formData.reasonCategory} onChange={updateField('reasonCategory')} className={inputClass}>
              {FIELD_WORK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {isOther && (
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">Custom Reason</label>
              <input
                type="text"
                required
                maxLength={120}
                placeholder="e.g. Bank documentation visit"
                value={formData.customReason}
                onChange={updateField('customReason')}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-400 mb-1.5 font-medium">Remarks / Notes (Optional)</label>
            <textarea
              rows="2"
              maxLength={500}
              placeholder="e.g. Visiting Gulshan area shops"
              value={formData.remarks}
              onChange={updateField('remarks')}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1e1e22]">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 bg-[#1a1a1e] hover:bg-[#27272a] text-zinc-300 font-medium rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Assigning...' : 'Assign Field Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
