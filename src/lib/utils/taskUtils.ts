import { TaskStatus, TaskPriority } from "@/types";

/**
 * Task 관련 유틸리티 함수들
 */

// Task 상태별 색상 정의 (Tailwind CSS 다크모드 클래스 사용)
export const getTaskStatusColor = (status: TaskStatus) => {
  const colors = {
    todo: {
      bg: "bg-gray-400 dark:bg-gray-600",
      text: "text-gray-700 dark:text-gray-200",
      border: "border-gray-300 dark:border-gray-500",
    },
    inprogress: {
      bg: "bg-blue-400 dark:bg-blue-500",
      text: "text-blue-700 dark:text-blue-200",
      border: "border-blue-300 dark:border-blue-500",
    },
    done: {
      bg: "bg-green-400 dark:bg-green-600",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-300 dark:border-green-500",
    },
  };
  return colors[status];
}; // Task 우선순위별 색상 정의
export const getTaskPriorityColor = (
  priority: TaskPriority,
  isDark = false
) => {
  const colors = {
    high: {
      bg: isDark ? "bg-red-600" : "bg-red-500",
      text: isDark ? "text-red-300" : "text-red-600",
      icon: isDark ? "text-red-400" : "text-red-500",
    },
    normal: {
      bg: isDark ? "bg-yellow-600" : "bg-yellow-500",
      text: isDark ? "text-yellow-300" : "text-yellow-600",
      icon: isDark ? "text-yellow-400" : "text-yellow-500",
    },
    low: {
      bg: isDark ? "bg-green-600" : "bg-green-500",
      text: isDark ? "text-green-300" : "text-green-600",
      icon: isDark ? "text-green-400" : "text-green-500",
    },
  };
  return colors[priority];
};

// Task 상태별 라벨 정의
export const getTaskStatusLabel = (status: TaskStatus) => {
  const labels = {
    todo: "할 일",
    inprogress: "진행중",
    done: "완료",
  };
  return labels[status];
};

// Task 우선순위별 라벨 정의
export const getTaskPriorityLabel = (priority: TaskPriority) => {
  const labels = {
    high: "높음",
    normal: "보통",
    low: "낮음",
  };
  return labels[priority];
};

// Task 우선순위별 삼각형 아이콘 색상
export const getPriorityIconColor = (priority: TaskPriority) => {
  const colors = {
    high: "text-red-500 dark:text-red-400",
    normal: "text-yellow-500 dark:text-yellow-400",
    low: "text-green-500 dark:text-green-400",
  };
  return colors[priority] || "";
};

// 캘린더 이벤트용 색상 (react-big-calendar)
export const getCalendarEventColor = (status: TaskStatus, isDark = false) => {
  const colors = {
    todo: isDark ? "#4B5563" : "#9CA3AF", // 회색
    inprogress: isDark ? "#3B82F6" : "#60A5FA", // 파란색 (blue-500, blue-400)
    done: isDark ? "#16a34acc" : "#57bc71cc", // 초록색
  };
  return colors[status];
};

// 캘린더 바(박스) 스타일 - 연한 버전 (칸반보드와 통일)
export const getTaskStatusBarStyle = (status: TaskStatus) => {
  const styles = {
    todo: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-l-2 border-gray-400 dark:border-gray-500",
    inprogress:
      "bg-blue-100/50 dark:bg-blue-700/40 text-blue-700 dark:text-blue-200 border-l-2 border-blue-400 dark:border-blue-500",
    done: "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200 border-l-2 border-green-400 dark:border-green-500",
  };
  return styles[status] || styles.todo;
};

// 캘린더 도트 색상 (칸반보드와 통일)
export const getTaskStatusDotColor = (status: TaskStatus) => {
  const colors = {
    todo: "bg-gray-400 dark:bg-gray-500",
    inprogress: "bg-blue-400 dark:bg-blue-500",
    done: "bg-green-400 dark:bg-green-500",
  };
  return colors[status] || colors.todo;
};

// 캘린더 호버 리스트용 배경색 (칸반보드와 통일)
export const getTaskStatusBgColor = (status: TaskStatus) => {
  const styles = {
    todo: "bg-gray-50/80 dark:bg-gray-700/50",
    inprogress: "bg-blue-50/50 dark:bg-blue-900/20",
    done: "bg-green-50/50 dark:bg-green-900/20",
  };
  return styles[status] || styles.todo;
};

// 태스크가 지연 상태인지 확인 (완료되지 않고 종료일이 지남)
export const isTaskOverdue = (task: {
  status?: string;
  ended_at?: string | null;
}) => {
  if (!task.ended_at || task.status === "done") return false;

  const today = new Date().toISOString().split("T")[0];
  const endDate = task.ended_at.split("T")[0];

  return endDate < today;
};

// Task 완료율 계산
export const getTaskProgress = (subtasks?: any[]) => {
  if (!subtasks || subtasks.length === 0) return 0;

  const completedCount = subtasks.filter((subtask) => subtask.completed).length;
  return Math.round((completedCount / subtasks.length) * 100);
};

// Task 마감일 상태 확인
export const getTaskDeadlineStatus = (endedAt?: string) => {
  if (!endedAt) return null;

  const today = new Date();
  const deadline = new Date(endedAt);
  const diffDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue"; // 지연
  if (diffDays <= 1) return "urgent"; // 급함
  if (diffDays <= 3) return "warning"; // 주의
  return "normal"; // 정상
};
