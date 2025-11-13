// components/task/DateInfo.tsx

interface DateInfoProps {
  startedAt?: string;
  endedAt?: string;
}

const DateInfo = ({ startedAt, endedAt }: DateInfoProps) => {
  if (!startedAt && !endedAt) return null;

  return (
    <div className="mt-2 flex gap-3 text-xs text-gray-500">
      {startedAt && <span>🚀 {startedAt}</span>}
      {endedAt && <span>📅 {endedAt}</span>}
    </div>
  );
};

export default DateInfo;
