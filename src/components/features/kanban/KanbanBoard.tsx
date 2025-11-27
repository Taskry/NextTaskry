"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KANBAN_COLUMNS } from "@/lib/constants";
<<<<<<< HEAD
import {  Task, TaskStatus } from "@/types";
=======
import { ProjectRole, Task, TaskStatus, TaskPriority } from "@/types";
>>>>>>> 7a009e4 (feat: KanbanBoard 필터링 및 정렬 시스템 구현)
import KanbanColumn from "@/components/features/kanban/KanbanColumn";
import Modal from "@/components/ui/Modal";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import KanbanLayout from "@/components/layout/KanbanLayout";
<<<<<<< HEAD
=======
import InviteMemberModal from "../project/InviteMemberModal";
import { cn } from "@/lib/utils/utils";
>>>>>>> 7a009e4 (feat: KanbanBoard 필터링 및 정렬 시스템 구현)

interface KanbanBoardProps {
  projectName: string;
  boardId: string;
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => void;
  
  projectId: string;
}

interface KanbanFilter {
  priority: TaskPriority | "all";
  assignee: "all" | "assigned" | "unassigned" | "me";
  date: "all" | "today" | "thisWeek" | "overdue";
}

type TaskSortOption = "priority" | "date" | "title" | "assignee" | "default";

