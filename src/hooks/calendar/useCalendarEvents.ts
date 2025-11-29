/**
 * 캘린더 이벤트 변환 hook
 *
 * 역할:
 * - Task 데이터를 Calendar event 형식으로 변환
 * - 시간 지정 여부에 따라 종일/시간 지정 이벤트 구분
 * - 담당자 정보 포함
 * - 리얼타임 업데이트 대응
 */

import { useMemo } from "react";
import { Task } from "@/types/kanban";
import { format } from "date-fns";

// 캘린더 이벤트 인터페이스
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  task: Task;
  assignees: {
    id: string;
    name: string;
    avatarUrl?: string;
  }[];
}

/**
 * @param tasks
 * @returns
 */

export function useCalendarEvents(tasks: Task[]) {
  const events: CalendarEvent[] = useMemo(() => {
    return tasks
      .filter((t) => t.started_at || t.ended_at)
      .map((t) => {
        let start: Date;
        let end: Date;

        if (t.use_time && (t.start_time || t.end_time)) {
          // 시간 지정된 이벤트
          const startDateStr =
            t.started_at?.split("T")[0] || format(new Date(), "yyyy-MM-dd");
          const endDateStr = t.ended_at?.split("T")[0] || startDateStr;

          start = new Date(`${startDateStr}T${t.start_time || "00:00"}:00`);
          end = t.end_time
            ? new Date(`${endDateStr}T${t.end_time}:00`)
            : new Date(start.getTime() + 60 * 60 * 1000); // 1시간 후
        } else {
          // 종일 이벤트
          start = t.started_at ? new Date(t.started_at) : new Date();
          end = t.ended_at ? new Date(t.ended_at) : start;
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        }

        // 담당자 정보 추출
        const assignees = (t as any).assignee
          ? [
              {
                id: (t as any).assignee.id,
                name: (t as any).assignee.name,
                avatarUrl: (t as any).assignee.avatar_url,
              },
            ]
          : [];

        // 담당자 정보를 포함한 제목 구성
        const assigneeInfo =
          assignees.length > 0 ? ` (👤${assignees[0].name})` : "";
        const title = `${t.title}${assigneeInfo}`;

        return {
          id: t.id,
          title,
          start,
          end,
          allDay: !t.use_time,
          task: t,
          assignees,
        };
      });
  }, [tasks]);

  return events;
}
