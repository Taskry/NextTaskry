import { CalendarEvent, TaskForCalendar } from "./../app/types/calendar";

/**
 * Task를 Calendar Event로 변환
 */
export function taskToCalendarEvent(
  task: TaskForCalendar
): CalendarEvent | null {
  // 시작일이나 종료일이 없으면 캘린더에 표시하지 않음
  if (!task.start_date && !task.end_date) {
    return null;
  }

  // 시작일이 없으면 종료일을 시작일로 사용
  const startDate = task.start_date
    ? new Date(task.start_date)
    : new Date(task.end_date!);

  // 종료일이 없으면 시작일을 종료일로 사용
  const endDate = task.end_date
    ? new Date(task.end_date)
    : new Date(task.start_date!);

  return {
    id: task.id,
    title: task.title,
    start: startDate,
    end: endDate,
    resource: {
      taskId: task.id,
      projectId: task.project_id,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee_id,
    },
  };
}

/**
 * Task 배열을 Calendar Event 배열로 변환
 */
export function tasksToCalendarEvents(
  tasks: TaskForCalendar[]
): CalendarEvent[] {
  return tasks
    .map(taskToCalendarEvent)
    .filter((event): event is CalendarEvent => event !== null);
}
