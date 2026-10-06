const STATUS_BADGE_STYLES = {
  'On Time': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Late: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Field Work': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  'On Leave': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};
const DEFAULT_BADGE_STYLE = 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';

// Legacy records may still carry 'Leave'
export const getDisplayStatus = (record) => (record?.status === 'Leave' ? 'On Leave' : record?.status || '-');

export default function StatusBadge({ record }) {
  const status = getDisplayStatus(record);
  const isLeave = status === 'On Leave';

  return (
    <div className="space-y-1" title={isLeave ? record.note || undefined : undefined}>
      <span
        className={`inline-block whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATUS_BADGE_STYLES[status] || DEFAULT_BADGE_STYLE}`}
      >
        {status}
      </span>
      {isLeave && record.leaveType && <p className="text-[10px] text-zinc-500 whitespace-nowrap">{record.leaveType}</p>}
    </div>
  );
}
