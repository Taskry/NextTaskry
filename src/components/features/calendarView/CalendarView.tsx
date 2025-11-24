"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "@/types/kanban";
import Modal from "@/components/ui/Modal";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import { Icon } from "@/components/shared/Icon";

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

// 한글 메시지
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
  event: "이벤트",
  noEventsInRange: "이 기간에 이벤트가 없습니다.",
  showMore: (total: number) => `+${total}개 더보기`,
};

interface CalendarViewProps {
  tasks: Task[];
  boardId: string;
  projectId: string;
  onCreateTask?: (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  onSelectTask?: (task: Task) => void;
  onTaskCreated?: () => void;
}

export default function CalendarView({
  tasks = [],
  boardId,
  projectId,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onTaskCreated,
}: CalendarViewProps) {
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    started_at: string;
    ended_at: string;
  } | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedSlot, setLastClickedSlot] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<
    "month" | "week" | "day" | "agenda" | "work_week"
  >("month");

  const handleSelectSlot = (slot: any) => {
    // react-big-calendar의 end는 exclusive이므로 하루 빼기
    const startDate = new Date(slot.start);
    const endDate = new Date(slot.end);
    endDate.setDate(endDate.getDate() - 1); // 하루 빼기

    const slotKey = `${slot.start.getTime()}-${slot.end.getTime()}`;
    const now = Date.now();
    const timeDiff = now - lastClickTime;

    // 날짜 범위 계산 (드래그 감지)
    const daysDiff = Math.ceil(
      (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 드래그로 범위 선택 (2일 이상) 또는 더블클릭
    if (daysDiff > 1) {
      // 드래그로 범위 선택
      setSelectedDates({
        started_at: format(startDate, "yyyy-MM-dd"),
        ended_at: format(endDate, "yyyy-MM-dd"),
      });
      setShowTaskAddModal(true);
      setLastClickTime(0);
      setLastClickedSlot("");
    } else if (slotKey === lastClickedSlot && timeDiff < 300) {
      // 더블클릭 감지
      setSelectedDates({
        started_at: format(startDate, "yyyy-MM-dd"),
        ended_at: format(endDate, "yyyy-MM-dd"),
      });
      setShowTaskAddModal(true);
      setLastClickTime(0);
      setLastClickedSlot("");
    } else {
      // 첫 번째 클릭
      setLastClickTime(now);
      setLastClickedSlot(slotKey);
    }
  };

  const handleTaskAddSuccess = async (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    await onCreateTask?.(taskData);
    setShowTaskAddModal(false);
    setSelectedDates(null);
    onTaskCreated?.();
  };

  // 단축키 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Esc - 모달 닫기
      if (e.key === "Escape") {
        if (showTaskAddModal) {
          setShowTaskAddModal(false);
          setSelectedDates(null);
        }
        if (showTaskDetailModal) {
          setShowTaskDetailModal(false);
          setSelectedTask(null);
        }
        return;
      }

      // 모달이 이미 열려있으면 다른 단축키 무시
      if (showTaskAddModal || showTaskDetailModal) {
        return;
      }

      // input/textarea에 포커스가 있으면 무시
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // N - 새 작업 추가 (오늘 날짜) - code로 물리적 키 감지 (한글 입력시에도 작동)
      if (
        e.code === "KeyN" &&
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();
        const today = new Date();
        setSelectedDates({
          started_at: format(today, "yyyy-MM-dd"),
          ended_at: format(today, "yyyy-MM-dd"),
        });
        setShowTaskAddModal(true);
      }

      // 화살표 키 - 날짜 이동
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newDate = new Date(currentDate);
        if (currentView === "month") {
          newDate.setMonth(newDate.getMonth() - 1);
        } else if (currentView === "week") {
          newDate.setDate(newDate.getDate() - 7);
        } else if (currentView === "day") {
          newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const newDate = new Date(currentDate);
        if (currentView === "month") {
          newDate.setMonth(newDate.getMonth() + 1);
        } else if (currentView === "week") {
          newDate.setDate(newDate.getDate() + 7);
        } else if (currentView === "day") {
          newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showTaskAddModal, showTaskDetailModal, currentDate, currentView]);

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
    <>
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-hidden relative">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          messages={messages}
          culture="ko"
          date={currentDate}
          view={currentView}
          onNavigate={(date) => {
            setCurrentDate(date);
          }}
          onView={(view) => {
            setCurrentView(view);
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            setSelectedTask(event.task);
            setShowTaskDetailModal(true);
            onSelectTask?.(event.task);
          }}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          // ⭐⭐ 상태별 색상 적용 파트 (칸반보드 Badge와 동일) ⭐⭐
          eventPropGetter={(event) => {
            const isDark = document.documentElement.classList.contains("dark");
            let bg = isDark ? "#4B5563" : "#9CA3AF"; // todo (회색)

            if (event.task.status === "inprogress") {
              bg = isDark ? "#2563ebcc" : "#60a5facc"; // 진행중 - 파란색
            }
            if (event.task.status === "done") {
              bg = isDark ? "#16a34acc" : "#57bc71cc"; // 완료 - 초록색
            }

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
          components={{
            event: ({ event }) => {
              let priorityColor = "";
              if (event.task.priority === "high") {
                priorityColor = "text-red-300 dark:text-red-500";
              } else if (event.task.priority === "normal") {
                priorityColor = "text-yellow-300 dark:text-yellow-500";
              } else if (event.task.priority === "low") {
                priorityColor = "text-green-300 dark:text-green-500";
              }

              return (
                <div className="flex items-center gap-1">
                  {event.task.priority && (
                    <Icon
                      type="circleCheckFilled"
                      size={12}
                      className={priorityColor}
                    />
                  )}
                  <span className="truncate text-xs">{event.title}</span>
                </div>
              );
            },
          }}
        />
      </div>

      {/* TaskAdd 모달 */}
      {showTaskAddModal && selectedDates && (
        <Modal isOpen onClose={() => setShowTaskAddModal(false)}>
          <TaskAdd
            boardId={boardId}
            projectId={projectId}
            onSuccess={handleTaskAddSuccess}
            onCancel={() => setShowTaskAddModal(false)}
            initialStartDate={selectedDates.started_at}
            initialEndDate={selectedDates.ended_at}
          />
        </Modal>
      )}

      {/* TaskDetail 모달 */}
      {showTaskDetailModal && selectedTask && (
        <Modal
          isOpen
          onClose={() => {
            setShowTaskDetailModal(false);
            setSelectedTask(null);
          }}
        >
          <TaskDetail
            task={selectedTask}
            onUpdate={(taskId, updates) => {
              onUpdateTask?.(taskId, updates);
              onTaskCreated?.();
            }}
            onDelete={(taskId) => {
              onDeleteTask?.(taskId);
              setShowTaskDetailModal(false);
              setSelectedTask(null);
              onTaskCreated?.();
            }}
            onClose={() => {
              setShowTaskDetailModal(false);
              setSelectedTask(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}