const KanbanBoard = ({
  projectName,
  boardId,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onCreateTask,

  projectId,
}: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null); // 드래그 중인 Task
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState<TaskSortOption>("default");
  const [filter, setFilter] = useState<KanbanFilter>({
    priority: "all",
    assignee: "all",
    date: "all",
  });

  const { data: session, status } = useSession();

  // Task 정렬 함수
  const sortTasks = (tasks: Task[], sortOption: TaskSortOption): Task[] => {
    if (sortOption === "default") return tasks;

    return [...tasks].sort((a, b) => {
      switch (sortOption) {
        case "priority":
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || "normal"];
          const bPriority = priorityOrder[b.priority || "normal"];
          return bPriority - aPriority; // 높은 우선순위가 위로

        case "date":
          const aDate = a.ended_at ? new Date(a.ended_at).getTime() : Infinity;
          const bDate = b.ended_at ? new Date(b.ended_at).getTime() : Infinity;
          return aDate - bDate; // 빠른 마감일이 위로

        case "title":
          return a.title.localeCompare(b.title); // 제목 가나다순

        case "assignee":
          const aAssignee = a.assigned_user_id || "zzz";
          const bAssignee = b.assigned_user_id || "zzz";
          return aAssignee.localeCompare(bAssignee); // 담당자명순

        default:
          return 0;
      }
    });
  };

  // 센서 설정: 8px 이상 움직여야 드래그 시작 (클릭과 구분)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Task 필터링 로직
  const filteredTasks = useMemo(() => {
    // 세션이 로딩 중일 때는 빈 배열 반환
    if (status === "loading") {
      return [];
    }

    // 디버깅을 위한 로그
    if (filter.assignee === "me") {
      console.log("내 작업 필터 활성화");
      console.log("세션 상태:", status);
      console.log("현재 사용자 ID:", session?.user?.user_id);
      console.log(
        "전체 태스크:",
        tasks.map((t) => ({
          id: t.id,
          title: t.title,
          assigned_user_id: t.assigned_user_id,
        }))
      );
    }

    return tasks.filter((task) => {
      // 우선순위 필터
      if (filter.priority !== "all" && task.priority !== filter.priority) {
        return false;
      }

      // 담당자 필터
      if (filter.assignee !== "all") {
        if (filter.assignee === "assigned" && !task.assigned_user_id) {
          return false;
        }
        if (filter.assignee === "unassigned" && task.assigned_user_id) {
          return false;
        }
        if (filter.assignee === "me") {
          const currentUserId = session?.user?.user_id;
          const taskUserId = task.assigned_user_id;

          console.log(
            `태스크 '${task.title}' 체크 - 할당된 사용자: ${taskUserId}, 현재 사용자: ${currentUserId}`
          );
          console.log("타입 체크:", typeof taskUserId, typeof currentUserId);

          // 문자열과 숫자 비교를 위해 둘 다 문자열로 변환
          const taskUserIdStr = taskUserId ? String(taskUserId) : null;
          const currentUserIdStr = currentUserId ? String(currentUserId) : null;

          if (!taskUserIdStr || taskUserIdStr !== currentUserIdStr) {
            return false;
          }
        }
      }

      // 날짜 필터
      if (filter.date !== "all") {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (filter.date === "today") {
          if (!task.ended_at) return false;

          // 일관된 날짜 파싱
          const taskDate = task.ended_at.includes("T")
            ? new Date(task.ended_at)
            : new Date(task.ended_at + "T00:00:00");

          const taskDateOnly = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );

          if (taskDateOnly.getTime() !== today.getTime()) {
            return false;
          }
        } else if (filter.date === "thisWeek") {
          if (!task.ended_at) return false;

          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          const taskDate = task.ended_at.includes("T")
            ? new Date(task.ended_at)
            : new Date(task.ended_at + "T00:00:00");

          const taskDateOnly = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );

          if (taskDateOnly < weekStart || taskDateOnly > weekEnd) {
            return false;
          }
        } else if (filter.date === "overdue") {
          if (!task.ended_at || task.status === "done") return false;

          const taskDate = task.ended_at.includes("T")
            ? new Date(task.ended_at)
            : new Date(task.ended_at + "T00:00:00");

          const taskDateOnly = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );

          if (taskDateOnly >= today) {
            return false;
          }
        }
      }

      return true;
    });
  }, [tasks, filter, session?.user?.user_id, status]);

  // 상태별로 Task 그룹핑 (필터링 및 정렬된 Task들로)
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    const columnTasks = filteredTasks.filter(
      (task) => task.status === column.id
    );
    acc[column.id] = sortTasks(columnTasks, sortOption);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // 드래그 시작할 때
  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  // 드래그 끝날 때 (상태 업데이트)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 드롭 영역이 없으면 취소
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;

    // over.id가 컬럼 id인지 Task id인지 구분
    let newStatus: TaskStatus;

    // KANBAN_COLUMNS에 있는 id면 컬럼
    const isColumn = KANBAN_COLUMNS.some((col) => col.id === over.id);

    if (isColumn) {
      // 컬럼에 드롭한 경우
      newStatus = over.id as TaskStatus;
    } else {
      // Task에 드롭한 경우 - 그 Task가 속한 컬럼 찾기
      const targetTask = tasks.find((t) => t.id === over.id);
      if (!targetTask) {
        setActiveTask(null);
        return;
      }
      newStatus = targetTask.status;
    }

    // Task 찾기
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      // ✅ taskId와 updates를 분리해서 전달
      onUpdateTask(task.id, { status: newStatus });
    }

    setActiveTask(null);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof KanbanFilter, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Task 생성 핸들러
  const handleCreateTask = (
    taskData: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    onCreateTask(taskData);
    setShowTaskAddModal(false);
  };

  // Task 수정 핸들러
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    onUpdateTask(taskId, updates);
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  // Task 삭제 핸들러
  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <KanbanLayout projectId={projectId}>
      {/* 헤더 */}
      <Header
        projectName={projectName}
        onAddClick={() => setShowTaskAddModal(true)}
       
        projectId={projectId}
        onToggleFilter={() => setShowFilter(!showFilter)}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* 필터 */}
      <KanbanFilter
        filter={filter}
        onFilterChange={handleFilterChange}
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter(!showFilter)}
        taskCount={filteredTasks.length}
        totalCount={tasks.length}
      />

      {/* DndContext로 감싸기 */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* 칸반 컬럼 */}
        <ColumnGrid
          groupedTasks={groupedTasks}
          projectId={projectId}
          onTaskClick={setSelectedTask}
        />

        {/* 드래그 중인 Task 미리보기 (마우스 따라다님) */}
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-2xl border-2 border-main-300 dark:border-main-400 opacity-95 rotate-2 transform scale-105">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                {activeTask.title}
              </h3>
              {activeTask.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task 상세 모달 */}
      {selectedTask && (
        <Modal isOpen onClose={() => setSelectedTask(null)}>
          <TaskDetail
            task={{
              ...selectedTask,
              project_id: selectedTask.project_id || projectId,
            }}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            onClose={() => setSelectedTask(null)}
          />
        </Modal>
      )}

      {/* Task 추가 모달 */}
      {showTaskAddModal && (
        <Modal isOpen onClose={() => setShowTaskAddModal(false)}>
          <TaskAdd
            boardId={boardId}
            projectId={projectId}
            onSuccess={handleCreateTask}
            onCancel={() => setShowTaskAddModal(false)}
          />
        </Modal>
      )}
    </KanbanLayout>
  );
};

