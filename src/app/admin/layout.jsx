import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      <Sidebar />
      {/* min-w-0 Flexbox issue fix করে */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}