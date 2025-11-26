// components/task/DateInfo.tsx

import { Icon } from "@/components/shared/Icon";
import Badge from "@/components/ui/Badge";

interface DateInfoProps {
  startedAt?: string;
  endedAt?: string;
  status?: string;
}

const DateInfo = ({ startedAt, endedAt, status }: DateInfoProps) => {
  if (!startedAt && !endedAt) return null;

  const getDaysDiff = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ✅ isCompleted 파라미터 추가
  const formatDate = (
    dateString: string,
    isEndDate = false,
    isCompleted = false
  ) => {
    const daysDiff = getDaysDiff(dateString);

    // ✅ 완료된 작업은 항상 절대 날짜로 표시
    if (isCompleted) {
      const date = new Date(dateString);
      const today = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      if (year === today.getFullYear()) {
        return `${month}.${day}`;
      }
      return `${year}.${month}.${day}`;
    }

    // D-Day 표시 (종료일이고 3일 이내)
    if (isEndDate && daysDiff >= 0 && daysDiff <= 3) {
      if (daysDiff === 0) return "오늘 마감";
      if (daysDiff === 1) return "내일 마감";
      if (daysDiff === 2) return "모레 마감";
      return `D-${daysDiff}`;
    }

    // 일반 날짜 표시
    if (daysDiff === 0) return "오늘";
    if (daysDiff === 1) return "내일";
    if (daysDiff === 2) return "모레";
    if (daysDiff === -1) return "어제";

    const date = new Date(dateString);
    const today = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 올해면 년도 생략
    if (year === today.getFullYear()) {
      return `${month}.${day}`;
    }

    return `${year}.${month}.${day}`;
  };

  const getEndDateStatus = (dateString: string) => {
    const daysDiff = getDaysDiff(dateString);

    if (daysDiff < 0) return { isOverdue: true, isUrgent: false };
    if (daysDiff === 0) return { isOverdue: false, isUrgent: true };
    if (daysDiff <= 2) return { isOverdue: false, isUrgent: true };
    return { isOverdue: false, isUrgent: false };
  };

  const endDateStatus = endedAt ? getEndDateStatus(endedAt) : null;
  const isCompleted = status === "done";

  return (
    <div
      className={`flex items-center pl-2 justify-between gap-2 text-xs ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {startedAt && (
          <div
            className={`flex items-center gap-0.5 text-gray-500 dark:text-gray-400 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            <Icon
              type="calendar"
              size={14}
              className="text-gray-400 dark:text-gray-500"
            />
            {/* ✅ isCompleted 전달 */}
            <span>{formatDate(startedAt, false, isCompleted)}</span>
          </div>
        )}

        {startedAt && endedAt && (
          <span className="text-gray-300 dark:text-gray-400">→</span>
        )}

        {endedAt && (
          <div
            className={`flex items-center gap-0.5 ${
              isCompleted
                ? "text-gray-500 dark:text-gray-400 line-through"
                : endDateStatus?.isOverdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : endDateStatus?.isUrgent
                ? "text-orange-600 dark:text-orange-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Icon
              type="calendar"
              size={14}
              className={
                isCompleted
                  ? "text-gray-400 dark:text-gray-500"
                  : endDateStatus?.isOverdue
                  ? "text-red-500 dark:text-red-400"
                  : endDateStatus?.isUrgent
                  ? "text-orange-500 dark:text-orange-400"
                  : "text-gray-400 dark:text-gray-500"
              }
            />
            {/* ✅ isCompleted 전달 */}
            <span className="leading-none">
              {formatDate(endedAt, true, isCompleted)}
            </span>
          </div>
        )}
      </div>

      {!isCompleted && (
        <>
          {endDateStatus?.isOverdue && <Badge type="overDue" />}
          {endDateStatus?.isUrgent && !endDateStatus.isOverdue && (
            <Badge type="dueSoon" />
          )}
        </>
      )}
    </div>
  );
};

export default DateInfo;
