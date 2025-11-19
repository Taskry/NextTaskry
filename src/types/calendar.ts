// 캘린더 이벤트 타입
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    taskId: string;
    projectId: string;
    status: "todo" | "inprogress" | "done";
    priority: "low" | "normal" | "high";
    assignee?: string;
  };
}

// Task를 CalendarEvent로 변환하기 위한 Task 타입 (기존 Task 타입과 호환)
export interface TaskForCalendar {
  id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  project_id: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "normal" | "high";
  assignee_id?: string;
}
