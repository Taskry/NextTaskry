"use client";

// React 및 라이브러리
import { useCallback, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

// 타입
import { Task, TaskPriority } from "@/types/kanban";

// 컴포넌트
import Modal from "@/components/ui/Modal";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import CalendarHeader from "@/components/features/calendarView/components/CalendarHeader";
import CalendarHelp from "@/components/features/calendarView/components/CalendarHelp";
import CalendarStats from "@/components/features/calendarView/components/CalendarStats";
import CalendarFilter from "@/components/features/calendarView/components/CalendarFilter";
import CalendarNavigation from "@/components/features/calendarView/components/CalendarNavigation";
import WeekView from "@/components/features/calendarView/weekViews";
import MonthView from "@/components/features/calendarView/monthViews";
import DayView from "@/components/features/calendarView/dayViews";
import AgendaView from "@/components/features/calendarView/agendaViews";

// Hooks
import { useCalendarState } from "@/hooks/calendar/useCalendarState";
import { useCalendarKeyboard } from "@/hooks/calendar/useCalendarKeyboard";

// 유틸
import { showToast } from "@/lib/utils/toast";

// 필터 인터페이스
interface CalendarFilter {
  priority: TaskPriority | "all";
  assignee: "all" | "assigned" | "unassigned" | "me";
  date: "all" | "today" | "thisWeek" | "overdue";
}

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
  onProjectInfoClick?: () => void;
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
  onProjectInfoClick,
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
  } = useCalendarState({
    projectStartedAt,
    projectEndedAt,
  });

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

  // 필터 상태
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<CalendarFilter>({
    priority: "all",
    assignee: "all",
    date: "all",
  });

  // 세션 정보
  const { data: session } = useSession();

  /**
   * 필터링된 태스크 목록
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 우선순위 필터
      if (filter.priority !== "all" && task.priority !== filter.priority) {
        return false;
      }

      // 담당자 필터
      if (filter.assignee !== "all") {
        switch (filter.assignee) {
          case "assigned":
            if (!task.assigned_user_id) return false;
            break;
          case "unassigned":
            if (task.assigned_user_id) return false;
            break;
          case "me":
            if (
              !session?.user?.user_id ||
              task.assigned_user_id !== session.user.user_id
            )
              return false;
            break;
        }
      }

      // 날짜 필터
      if (filter.date !== "all") {
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");

        switch (filter.date) {
          case "today":
            // 오늘이 일정 범위(시작~종료) 안에 포함되어야 함
            if (task.started_at && task.ended_at) {
              const taskStartStr = task.started_at.split("T")[0];
              const taskEndStr = task.ended_at.split("T")[0];
              // 오늘이 시작일 이후이고, 종료일 이전이어야 함
              if (todayStr < taskStartStr || todayStr > taskEndStr)
                return false;
            } else {
              // 시작일/종료일이 없으면 제외
              return false;
            }
            break;
          case "thisWeek":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            const weekStartStr = format(weekStart, "yyyy-MM-dd");
            const weekEndStr = format(weekEnd, "yyyy-MM-dd");

            if (task.started_at && task.ended_at) {
              const taskStartStr = task.started_at.split("T")[0];
              const taskEndStr = task.ended_at.split("T")[0];
              // 일정과 이번 주가 겹치는지 확인
              if (taskEndStr < weekStartStr || taskStartStr > weekEndStr)
                return false;
            } else {
              return false;
            }
            break;
          case "overdue":
            if (task.status === "done") return false;
            if (!task.ended_at) return false;
            const taskEndStr2 = task.ended_at.split("T")[0];
            if (taskEndStr2 >= todayStr) return false;
            break;
        }
      }

      return true;
    });
  }, [tasks, filter, session]);

  /**
   * 필터 변경 핸들러
   */
  const handleFilterChange = useCallback(
    (newFilter: Partial<CalendarFilter>) => {
      setFilter((prev) => ({ ...prev, ...newFilter }));
    },
    []
  );

  /**
   * 네비게이션 핸들러 (날짜 이동 제한 포함)
   */
  const handleNavigate = useCallback(
    (newDate: Date) => {
      console.log(
        "handleNavigate:",
        newDate,
        currentView,
        projectStartedAt,
        projectEndedAt
      );
      // 프로젝트 기간이 설정되지 않은 경우 제한 없음
      if (!projectStartedAt && !projectEndedAt) {
        console.log("프로젝트 기간 미설정 - 날짜 이동 허용");
        setCurrentDate(newDate);
        return;
      }

      const minDate = new Date(projectStartedAt!);
      const maxDate = new Date(projectEndedAt!);

      // 뷰에 따라 다르게 체크
      if (currentView === "month") {
        // 월 뷰: 해당 월의 1일 기준
        const checkDate = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          1
        );
        const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

        console.log("월 뷰 - 날짜 이동 체크:", {
          minDate,
          maxDate,
          newDate,
        });

        if (checkDate < minMonth || checkDate > maxMonth) {
          showToast("프로젝트 기간을 확인하세요.", "warning");
          return;
        }
      } else {
        // 주, 일, 일정 뷰: 해당 날짜 기준
        if (newDate < minDate || newDate > maxDate) {
          showToast("프로젝트 기간을 확인하세요.", "warning");
          return;
        }
      }
      setCurrentDate(newDate);
    },
    [projectStartedAt, projectEndedAt, currentView, setCurrentDate]
  );

  /**
   * Task 추가 성공 핸들러
   */
  const handleTaskAddSuccess = useCallback(
    async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
      await onCreateTask?.(taskData);
      setShowTaskAddModal(false);
      setSelectedDates(null);
      // onTaskCreated 호출 제거 - handleCreateTask에서 이미 로컬 상태 업데이트함
    },
    [onCreateTask, setShowTaskAddModal, setSelectedDates]
  );

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
          eventsCount={filteredTasks.length}
          showHelp={showHelp}
          showFilter={showFilter}
          onToggleHelp={() => setShowHelp(!showHelp)}
          onToggleFilter={() => setShowFilter(!showFilter)}
          onProjectInfoClick={onProjectInfoClick}
          onAddTask={() => {
            const today = new Date();
            setSelectedDates({
              started_at: format(today, "yyyy-MM-dd"),
              ended_at: format(today, "yyyy-MM-dd"),
            });
            setShowTaskAddModal(true);
          }}
        />

        {/* 도움말 */}
        {showHelp && <CalendarHelp />}

        {/* 필터 */}
        {showFilter && (
          <div className="px-2 sm:px-4">
            <CalendarFilter
              filter={filter}
              onFilterChange={handleFilterChange}
              taskCount={filteredTasks.length}
              totalCount={tasks.length}
            />
          </div>
        )}

        {/* 캘린더 본체 */}
        <div className="flex-1 min-h-0 flex flex-col p-2 sm:p-3">
          {currentView === "week" ? (
            // 커스텀 주간 뷰
            <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {/* 네비게이션 툴바 */}
              <CalendarNavigation
                currentDate={currentDate}
                currentView={currentView}
                onNavigate={handleNavigate}
                onViewChange={setCurrentView}
              />
              <WeekView
                tasks={filteredTasks}
                currentDate={currentDate}
                projectStartedAt={projectStartedAt}
                projectEndedAt={projectEndedAt}
                onSelectSlot={(
                  startDate: Date,
                  endDate: Date,
                  startHour?: number,
                  endHour?: number
                ) => {
                  // 프로젝트 종료 체크
                  if (projectEndedAt) {
                    const today = new Date().toISOString().split("T")[0];
                    if (today > projectEndedAt) {
                      showToast("종료된 프로젝트입니다.", "warning");
                      return;
                    }
                  }

                  setSelectedDates({
                    started_at: format(startDate, "yyyy-MM-dd"),
                    ended_at: format(endDate, "yyyy-MM-dd"),
                    start_time:
                      startHour !== undefined
                        ? `${startHour.toString().padStart(2, "0")}:00`
                        : undefined,
                    end_time:
                      endHour !== undefined
                        ? `${endHour.toString().padStart(2, "0")}:00`
                        : undefined,
                  });
                  setShowTaskAddModal(true);
                }}
                onSelectEvent={(task) => {
                  setSelectedTask(task);
                  setShowTaskDetailModal(true);
                  onSelectTask?.(task);
                }}
              />
            </div>
          ) : currentView === "month" ? (
            // 커스텀 월간 뷰
            <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {/* 네비게이션 툴바 */}
              <CalendarNavigation
                currentDate={currentDate}
                currentView={currentView}
                onNavigate={handleNavigate}
                onViewChange={setCurrentView}
              />
              <MonthView
                tasks={filteredTasks}
                currentDate={currentDate}
                projectStartedAt={projectStartedAt}
                projectEndedAt={projectEndedAt}
                onSelectSlot={(date: Date) => {
                  // 프로젝트 종료 체크
                  if (projectEndedAt) {
                    const today = new Date().toISOString().split("T")[0];
                    if (today > projectEndedAt) {
                      showToast("종료된 프로젝트입니다.", "warning");
                      return;
                    }
                  }

                  setSelectedDates({
                    started_at: format(date, "yyyy-MM-dd"),
                    ended_at: format(date, "yyyy-MM-dd"),
                  });
                  setShowTaskAddModal(true);
                }}
                onSelectRange={(startDate: Date, endDate: Date) => {
                  // 프로젝트 종료 체크
                  if (projectEndedAt) {
                    const today = new Date().toISOString().split("T")[0];
                    if (today > projectEndedAt) {
                      showToast("종료된 프로젝트입니다.", "warning");
                      return;
                    }
                  }

                  // 드래그로 날짜 범위 선택
                  setSelectedDates({
                    started_at: format(startDate, "yyyy-MM-dd"),
                    ended_at: format(endDate, "yyyy-MM-dd"),
                  });
                  setShowTaskAddModal(true);
                }}
                onSelectEvent={(task) => {
                  setSelectedTask(task);
                  setShowTaskDetailModal(true);
                  onSelectTask?.(task);
                }}
              />
            </div>
          ) : currentView === "day" ? (
            // 커스텀 일간 뷰
            <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {/* 네비게이션 툴바 */}
              <CalendarNavigation
                currentDate={currentDate}
                currentView={currentView}
                onNavigate={handleNavigate}
                onViewChange={setCurrentView}
              />
              <DayView
                tasks={filteredTasks}
                currentDate={currentDate}
                projectStartedAt={projectStartedAt}
                projectEndedAt={projectEndedAt}
                onSelectSlot={(
                  date: Date,
                  startHour?: number,
                  endHour?: number
                ) => {
                  // 프로젝트 종료 체크
                  if (projectEndedAt) {
                    const today = new Date().toISOString().split("T")[0];
                    if (today > projectEndedAt) {
                      showToast("종료된 프로젝트입니다.", "warning");
                      return;
                    }
                  }

                  setSelectedDates({
                    started_at: format(date, "yyyy-MM-dd"),
                    ended_at: format(date, "yyyy-MM-dd"),
                    start_time:
                      startHour !== undefined
                        ? `${startHour.toString().padStart(2, "0")}:00`
                        : undefined,
                    end_time:
                      endHour !== undefined
                        ? `${endHour.toString().padStart(2, "0")}:00`
                        : undefined,
                  });
                  setShowTaskAddModal(true);
                }}
                onSelectEvent={(task) => {
                  setSelectedTask(task);
                  setShowTaskDetailModal(true);
                  onSelectTask?.(task);
                }}
              />
            </div>
          ) : (
            // 커스텀 일정(Agenda) 뷰
            <div className="h-full flex flex-col rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {/* 네비게이션 툴바 */}
              <CalendarNavigation
                currentDate={currentDate}
                currentView={currentView}
                onNavigate={handleNavigate}
                onViewChange={setCurrentView}
              />
              <AgendaView
                tasks={filteredTasks}
                currentDate={currentDate}
                projectStartedAt={projectStartedAt}
                projectEndedAt={projectEndedAt}
                onSelectSlot={(date: Date) => {
                  // 프로젝트 종료 체크
                  if (projectEndedAt) {
                    const today = new Date().toISOString().split("T")[0];
                    if (today > projectEndedAt) {
                      showToast("종료된 프로젝트입니다.", "warning");
                      return;
                    }
                  }

                  setSelectedDates({
                    started_at: format(date, "yyyy-MM-dd"),
                    ended_at: format(date, "yyyy-MM-dd"),
                  });
                  setShowTaskAddModal(true);
                }}
                onSelectEvent={(task) => {
                  setSelectedTask(task);
                  setShowTaskDetailModal(true);
                  onSelectTask?.(task);
                }}
              />
            </div>
          )}
        </div>

        {/* 하단: 통계 */}
        <div className="sm:hidden">
          <CalendarStats tasks={filteredTasks} compact />
        </div>
        <div className="hidden sm:block">
          <CalendarStats tasks={filteredTasks} />
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
            projectStartedAt={projectStartedAt}
            projectEndedAt={projectEndedAt}
            onSuccess={handleTaskAddSuccess}
            onCancel={() => {
              setShowTaskAddModal(false);
              setSelectedDates(null);
            }}
            initialStartDate={selectedDates.started_at}
            initialEndDate={selectedDates.ended_at}
            initialStartTime={selectedDates.start_time}
            initialEndTime={selectedDates.end_time}
            initialUseTime={
              !!(selectedDates.start_time || selectedDates.end_time)
            }
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
            projectStartedAt={projectStartedAt}
            projectEndedAt={projectEndedAt}
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
