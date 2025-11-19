"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "@/app/types/calendar";

// date-fns를 사용한 localizer 설정
const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 한국어 메시지
const messages = {
  allDay: "종일",
  previous: "이전",
  next: "다음",
  today: "오늘",
  month: "월",
  week: "주",
  day: "일",
  agenda: "일정",
  date: "날짜",
  time: "시간",
  event: "일정",
  noEventsInRange: "해당 기간에 일정이 없습니다.",
  showMore: (total: number) => `+${total} 더보기`,
};

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  loading?: boolean;
}

export default function CalendarView({
  events,
  onSelectEvent,
  loading = false,
}: CalendarViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-lg border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4" style={{ height: "700px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="ko"
        messages={messages}
        onSelectEvent={onSelectEvent}
        defaultView="month"
        views={["month"]} // 1차 개발: 월간 뷰만
        className="h-full"
      />
    </div>
  );
}
