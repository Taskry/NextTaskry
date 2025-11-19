export const KANBAN_COLUMNS = [
  { id: "todo", title: "할 일", status: "todo" },
  { id: "inprogress", title: "진행 중", status: "inprogress" },
  { id: "done", title: "완료", status: "done" },
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-200 text-gray-800",
  medium: "bg-yellow-200 text-yellow-800",
  high: "bg-red-200 text-red-800",
  normal: "bg-blue-200 text-blue-800",
} as const;
