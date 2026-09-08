'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

const formatTime = (timeValue) => {
  if (!timeValue || timeValue === '-') return '-';
  const date = new Date(timeValue);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  return timeValue;
};

export default function AttendancePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        setLoading(true);

        let queryParams = [];
        if (selectedDate) queryParams.push(`date=${selectedDate}`);
        if (statusFilter !== 'All') queryParams.push(`status=${statusFilter}`);

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const res = await fetch(`${API_BASE_URL}/attendance/logs${queryString}`);

        if (!res.ok) {
          setLogs([]);
          return;
        }

        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching attendance logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceLogs();
  }, [selectedDate, statusFilter]);

  // Client-side search filtering
  const filteredLogs = logs.filter(log =>
    log.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No logs available to export!');
      return;
    }

    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Designation', 'Check In', 'Check Out', 'Status'];
    const rows = filteredLogs.map(log => [
      log.date || '',
      log.employeeId || '',
      `"${log.name || ''}"`,
      `"${log.department || '-'}"`,
      `"${log.designation || '-'}"`,
      `"${formatTime(log.checkIn)}"`,
      `"${formatTime(log.checkOut)}"`,
      log.status || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Logs_${selectedDate || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 bg-[#09090b] text-zinc-100 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Attendance Logs</h1>
          <p className="text-xs text-zinc-400">View and filter detailed check-in records</p>
        </div>

        {/* Search, Filters and Export Button */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by Name / ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121215] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none w-full sm:w-44"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121215] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="On Time">On Time</option>
            <option value="Late">Late</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#121215] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none"
          />

          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-2 border border-[#27272a] bg-[#121215] rounded-xl transition-all"
            >
              Clear
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#121215] border border-[#1e1e22] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1a1e] text-zinc-400 border-b border-[#27272a]">
            <tr>
              <th className="p-3.5 font-semibold">Date</th>
              <th className="p-3.5 font-semibold">Employee ID</th>
              <th className="p-3.5 font-semibold">Name</th>
              <th className="p-3.5 font-semibold">Department</th>
              <th className="p-3.5 font-semibold">Designation</th>
              <th className="p-3.5 font-semibold">Check In</th>
              <th className="p-3.5 font-semibold">Check Out</th>
              <th className="p-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e22] text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-zinc-500">Loading logs...</td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id || log.id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                  <td className="p-3.5 text-zinc-400 font-mono">{log.date}</td>
                  <td className="p-3.5 font-mono text-zinc-400">{log.employeeId}</td>
                  <td className="p-3.5 font-medium text-white">{log.name}</td>
                  <td className="p-3.5 text-zinc-300">{log.department || '-'}</td>
                  <td className="p-3.5 text-zinc-300">{log.designation || '-'}</td>
                  <td className="p-3.5 text-emerald-400 font-mono">{formatTime(log.checkIn)}</td>
                  <td className="p-3.5 text-amber-400 font-mono">{formatTime(log.checkOut)}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      log.status === 'On Time' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-zinc-500">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}