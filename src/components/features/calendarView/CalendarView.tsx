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

    console.log(
      "📅 선택한 날짜:",
      format(startDate, "yyyy-MM-dd") + " ~ " + format(endDate, "yyyy-MM-dd"),
      `(${daysDiff}일)`
    );

    // 드래그로 범위 선택 (2일 이상) 또는 더블클릭
    if (daysDiff > 1) {
      // 드래그로 범위 선택
      console.log("📌 범위 선택 감지!");
      setSelectedDates({
        started_at: format(startDate, "yyyy-MM-dd"),
        ended_at: format(endDate, "yyyy-MM-dd"),
      });
      setShowTaskAddModal(true);
      setLastClickTime(0);
      setLastClickedSlot("");
    } else if (slotKey === lastClickedSlot && timeDiff < 300) {
      // 더블클릭 감지
      console.log("🎯 더블클릭 감지!");
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
      // n 키를 누르면 오늘 날짜로 모달 열기
      if (e.key === "n" || e.key === "N") {
        console.log(
          "🎹 n 키 감지, 활성 요소:",
          document.activeElement?.tagName
        );

        // 모달이 이미 열려있으면 무시
        if (showTaskAddModal || showTaskDetailModal) {
          console.log("⚠️ 모달이 이미 열려있음");
          return;
        }

        // input이나 textarea에 포커스가 있으면 무시
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          console.log("⚠️ input/textarea에 포커스 있음");
          return;
        }

        // 기본 동작 방지 (문자 입력 방지)
        e.preventDefault();
        e.stopPropagation();

        console.log("✅ TaskAdd 모달 열기");
        const today = new Date();
        setSelectedDates({
          started_at: format(today, "yyyy-MM-dd"),
          ended_at: format(today, "yyyy-MM-dd"),
        });
        setShowTaskAddModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showTaskAddModal, showTaskDetailModal]);

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
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          messages={messages}
          culture="ko"
          date={currentDate}
          view={currentView}
          onNavigate={(date) => {
            console.log("📆 날짜 네비게이션:", format(date, "yyyy-MM-dd"));
            setCurrentDate(date);
          }}
          onView={(view) => {
            console.log("👁️ 뷰 변경:", view);
            setCurrentView(view);
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            console.log("📌 Task 클릭:", event.task);
            setSelectedTask(event.task);
            setShowTaskDetailModal(true);
            onSelectTask?.(event.task);
          }}
          startAccessor="start"
          endAccessor="end"
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
