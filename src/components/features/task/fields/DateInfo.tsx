// components/features/task/fields/DateInfo.tsx

import { Icon } from "@/components/shared/Icon";
import Badge from "@/components/ui/Badge";

interface DateInfoProps {
  startedAt?: string;
  endedAt?: string;
  startTime?: string;
  endTime?: string;
  useTime?: boolean;
  status?: string;
}

const DateInfo = ({
  startedAt,
  endedAt,
  startTime,
  endTime,
  useTime,
  status,
}: DateInfoProps) => {
  if (!startedAt && !endedAt) return null;

  const isCompleted = status === "done";

  // 날짜 차이 계산 (날짜만 비교)
  const getDaysDiff = (dateString: string) => {
    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    let taskDateOnly;
    if (dateString.includes("T")) {
      const dateOnly = dateString.split("T")[0];
      const parts = dateOnly.split("-");
      taskDateOnly = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2])
      );
    } else {
      const parts = dateString.split("-");
      taskDateOnly = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2])
      );
    }

    const diffTime = taskDateOnly.getTime() - todayDateOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getDeadlineStatus = (dateString: string, timeString?: string) => {
    const now = new Date();

    // 시간 정보가 있고 useTime이 true인 경우
    if (useTime && timeString) {
      const formattedDateString = dateString.includes("T")
        ? dateString.split("T")[0]
        : dateString;

      const deadlineDateTime = new Date(`${formattedDateString}T${timeString}`);

      const timeDiff = deadlineDateTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      return {
        isOverdue: timeDiff < 0,
        isUrgent: !isNaN(minutesDiff) && minutesDiff > 0 && minutesDiff <= 180,
      };
    }

    // 날짜만 있는 경우
    const daysDiff = getDaysDiff(dateString);
    return {
      isOverdue: daysDiff < 0,
      isUrgent: daysDiff >= 0 && daysDiff <= 1,
    };
  };

  // 날짜+시간 포맷팅
  const formatDateTime = (
    dateString: string,
    timeString?: string,
    isEndDate = false,
    isCompleted = false
  ) => {
    const daysDiff = getDaysDiff(dateString);
    let dateText = "";

    if (isCompleted) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const currentYear = new Date().getFullYear();

      dateText =
        year === currentYear ? `${month}.${day}` : `${year}.${month}.${day}`;
    } else if (isEndDate && daysDiff >= -7 && daysDiff <= 3) {
      if (daysDiff === 0) {
        // 오늘 마감 - 시간 체크
        if (useTime && timeString) {
          const status = getDeadlineStatus(dateString, timeString);
          if (status.isOverdue) {
            dateText = "지연됨";
          } else {
            dateText = "오늘 마감";
          }
        } else {
          dateText = "오늘 마감";
        }
      } else if (daysDiff === 1) dateText = "내일 마감";
      else if (daysDiff === 2) dateText = "모레 마감";
      else if (daysDiff === -1) dateText = "어제 (지연)";
      else if (daysDiff < 0) dateText = `${Math.abs(daysDiff)}일 지연`;
      else dateText = `D-${daysDiff}`;
    } else {
      if (daysDiff === 0) dateText = "오늘";
      else if (daysDiff === 1) dateText = "내일";
      else if (daysDiff === 2) dateText = "모레";
      else if (daysDiff === -1) dateText = "어제";
      else {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const currentYear = new Date().getFullYear();

        dateText =
          year === currentYear ? `${month}.${day}` : `${year}.${month}.${day}`;
      }
    }

    // 시간 정보 추가
    if (useTime && timeString) {
      return `${dateText} ${timeString}`;
    }

    return dateText;
  };

  const endDateStatus = endedAt ? getDeadlineStatus(endedAt, endTime) : null;

  return (
    <div
      className={`flex items-center justify-between text-xs ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* 날짜 정보 */}
      <div className="flex items-center gap-2 flex-1">
        {startedAt && (
          <div
            className={`flex items-center gap-1 ${
              isCompleted
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Icon
              type="calendar"
              size={14}
              className="text-gray-400 dark:text-gray-500"
            />
            <span className="text-xs">
              {formatDateTime(startedAt, startTime, false, isCompleted)}
            </span>
          </div>
        )}

        {startedAt && endedAt && (
          <span className="text-gray-300 dark:text-gray-500 mx-1">→</span>
        )}

        {endedAt && (
          <div
            className={`flex items-center gap-1 ${
              isCompleted
                ? "line-through text-gray-500 dark:text-gray-400"
                : endDateStatus?.isOverdue
                ? "text-red-600 dark:text-red-400 font-semibold"
                : endDateStatus?.isUrgent
                ? "text-orange-600 dark:text-orange-400 font-semibold"
                : "text-gray-600 dark:text-gray-400"
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
            <span className="text-xs">
              {formatDateTime(endedAt, endTime, true, isCompleted)}
            </span>
          </div>
        )}
      </div>

      {/* 뱃지 */}
      {!isCompleted && endDateStatus && (
        <div className="flex gap-1 items-center shrink-0 ml-2">
          {endDateStatus.isOverdue && <Badge type="overDue" />}
          {endDateStatus.isUrgent && !endDateStatus.isOverdue && (
            <Badge type="dueSoon" />
          )}
        </div>
      )}
    </div>
  );
};

export default DateInfo;
