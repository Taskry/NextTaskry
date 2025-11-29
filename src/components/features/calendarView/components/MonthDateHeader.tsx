/**
 * 월간 뷰 날짜 헤더 컴포넌트
 *
 * 사용 위치: CalendarView의 components.month.dateHeader
 * 표시 내용: 월간뷰의 각 날짜 숫자 (1, 2, 3...)
 */

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { isToday, isWeekend, isDifferentMonth } from "@/lib/utils/dateUtils";
import { getMonthDateHeaderStyles } from "@/lib/utils/calendarStyleUtils";

interface MonthDateHeaderProps {
  date: Date;
  projectStartDate?: string;
  projectEndDate?: string;
}

export default function MonthDateHeader({
  date,
  projectStartDate,
  projectEndDate,
}: MonthDateHeaderProps) {
  const today = isToday(date);
  const weekend = isWeekend(date);
  const currentDate = new Date();
  const otherMonth = isDifferentMonth(date, currentDate);

  // 프로젝트 범위 밖 날짜 체크
  const isOutsideProject = (() => {
    if (!projectStartDate || !projectEndDate) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return dateStr < projectStartDate || dateStr > projectEndDate;
  })();

  const className = getMonthDateHeaderStyles(
    today,
    weekend,
    otherMonth,
    isOutsideProject
  );

  return (
    <div className={`text-center py-2 px-1 ${className}`}>
      {format(date, "d", { locale: ko })}
    </div>
  );
}
