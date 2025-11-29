"use client";

// React 및 라이브러리
import { useCallback, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// 타입
import { Task } from "@/types/kanban";

// 컴포넌트
import Modal from "@/components/ui/Modal";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import CalendarHeader from "@/components/features/calendarView/components/CalendarHeader";
import CalendarHelp from "@/components/features/calendarView/components/CalendarHelp";
import WeekHeader from "@/components/features/calendarView/components/WeekHeader";
import DayHeader from "@/components/features/calendarView/components/DayHeader";
import MonthHeader from "@/components/features/calendarView/components/MonthHeader";
import MonthDateHeader from "@/components/features/calendarView/components/MonthDateHeader";
import TimeColumnHeader from "@/components/features/calendarView/components/TimeColumnHeader";
import TimeSlotWrapper from "@/components/features/calendarView/components/TimeSlotWrapper";

// Hooks
import { useCalendarState } from "@/hooks/calendar/useCalendarState";
import { useCalendarEvents } from "@/hooks/calendar/useCalendarEvents";
import { useCalendarKeyboard } from "@/hooks/calendar/useCalendarKeyboard";

// 유틸
import { getDaysDiff } from "@/lib/utils/dateUtils";
import { getCalendarEventColor } from "@/lib/utils/taskUtils";

// 상수
import {
  CALENDAR_MESSAGES,
  CALENDAR_TIME_CONFIG,
  CALENDAR_INTERACTION_CONFIG,
} from "./constants/calendarConfig";

// Localizer 설정
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
  boardId: string;
  project?: {
    project_id?: string;
    project_name: string;
    started_at?: string;
    ended_at?: string;
  } | null;
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
  project,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onTaskCreated,
}: CalendarViewProps) {
  // 프로젝트 정보 추출
  const projectId = project?.project_id || "";
  const projectName = project?.project_name || "이름 없는 프로젝트";
  const projectStartedAt = project?.started_at;
  const projectEndedAt = project?.ended_at;

  console.log("CalendarView - Project Info:", {
    project,
    projectName,
    projectStartedAt,
    projectEndedAt,
    boardId,
    projectId,
  });

  // 상태 관리
  const {
    showTaskAddModal,
    setShowTaskAddModal,
    showTaskDetailModal,
    setShowTaskDetailModal,
    selectedTask,
    setSelectedTask,
    selectedDates,
    setSelectedDates,
    showHelp,
    setShowHelp,
    currentDate,
    setCurrentDate,
    currentView,
    setCurrentView,
    currentTime,
  } = useCalendarState();

  // 이벤트 변환
  const events = useCalendarEvents(tasks);

  // 키보드 단축키
  useCalendarKeyboard({
    showTaskAddModal,
    showTaskDetailModal,
    currentDate,
    currentView,
    setShowTaskAddModal,
    setShowTaskDetailModal,
    setSelectedTask,
    setSelectedDates,
    setCurrentDate,
    setCurrentView,
  });

  // 더블클릭 감지 상태 (로컬)
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedSlot, setLastClickedSlot] = useState<string>("");

  /**
   * 프로젝트 기간 범위 체크 함수
   */
  const isOutsideProjectRange = useCallback(
    (date: Date) => {
      if (!projectStartedAt || !projectEndedAt) return false;

      const dateStr = format(date, "yyyy-MM-dd");
      return dateStr < projectStartedAt || dateStr > projectEndedAt;
    },
    [projectStartedAt, projectEndedAt]
  );

  /**
   * 슬롯 선택 핸들러 (더블클릭 또는 드래그)
   */
  const handleSelectSlot = useCallback(
    (slot: any) => {
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);
      endDate.setDate(endDate.getDate() - 1);

      // 프로젝트 범위 밖 날짜 체크
      if (isOutsideProjectRange(startDate) || isOutsideProjectRange(endDate)) {
        // 여기에 토스트 메시지 추가할 수 있음
        console.warn("프로젝트 기간 밖의 날짜는 선택할 수 없습니다.");
        return;
      }

      const slotKey = `${slot.start.getTime()}-${slot.end.getTime()}`;
      const now = Date.now();
      const timeDiff = now - lastClickTime;
      const daysDiff = getDaysDiff(slot.start, slot.end);

      const shouldOpenModal =
        daysDiff > 1 ||
        (slotKey === lastClickedSlot &&
          timeDiff < CALENDAR_INTERACTION_CONFIG.doubleClickThreshold);

      if (shouldOpenModal) {
        setSelectedDates({
          started_at: format(startDate, "yyyy-MM-dd"),
          ended_at: format(endDate, "yyyy-MM-dd"),
        });
        setShowTaskAddModal(true);
        setLastClickTime(0);
        setLastClickedSlot("");
      } else {
        setLastClickTime(now);
        setLastClickedSlot(slotKey);
      }
    },
    [
      lastClickTime,
      lastClickedSlot,
      setSelectedDates,
      setShowTaskAddModal,
      setLastClickTime,
      setLastClickedSlot,
      isOutsideProjectRange,
    ]
  );

  /**
   * Task 추가 성공 핸들러
   */
  const handleTaskAddSuccess = useCallback(
    async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
      await onCreateTask?.(taskData);
      setShowTaskAddModal(false);
      setSelectedDates(null);
      onTaskCreated?.();
    },
    [onCreateTask, onTaskCreated, setShowTaskAddModal, setSelectedDates]
  );

  /**
   * 이벤트 선택 핸들러
   */
  const handleSelectEvent = useCallback(
    (event: any) => {
      setSelectedTask(event.task);
      setShowTaskDetailModal(true);
      onSelectTask?.(event.task);
    },
    [onSelectTask, setSelectedTask, setShowTaskDetailModal]
  );

  /**
   * 이벤트 스타일링
   */
  const eventStyleGetter = useCallback((event: any) => {
    const isDark = document.documentElement.classList.contains("dark");
    const backgroundColor = getCalendarEventColor(event.task.status, isDark);
    const isHighPriority = event.task.priority === "high";

    return {
      style: {
        backgroundColor,
        color: isDark ? "#f3f4f6" : "#ffffff",
        border: `1px solid ${backgroundColor}`,
        borderLeft: `4px solid ${backgroundColor}`,
        borderRadius: "6px",
        fontWeight: isHighPriority ? "600" : "500",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    };
  }, []);

  return (
    <>
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* 캘린더 헤더 */}
        <CalendarHeader
          projectName={projectName}
          projectStartedAt={projectStartedAt}
          projectEndedAt={projectEndedAt}
          currentView={currentView}
          currentDate={currentDate}
          eventsCount={events.length}
          showHelp={showHelp}
          onToggleHelp={() => setShowHelp(!showHelp)}
        />

        {/* 도움말 */}
        {showHelp && <CalendarHelp />}

        {/* 캘린더 본체 */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            {/* 뷰별 안내 텍스트 */}
            {currentView !== "month" && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {currentView === "week" &&
                    "더블클릭하거나 드래그하여 일정을 추가하세요"}
                  {currentView === "day" &&
                    "시간대를 선택하여 세부 일정을 관리하세요"}
                  {currentView === "agenda" &&
                    "일정 목록을 확인하고 클릭하여 상세보기"}
                </div>
              </div>
            )}

            <Calendar
              localizer={localizer}
              events={events}
              selectable
              messages={CALENDAR_MESSAGES}
              culture="ko"
              date={currentDate}
              view={currentView}
              onNavigate={setCurrentDate}
              onView={setCurrentView}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              min={CALENDAR_TIME_CONFIG.minTime}
              max={CALENDAR_TIME_CONFIG.maxTime}
              step={CALENDAR_TIME_CONFIG.step}
              timeslots={CALENDAR_TIME_CONFIG.timeslots}
              scrollToTime={CALENDAR_TIME_CONFIG.scrollToTime}
              dayLayoutAlgorithm="overlap"
              popup
              popupOffset={{ x: 10, y: 10 }}
              showMultiDayTimes
              views={["month", "week", "day", "agenda"]}
              getNow={() => currentTime}
              // 프로젝트 기간 제한
              {...(projectStartedAt && {
                minDate: new Date(projectStartedAt),
              })}
              {...(projectEndedAt && {
                maxDate: new Date(projectEndedAt),
              })}
              style={{ height: "100%" }}
              eventPropGetter={eventStyleGetter}
              components={{
                month: {
                  header: MonthHeader,
                  dateHeader: (props: any) => (
                    <MonthDateHeader
                      {...props}
                      projectStartedAt={projectStartedAt}
                      projectEndedAt={projectEndedAt}
                    />
                  ),
                },
                week: {
                  header: (props: any) => (
                    <WeekHeader
                      {...props}
                      projectStartedAt={projectStartedAt}
                      projectEndedAt={projectEndedAt}
                    />
                  ),
                },
                day: {
                  header: (props: any) => (
                    <DayHeader
                      {...props}
                      projectStartedAt={projectStartedAt}
                      projectEndedAt={projectEndedAt}
                    />
                  ),
                },
                timeGutterHeader: TimeColumnHeader,
                timeSlotWrapper: TimeSlotWrapper,
              }}
            />
          </div>
        </div>
      </div>

      {/* TaskAdd 모달 */}
      {showTaskAddModal && selectedDates && (
        <Modal
          isOpen
          onClose={() => {
            setShowTaskAddModal(false);
            setSelectedDates(null);
          }}
        >
          <TaskAdd
            boardId={boardId}
            projectId={projectId}
            onSuccess={handleTaskAddSuccess}
            onCancel={() => {
              setShowTaskAddModal(false);
              setSelectedDates(null);
            }}
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
            task={{
              ...selectedTask,
              project_id: selectedTask.project_id || projectId,
            }}
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
