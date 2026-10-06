'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';
import LeaveModal from '@/components/admin/LeaveModal';
import FieldWorkModal from '@/components/admin/FieldWorkModal';
import FieldWorkDetails from '@/components/admin/FieldWorkDetails';
import StatusBadge from '@/components/admin/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    leaveToday: 0,
    fieldWorkToday: 0,
    absentToday: 0,
    records: []
  });
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isFieldWorkModalOpen, setIsFieldWorkModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/attendance/stats`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [reload]);

  return (
    <div className="p-6 space-y-6 bg-[#09090b] text-zinc-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-xs text-zinc-400">Live attendance status for today</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-md"
          >
            + Assign Leave
          </button>
          <button
            onClick={() => setIsFieldWorkModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-md"
          >
            🚗 + Assign Field Work
          </button>
          <button
            onClick={() => setReload((prev) => prev + 1)}
            className="px-3.5 py-2 text-xs font-medium bg-[#1a1a1e] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-zinc-300 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-zinc-400">Total Employees</span>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalEmployees}</p>
        </div>

        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-emerald-400">Present Today</span>
          <p className="text-2xl font-bold text-emerald-400">{loading ? '...' : stats.presentToday}</p>
        </div>

        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-amber-400">Late Arrivals</span>
          <p className="text-2xl font-bold text-amber-400">{loading ? '...' : stats.lateToday}</p>
        </div>

        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-purple-400">On Leave</span>
          <p className="text-2xl font-bold text-purple-400">{loading ? '...' : stats.leaveToday ?? 0}</p>
        </div>

        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-cyan-400">Field Work</span>
          <p className="text-2xl font-bold text-cyan-400">{loading ? '...' : stats.fieldWorkToday ?? 0}</p>
        </div>

        <div className="bg-[#121215] border border-[#1e1e22] rounded-xl p-4 space-y-1">
          <span className="text-xs font-medium text-red-400">Absent Today</span>
          <p className="text-2xl font-bold text-red-400">{loading ? '...' : stats.absentToday}</p>
        </div>
      </div>

      {/* Today's Attendance Table */}
      <div className="bg-[#121215] border border-[#1e1e22] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1e1e22]">
          <h2 className="text-sm font-semibold text-white">Todays Check-in Log</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1a1a1e] text-zinc-400 border-b border-[#27272a]">
              <tr>
                <th className="p-3.5 font-semibold">Employee ID</th>
                <th className="p-3.5 font-semibold">Name</th>
                <th className="p-3.5 font-semibold">Department</th>
                <th className="p-3.5 font-semibold">Designation</th>
                <th className="p-3.5 font-semibold">Check In</th>
                <th className="p-3.5 font-semibold">Check Out</th>
                <th className="p-3.5 font-semibold">Field Work</th>
                <th className="p-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e22] text-zinc-300">
              {stats.records?.length > 0 ? (
                stats.records.map((row) => (
                  <tr key={row._id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                    <td className="p-3.5 font-mono text-zinc-400">{row.employeeId}</td>
                    <td className="p-3.5 font-medium text-white">{row.name}</td>
                    <td className="p-3.5">{row.department || '-'}</td>
                    <td className="p-3.5">{row.designation || '-'}</td>
                    <td className="p-3.5 text-emerald-400 font-mono">{row.checkIn || '-'}</td>
                    <td className="p-3.5 text-amber-400 font-mono">{row.checkOut || '-'}</td>
                    <td className="p-3.5">
                      <FieldWorkDetails record={row} />
                    </td>
                    <td className="p-3.5">
                      <StatusBadge record={row} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-zinc-500">
                    No check-ins recorded for today yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={() => setReload((prev) => prev + 1)}
      />
      <FieldWorkModal
        isOpen={isFieldWorkModalOpen}
        onClose={() => setIsFieldWorkModalOpen(false)}
        onSuccess={() => setReload((prev) => prev + 1)}
      />
    </div>
  );
}