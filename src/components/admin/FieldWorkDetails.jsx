import { formatClockTime } from '@/components/admin/FieldWorkModal';

export const isFieldWorkRecord = (record) => Boolean(record?.isFieldWork) || record?.status === 'Field Work';

export default function FieldWorkDetails({ record }) {
  if (!isFieldWorkRecord(record)) return <span className="text-zinc-600">-</span>;

  const { fieldWorkReason, fieldWorkStartTime, fieldWorkEndTime, remarks } = record;

  return (
    <div className="space-y-1 min-w-[9rem]" title={remarks || undefined}>
      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
        {fieldWorkReason || 'Field Work'}
      </span>
      {fieldWorkStartTime ? (
        <p className="font-mono text-[11px] text-zinc-300 whitespace-nowrap">
          🕒 {formatClockTime(fieldWorkStartTime)}
          <span className="text-zinc-500"> – </span>
          {fieldWorkEndTime ? formatClockTime(fieldWorkEndTime) : <span className="text-zinc-500">Ongoing</span>}
        </p>
      ) : (
        <p className="text-[11px] text-zinc-500">No time set</p>
      )}
      {remarks && <p className="text-[10px] text-zinc-500 truncate max-w-[12rem]">{remarks}</p>}
    </div>
  );
}
