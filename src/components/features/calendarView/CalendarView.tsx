"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "@/types/kanban";

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: Task[];
  onCreateTask?: (data: { started_at: Date; ended_at: Date }) => void;
  onSelectTask?: (task: Task) => void;
}

export default function CalendarView({
  tasks = [],
  onCreateTask,
  onSelectTask,
}: CalendarViewProps) {
  const [lastClick, setLastClick] = useState<number | null>(null);

  const handleSelectSlot = (slot: any) => {
    const now = Date.now();

    if (lastClick && now - lastClick < 250) {
      onCreateTask?.({
        started_at: slot.start,
        ended_at: slot.start,
      });
    }

    setLastClick(now);
  };

  const events = (tasks ?? [])
    .filter((t) => t.started_at || t.ended_at)
    .map((t) => {
      const start = t.started_at ? new Date(t.started_at) : new Date();
      const end = t.ended_at ? new Date(t.ended_at) : start;

      end.setHours(23, 59, 59, 999);

      return {
        id: t.id,
        title: t.title,
        start,
        end,
        task: t,
      };
    });

  return (
    <div className="h-full bg-white rounded-lg shadow p-4 overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => onSelectTask?.(event.task)}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: "100%" }}
        // ⭐⭐ 상태별 색상 적용 파트 ⭐⭐
        eventPropGetter={(event) => {
          let bg = "#d1d5db"; // todo (기본)

          if (event.task.status === "inprogress") bg = "#3b82f6";
          if (event.task.status === "done") bg = "#22c55e";

          return {
            style: {
              backgroundColor: bg,
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "2px 4px",
            },
          };
        }}
      />
    </div>
  );
}
