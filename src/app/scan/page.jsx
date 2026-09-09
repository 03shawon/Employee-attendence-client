"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api";

export default function ScanPage() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [type, setType] = useState("in");
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees list for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.employees || [];
          setEmployees(list);
        }
      } catch (error) {
        console.error("Error loading employees list:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !pin) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/attendance/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, pin, type }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          success: true,
          text: data.message || "Attendance recorded successfully!",
        });
        setEmployeeId("");
        setPin("");
      } else {
        setStatusMsg({
          success: false,
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      setStatusMsg({ success: false, text: "Server connection failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between items-center p-4 sm:p-6 antialiased selection:bg-emerald-500 selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md my-auto relative z-10">
        <div className="bg-[#121215]/80 backdrop-blur-2xl border border-[#27272a] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-950/20">
          {/* Header & Official Logo */}
          <div className="text-center space-y-3">
            {/* লোগো কনটেইনার */}
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-xl shadow-emerald-950/30 ring-4 ring-emerald-500/20">
              <img
                src="/logo.jpeg"
                alt="Asset Sheba Logo"
                className="h-16 sm:h-20 w-auto max-w-[220px] object-contain mx-auto"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-emerald-400 bg-clip-text text-transparent">
                ASSET SHEBA
              </h1>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/90 mt-1">
                Official Attendance Portal
              </p>
            </div>
          </div>
          {/* Attendance Action Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#1a1a1e] p-1.5 rounded-2xl border border-[#27272a]">
            <button
              type="button"
              onClick={() => setType("in")}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                type === "in"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${type === "in" ? "bg-black animate-pulse" : "bg-emerald-500"}`}
              />
              Check In
            </button>
            <button
              type="button"
              onClick={() => setType("out")}
              className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                type === "out"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-[1.02]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${type === "out" ? "bg-black animate-pulse" : "bg-amber-500"}`}
              />
              Check Out
            </button>
          </div>

          {/* Feedback Alert Notification */}
          {statusMsg && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium text-center border transition-all animate-in fade-in slide-in-from-top-2 ${
                statusMsg.success
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">
                Select Employee Name / ID
              </label>
              <div className="relative">
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-[#1a1a1e] text-sm text-white px-4 py-3.5 rounded-xl border border-[#27272a] focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer pr-10"
                  required
                >
                  <option value="" className="bg-[#121215] text-zinc-500">
                    -- Select Employee --
                  </option>
                  {employees.map((emp) => (
                    <option
                      key={emp._id || emp.employeeId}
                      value={emp.employeeId}
                      className="bg-[#121215] text-white py-2"
                    >
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Numeric PIN Input optimized for mobile */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">
                4-Digit Security PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#1a1a1e] text-center text-2xl tracking-[0.6em] text-white px-4 py-3 rounded-xl border border-[#27272a] focus:outline-none focus:border-emerald-500 font-mono transition-colors placeholder:tracking-normal placeholder:text-zinc-600"
                required
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                type === "in"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-emerald-950/50"
                  : "bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-black shadow-amber-950/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>Confirm {type === "in" ? "Check In" : "Check Out"}</>
              )}
            </button>
          </form>

          {/* Admin Navigation */}
          <div className="pt-2 border-t border-[#1e1e22]">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a1a1e] hover:bg-[#222226] border border-[#27272a] hover:border-zinc-500 text-xs font-semibold text-zinc-300 hover:text-white transition-all w-full"
            >
              🔐 Admin Portal Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-6 font-medium">
          Powered by <span className="text-zinc-400">Asset Sheba System</span>
        </p>
      </div>
    </div>
  );
}