// 헤더 컴포넌트
function Header({
  projectName,
  onAddClick,
<<<<<<< HEAD

=======
  userRole,
  projectId,
  onToggleFilter,
  sortOption,
  onSortChange,
>>>>>>> 7a009e4 (feat: KanbanBoard 필터링 및 정렬 시스템 구현)
}: {
  projectName: string;
  onAddClick: () => void;
 
  projectId: string;
  onToggleFilter: () => void;
  sortOption: TaskSortOption;
  onSortChange: (option: TaskSortOption) => void;
}) {
<<<<<<< HEAD
=======
  const [inviteOpen, setInviteOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (showSortDropdown) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSortDropdown]);
>>>>>>> 7a009e4 (feat: KanbanBoard 필터링 및 정렬 시스템 구현)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 rounded-lg shadow-sm gap-3 sm:gap-0">
      <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-gray-100">
        {projectName}
      </h2>

<<<<<<< HEAD
      <div className="flex items-center gap-3">
        
=======
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {userRole === "leader" && (
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600
                  hover:bg-main-300 hover:border-main-300 dark:hover:bg-main-400 dark:hover:border-main-400 hover:text-white transition-all text-xs sm:text-sm font-medium shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            초대
          </button>
        )}
>>>>>>> 7a009e4 (feat: KanbanBoard 필터링 및 정렬 시스템 구현)
        <button
          onClick={onAddClick}
          className="px-3 sm:px-4 py-2 bg-main-400 dark:bg-main-500 text-white rounded-lg hover:bg-main-500 dark:hover:bg-main-400 active:bg-main-600 dark:active:bg-main-600 transition-all text-xs sm:text-sm font-medium shadow-sm"
        >
          <span className="hidden sm:inline">+ 새 작업</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* 정렬 드롭다운 */}
        {/* <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1"
            title="정렬"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            <span className="hidden sm:inline text-xs text-white">정렬</span>
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {[
                { value: "default", label: "기본순" },
                { value: "priority", label: "우선순위순" },
                { value: "date", label: "마감일순" },
                { value: "title", label: "제목순" },
                { value: "assignee", label: "담당자순" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value as TaskSortOption);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    sortOption === option.value
                      ? "bg-main-100 dark:bg-main-800 text-main-600 dark:text-main-300"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div> */}

        <button
          onClick={onToggleFilter}
          className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
          title="필터"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
        </button>
      </div>

    
    </div>
  );
}

// 컬럼 그리드 컴포넌트
function ColumnGrid({
  groupedTasks,
  projectId,
  onTaskClick,
}: {
  groupedTasks: Record<TaskStatus, Task[]>;
  projectId: string;
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex gap-4 h-full min-h-[600px] justify-center min-w-fit px-4 py-4">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={groupedTasks[column.id] || []}
            projectId={projectId}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}

// 칸반 필터 컴포넌트 - MemoView와 동일한 버튼 스타일
function KanbanFilter({
  filter,
  onFilterChange,
  showFilter,
  onToggleFilter: _onToggleFilter,
  taskCount,
  totalCount,
}: {
  filter: KanbanFilter;
  onFilterChange: (key: keyof KanbanFilter, value: string) => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  taskCount: number;
  totalCount: number;
}) {
  // 필터 초기화 버튼
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        showFilter ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}
    >
      {showFilter && (
        <div className="mb-6 px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm space-y-3 sm:space-y-4">
          {/* 우선순위 필터 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              우선순위:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onFilterChange("priority", "all")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.priority === "all"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => onFilterChange("priority", "high")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.priority === "high"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                높음
              </button>
              <button
                onClick={() => onFilterChange("priority", "normal")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.priority === "normal"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                보통
              </button>
              <button
                onClick={() => onFilterChange("priority", "low")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.priority === "low"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                낮음
              </button>
            </div>
          </div>

          {/* 담당자 필터 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              담당자:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onFilterChange("assignee", "all")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.assignee === "all"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => onFilterChange("assignee", "assigned")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.assignee === "assigned"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                할당됨
              </button>
              <button
                onClick={() => onFilterChange("assignee", "unassigned")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.assignee === "unassigned"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                미할당
              </button>
              <button
                onClick={() => onFilterChange("assignee", "me")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.assignee === "me"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                내 작업
              </button>
            </div>
          </div>

          {/* 날짜 필터 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              기간:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onFilterChange("date", "all")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.date === "all"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => onFilterChange("date", "today")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.date === "today"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                오늘 마감
              </button>
              <button
                onClick={() => onFilterChange("date", "thisWeek")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.date === "thisWeek"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                이번 주
              </button>
              <button
                onClick={() => onFilterChange("date", "overdue")}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                  filter.date === "overdue"
                    ? "bg-main-500 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                지연됨
              </button>
            </div>
          </div>

          {/* 결과 카운트 */}
          <div className="flex items-center justify-end">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {taskCount}개 / 전체 {totalCount}개
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
