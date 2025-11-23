// components/task/DateInfo.tsx

import { Icon } from "@/components/shared/Icon";

interface DateInfoProps {
  startedAt?: string;
  endedAt?: string;
}

const DateInfo = ({ startedAt, endedAt }: DateInfoProps) => {
  if (!startedAt && !endedAt) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return "오늘";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 올해면 년도 생략
    if (year === today.getFullYear()) {
      return `${month}.${day}`;
    }

    return `${year}.${month}.${day}`;
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="mt-3 flex items-center gap-3 text-xs">
      {startedAt && (
        <div className="flex items-center gap-1 text-gray-500">
          <Icon type="calendar" size={14} className="text-gray-400" />
          <span>{formatDate(startedAt)}</span>
        </div>
      )}
      
      {startedAt && endedAt && (
        <span className="text-gray-300">→</span>
      )}
      
      {endedAt && (
        <div
          className={`flex items-center gap-1 ${
            isOverdue(endedAt)
              ? "text-red-600 font-medium"
              : "text-gray-500"
          }`}
        >
          <Icon 
            type="calendar" 
            size={14} 
            className={isOverdue(endedAt) ? "text-red-500" : "text-gray-400"} 
          />
          <span>{formatDate(endedAt)}</span>
          {isOverdue(endedAt) && (
            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
              지연
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DateInfo;
