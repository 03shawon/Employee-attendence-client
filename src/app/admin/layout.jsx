import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#09090b] text-zinc-100 font-sans md:h-dvh md:min-h-0 md:flex-row md:overflow-hidden">
      <Sidebar />
      {/* min-w-0 Flexbox issue fix করে */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:h-full md:overflow-y-auto md:p-8">
        {children}
      </main>
    </div>
  );
}
