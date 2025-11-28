// src/components/features/calendarView/CalendarView.tsx

"use client";

// React Hooks - 상태 관리 및 최적화
import { useState, useEffect, useCallback, useMemo } from "react";

// react-big-calendar - 구글 캘린더 스타일의 캘린더 라이브러리
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";

// date-fns - 날짜 처리 라이브러리 (moment.js의 경량 대안)
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale"; // 한국어 로케일

// react-big-calendar CSS - 기본 스타일링
import "react-big-calendar/lib/css/react-big-calendar.css";

// 내부 모듈들
import { Task } from "@/types/kanban"; // 태스크 타입 정의
import Modal from "@/components/ui/Modal"; // 모달 컴포넌트
import TaskAdd from "@/components/features/task/add/TaskAdd"; // 태스크 추가 폼
import TaskDetail from "@/components/features/task/detail/TaskDetail"; // 태스크 상세보기
import { getCalendarEventColor } from "@/lib/utils/taskUtils"; // 색상 유틸리티

/**
 * 📅 캘린더 이벤트 인터페이스
 *
 * react-big-calendar가 요구하는 형식에 맞춰 Task 데이터를 변환한 구조
 * - Task 객체를 캘린더가 이해할 수 있는 Event 형태로 매핑
 * - 원본 Task 정보는 task 필드에 보존하여 상세보기/수정 시 사용
 */
interface CalendarEvent {
  id: string; // 고유 식별자 (Task.id와 동일)
  title: string; // 캘린더에 표시될 제목 (Task.title)
  start: Date; // 시작 날짜 (Task.created_at 또는 Task.started_at)
  end: Date; // 종료 날짜 (Task.ended_at 또는 start + 1일)
  task: Task; // 원본 Task 객체 (상세 정보 접근용)
  allDay: boolean; // 종일 이벤트 여부 (현재는 모든 태스크가 종일)
}

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date()),
  getDay,
  locales,
});

