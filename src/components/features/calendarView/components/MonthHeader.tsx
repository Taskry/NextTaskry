/**
 * 월간 뷰 요일 헤더 컴포넌트
 *
 * 사용 위치: CalendarView의 components.month.header
 * 표시 내용: 월간뷰 상단 요일 (일, 월, 화, 수, 목, 금, 토)
 */

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getMonthHeaderStyles } from "@/lib/utils/calendarStyleUtils";

interface MonthHeaderProps {
  date: Date;
}

export default function MonthHeader({ date }: MonthHeaderProps) {
  const dayIndex = date.getDay(); // 0(일) ~ 6(토)
  const styles = getMonthHeaderStyles(dayIndex);

  return (
    <div
      className={`text-center py-3 px-2 font-semibold text-sm border-b border-gray-200 dark:border-gray-600 ${styles.container}`}
    >
      {format(date, "E", { locale: ko })}
    </div>
  );
}
