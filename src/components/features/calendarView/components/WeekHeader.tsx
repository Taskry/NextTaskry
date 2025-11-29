/**
 * 주간 뷰 헤더 컴포넌트
 *
 * 사용 위치: CalendarView의 components.week.header
 * 표시 내용: 요일(월) + 날짜(15) + "오늘" 표시
 */

import { format } from "date-fns";
import { isToday, isWeekend } from "@/lib/utils/dateUtils";
import { getWeekHeaderStyles } from "@/lib/utils/calendarStyleUtils";

interface WeekHeaderProps {
  date: Date;
  localizer: {
    format: (date: Date, formatStr: string) => string;
  };
  projectStartedAt?: string;
  projectEndedAt?: string;
}

export default function WeekHeader({
  date,
  localizer,
  projectStartedAt,
  projectEndedAt,
}: WeekHeaderProps) {
  const today = isToday(date);
  const weekend = isWeekend(date);

  // 프로젝트 기간 밖 날짜는 비활성화 처리
  const isOutsideProject = (() => {
    if (!projectStartedAt || !projectEndedAt) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return dateStr < projectStartedAt || dateStr > projectEndedAt;
  })();

  const styles = getWeekHeaderStyles(today, weekend, isOutsideProject);

  return (
    <div
      className={`text-center py-3 px-2 border-b border-gray-200 dark:border-gray-600 ${styles.container}`}
    >
      {/* 요일 */}
      <div className={`text-[11px] mb-1 ${styles.day}`}>
        {localizer.format(date, "E")}
      </div>

      {/* 날짜 */}
      <div className={`text-base ${styles.date}`}>
        {localizer.format(date, "d")}
      </div>

      {/* 오늘 표시 (텍스트 대신 작은 점) */}
      {today && !isOutsideProject && (
        <div className="mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-main-500 dark:bg-main-300"></span>
        </div>
      )}
    </div>
  );
}
