'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isAssetShebaOpen, setIsAssetShebaOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Employees', path: '/admin/employees' },
    { name: 'Attendance', path: '/admin/attendance' },
    { name: 'Reports', path: '/admin/reports' },
    { name: 'QR Code', path: '/admin/qr-code' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0c0c0e] border-r border-[#1e1e22] flex flex-col justify-between p-6 h-screen sticky top-0 select-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-8">
          Attendance Admin
        </h1>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <div>
            <button
              type="button"
              aria-expanded={isAssetShebaOpen}
              onClick={() => setIsAssetShebaOpen((isOpen) => !isOpen)}
              className="flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 transition-all duration-150 hover:text-white hover:bg-[#18181b]"
            >
              <span>Asset sheba</span>
              <span aria-hidden="true">{isAssetShebaOpen ? '−' : '+'}</span>
            </button>
            {isAssetShebaOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-[#27272a] pl-3">
                <a
                  href="https://docs.google.com/spreadsheets/d/1GsNbK1DrgyjyvuFtP9mDseCPwEaMzpqD/edit?gid=356596419#gid=356596419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-[#18181b] hover:text-white"
                >
                  Daily Leads
                </a>
                <a
                  href="https://docs.google.com/spreadsheets/d/14C2OfqHQQCWk-ZvFKq2TlLIG37fPuai3CogVRlomhTc/edit?gid=1466703151#gid=1466703151"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-[#18181b] hover:text-white"
                >
                  All Payments
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#1e1e22]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs ring-1 ring-zinc-700">
            N
          </div>
          <span className="text-sm font-medium text-zinc-300">Admin</span>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="text-red-500 hover:text-red-400 font-medium text-xs transition-colors px-2 py-1 rounded hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}