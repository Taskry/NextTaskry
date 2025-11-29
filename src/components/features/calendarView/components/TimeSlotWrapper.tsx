/**
 * 시간 슬롯 래퍼 컴포넌트
 *
 * 사용 위치: CalendarView의 components.timeSlotWrapper
 * 표시 내용: 주간/일간 뷰의 각 시간대별 배경 스타일링
 * 역할: 업무시간(초록), 점심시간(노랑), 일반시간(회색) 구분 표시
 */

import { isBusinessTime, isLunchTime } from "@/lib/utils/dateUtils";
import { getTimeSlotStyles } from "@/lib/utils/calendarStyleUtils";

interface TimeSlotWrapperProps {
  children: React.ReactNode;
  value: Date;
}

export default function TimeSlotWrapper({
  children,
  value,
}: TimeSlotWrapperProps) {
  const lunch = isLunchTime(value);
  const business = isBusinessTime(value);
  const className = getTimeSlotStyles(lunch, business);

  return (
    <div className={`h-full transition-colors ${className}`}>{children}</div>
  );
}
