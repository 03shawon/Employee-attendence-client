import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between items-center p-4 sm:p-6 antialiased selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-xl my-auto relative z-10 space-y-8 py-8">
        
        {/* Branding & Logo Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-2xl shadow-emerald-950/30 ring-4 ring-emerald-500/20">
            <Image
              src="/logo.jpeg"
              alt="Asset Sheba Logo"
              width={180}
              height={70}
              className="h-16 sm:h-20 w-auto object-contain mx-auto"
              priority
            />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-emerald-400 bg-clip-text text-transparent">
              ASSET SHEBA
            </h1>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-emerald-400/90">
              Employee Attendance System
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Welcome to Asset Sheba's official attendance portal. Please choose your module to proceed.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Employee Attendance Portal Card */}
          <Link
            href="/scan"
            className="group relative bg-[#121215]/80 backdrop-blur-xl border border-[#27272a] hover:border-emerald-500/50 p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform text-xl">
                📲
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Give Attendance
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Mark daily Check-In or Check-Out using PIN from office network.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform pt-2">
              <span>Open Scan Page</span>
              <span>→</span>
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link
            href="/admin"
            className="group relative bg-[#121215]/80 backdrop-blur-xl border border-[#27272a] hover:border-indigo-500/50 p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform text-xl">
                🔐
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                Admin Portal
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Manage employee profiles, leave entries, and view attendance logs.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform pt-2">
              <span>Go to Admin Panel</span>
              <span>→</span>
            </div>
          </Link>

        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4">
        <p className="text-[11px] text-zinc-600 font-medium">
          Powered by <span className="text-zinc-400 font-semibold">Asset Sheba System</span>
        </p>
      </footer>
    </div>
  );
}