/**
 * 일간 뷰 헤더 컴포넌트
 *
 * 사용 위치: CalendarView의 components.day.header
 * 표시 내용: 요일(월요일) + 날짜(15) + 년월(2024년 11월) + Today 뱃지
 */

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { isToday } from "@/lib/utils/dateUtils";
import { getDayHeaderStyles } from "@/lib/utils/calendarStyleUtils";

interface DayHeaderProps {
  date: Date;
  localizer: {
    format: (date: Date, formatStr: string) => string;
  };
  projectStartDate?: string; // ← 추가
  projectEndDate?: string; // ← 추가
}

export default function DayHeader({
  date,
  localizer,
  projectStartDate,
  projectEndDate,
}: DayHeaderProps) {
  const today = isToday(date);

  // 프로젝트 기간 밖 체크
  const isOutsideProject = (() => {
    if (!projectStartDate || !projectEndDate) return false;
    const dateStr = format(date, "yyyy-MM-dd", { locale: ko });
    return dateStr < projectStartDate || dateStr > projectEndDate;
  })();

  const styles = getDayHeaderStyles(today, isOutsideProject);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-b-2 ${styles.container}`}
    >
      {/* 왼쪽: 요일 + 날짜 */}
      <div className="flex items-baseline gap-2">
        <span className={`text-xl font-bold ${styles.weekdayText}`}>
          {localizer.format(date, "EEEE")}
        </span>
        <span className={`text-3xl font-bold ${styles.dateText}`}>
          {localizer.format(date, "d")}
        </span>
      </div>

      {/* 오른쪽: 년월 + Today 뱃지 */}
      <div className="flex items-center gap-2">
        <span className={`text-sm ${styles.monthText}`}>
          {format(date, "yyyy년 M월", { locale: ko })}
        </span>
        {today && !isOutsideProject && (
          <span className="px-2 py-1 bg-main-500 text-white text-xs font-semibold rounded-full">
            Today
          </span>
        )}
      </div>
    </div>
  );
}
