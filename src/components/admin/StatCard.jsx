export default function StatCard({ title, count, highlight = false }) {
  return (
    <div className="bg-[#121215] border border-[#1e1e22] p-5 rounded-2xl transition-all duration-200 hover:border-zinc-700">
      <p className="text-xs text-zinc-400 font-medium mb-2">{title}</p>
      <h3 className={`text-3xl font-bold tracking-tight ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {count}
      </h3>
    </div>
  );
}