const CALENDAR_MESSAGES = {
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

const CALENDAR_CONFIG = {
  minTime: new Date(0, 0, 0, 6, 0, 0), // 오전 6시
  maxTime: new Date(0, 0, 0, 23, 59, 0), // 오후 11시 59분
  scrollToTime: new Date(0, 0, 0, 8, 0, 0), // 오전 8시로 스크롤
  step: 15, // 15분 단위
  timeslots: 4, // 1시간당 4개 슬롯
  doubleClickThreshold: 300, // 더블클릭 감지 시간(ms)
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
  // 모달 상태
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    started_at: string;
    ended_at: string;
  } | null>(null);

  // UI 상태 관리
  const [showHelp, setShowHelp] = useState(false);

  // 더블클릭 감지 상태
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedSlot, setLastClickedSlot] = useState<string>("");

  // 캘린더 뷰 상태
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트 (1분마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  /**
   *  슬롯 선택 핸들러 (더블클릭 또는 드래그)
   */
  const handleSelectSlot = useCallback(
    (slot: any) => {
      const startDate = new Date(slot.start);
      const endDate = new Date(slot.end);
      endDate.setDate(endDate.getDate() - 1);

      const slotKey = `${slot.start.getTime()}-${slot.end.getTime()}`;
      const now = Date.now();
      const timeDiff = now - lastClickTime;
      const daysDiff = Math.ceil(
        (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60 * 24)
      );

      // [발표2] 더블클릭 vs 드래그 구분 로직
      const shouldOpenModal =
        daysDiff > 1 || // 드래그로 범위 선택
        (slotKey === lastClickedSlot &&
          timeDiff < CALENDAR_CONFIG.doubleClickThreshold); // 더블클릭

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
    [lastClickTime, lastClickedSlot, setSelectedDates, setShowTaskAddModal]
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
   * 🎯 키보드 단축키 (ESC, Ctrl+N, 방향키)
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC: 모달 닫기
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

      // 모달이 열려있거나 input/textarea에 포커스가 있으면 무시
      if (
        showTaskAddModal ||
        showTaskDetailModal ||
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Ctrl/Cmd + N: 새 작업 추가
      if (
        e.code === "KeyN" &&
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        const today = new Date();
        setSelectedDates({
          started_at: format(today, "yyyy-MM-dd"),
          ended_at: format(today, "yyyy-MM-dd"),
        });
        setShowTaskAddModal(true);
        return;
      }

      // Arrow Left/Right: 날짜 이동
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const newDate = new Date(currentDate);
        const direction = e.key === "ArrowLeft" ? -1 : 1;

        if (currentView === "month") {
          newDate.setMonth(newDate.getMonth() + direction);
        } else if (currentView === "week") {
          newDate.setDate(newDate.getDate() + 7 * direction);
        } else if (currentView === "day") {
          newDate.setDate(newDate.getDate() + direction);
        }

        setCurrentDate(newDate);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showTaskAddModal, showTaskDetailModal, currentDate, currentView]);

  /**
   * 🎯 [발표4] Tasks → Calendar Events 변환 (시간 vs 종일) - 리얼타임 업데이트 대응
   *
   * 🔄 useMemo 사용 이유:
   * - tasks prop이 변경될 때마다 events 재계산
   * - 리얼타임 업데이트 시 캘린더 뷰 자동 갱신
   * - 불필요한 재계산 방지로 성능 최적화
   */
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

        // 담당자 정보를 포함한 제목 구성 (안전하게 처리)
        // assignee 정보가 완전히 로드된 경우에만 표시
        const assigneeInfo = (t as any).assignee?.name ? ` (👤${(t as any).assignee.name})` : "";
        const title = `${t.title}${assigneeInfo}`;

        return {
          id: t.id,
          title,
          start,
          end,
          task: t,
          allDay: !t.use_time,
        };
      });
  }, [tasks]); // tasks가 변경될 때마다 재계산

  /**
   * 🎯 [발표5] 이벤트 스타일링 (상태별 색상 + 우선순위)
   */
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
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

  /**
   * 🎯 [발표6] 주간 뷰 헤더 커스텀 (오늘 날짜 강조)
   */
  const WeekHeader = useCallback(({ date, localizer }: any) => {
    const isToday =
      format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

    return (
      <div
        className={`text-center py-2 ${
          isToday
            ? "bg-blue-50 dark:bg-blue-900/20 font-bold text-blue-600 dark:text-blue-400"
            : ""
        }`}
      >
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {localizer.format(date, "E", "ko")}
        </div>
        <div
          className={`text-lg ${
            isToday
              ? "bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
              : ""
          }`}
        >
          {localizer.format(date, "d")}
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* 캘린더 헤더 */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 mb-2 sm:mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white dark:text-gray-100">
            캘린더
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-sm font-medium text-white/90 dark:text-gray-200 text-right">
              <div>{events.length}개 일정</div>
              <div className="text-xs text-white/70 dark:text-gray-300">
                {format(currentDate, "yyyy년 M월", { locale: ko })}
              </div>
            </div>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title={showHelp ? "도움말 닫기" : "도움말 열기"}
            >
              <svg
                className={`w-4 h-4 text-white transition-transform duration-300 ${
                  showHelp ? "scale-110" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 도움말 영역 */}
        {showHelp && (
          <div className="mx-4 mb-4 px-4 py-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm space-y-3">
            {/* 기본 사용법 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📅 기본 사용법
                </h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>날짜 더블클릭: 새 일정 추가</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>드래그: 기간 선택하여 추가</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>일정 클릭: 상세보기/수정</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ⌨️ 키보드 단축키
                </h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                        Ctrl
                      </kbd>
                      <span>+</span>
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                        N
                      </kbd>
                    </div>
                    <span>새 일정 추가</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                      ESC
                    </kbd>
                    <span>모달 닫기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                        ←
                      </kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                        →
                      </kbd>
                    </div>
                    <span>날짜 이동</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 일정 색상 가이드 */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🎨 일정 상태별 색상
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded border"></div>
                  <span className="text-gray-600 dark:text-gray-400">할일</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded border"></div>
                  <span className="text-gray-600 dark:text-gray-400">진행중</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded border"></div>
                  <span className="text-gray-600 dark:text-gray-400">완료</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded border"></div>
                  <span className="text-gray-600 dark:text-gray-400">보류</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 캘린더 본체 */}
        <div className="flex-1 p-4 overflow-hidden">
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
          min={CALENDAR_CONFIG.minTime}
          max={CALENDAR_CONFIG.maxTime}
          step={CALENDAR_CONFIG.step}
          timeslots={CALENDAR_CONFIG.timeslots}
          scrollToTime={CALENDAR_CONFIG.scrollToTime}
          dayLayoutAlgorithm="overlap"
          popup
          popupOffset={{ x: 10, y: 10 }}
          showMultiDayTimes
          views={["month", "week", "day", "agenda"]}
          getNow={() => currentTime}
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          components={{
            week: { header: WeekHeader },
            timeGutterHeader: () => (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                시간
              </div>
            ),
          }}
        />
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
              project_id: selectedTask.project_id || projectId, // project_id 보장
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
