'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

// বাংলাদেশ সময় (Asia/Dhaka) অনুযায়ী সময় ফরম্যাট করার ফাংশন
const formatTime = (timeValue) => {
  if (!timeValue || timeValue === '-') return '-';

  const date = new Date(timeValue);
  
  // যদি সময়টি ISO string / timestamp হয় তবে Asia/Dhaka অনুযায়ী কনভার্ট করবে
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

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        setLoading(true);

        const url = selectedDate 
          ? `${API_BASE_URL}/attendance/logs?date=${selectedDate}`
          : `${API_BASE_URL}/attendance/logs`;

        const res = await fetch(url);

        if (!res.ok) {
          console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
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
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-6 bg-[#09090b] text-zinc-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Attendance Logs</h1>
          <p className="text-xs text-zinc-400">View and filter detailed check-in records</p>
        </div>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[#121215] border border-[#27272a] text-xs text-white px-3 py-2 rounded-xl focus:outline-none"
        />
      </div>

      <div className="bg-[#121215] border border-[#1e1e22] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1a1e] text-zinc-400 border-b border-[#27272a]">
            <tr>
              <th className="p-3.5 font-semibold">Date</th>
              <th className="p-3.5 font-semibold">Employee ID</th>
              <th className="p-3.5 font-semibold">Name</th>
              <th className="p-3.5 font-semibold">Check In</th>
              <th className="p-3.5 font-semibold">Check Out</th>
              <th className="p-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e22] text-zinc-300">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-500">Loading logs...</td>
              </tr>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id || log.id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                  <td className="p-3.5 text-zinc-400 font-mono">{log.date}</td>
                  <td className="p-3.5 font-mono text-zinc-400">{log.employeeId}</td>
                  <td className="p-3.5 font-medium text-white">{log.name}</td>
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
                <td colSpan={6} className="p-6 text-center text-zinc-500">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}