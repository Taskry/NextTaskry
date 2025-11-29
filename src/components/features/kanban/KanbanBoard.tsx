"use client";

import { useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
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
import { Task, TaskStatus } from "@/types";
import KanbanColumn from "@/components/features/kanban/KanbanColumn";
import TaskCard from "@/components/features/task/card/TaskCard";
import Modal from "@/components/ui/Modal";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import KanbanLayout from "@/components/layout/KanbanLayout";
import { showToast } from "@/lib/utils/toast";
import KanbanHeader from "./components/KanbanHeader";
import KanbanHelp from "./components/KanbanHelp";
import KanbanFilterComponent, {
  KanbanFilterType,
} from "./components/KanbanFilter";

interface KanbanBoardProps {
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

const KanbanBoard = ({
  tasks = [],
  boardId,
  project,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onTaskCreated,
}: KanbanBoardProps) => {
  const projectId = project?.project_id || "";
  const projectName = project?.project_name || "이름 없는 프로젝트";
  const projectStartedAt = project?.started_at;
  const projectEndedAt = project?.ended_at;

  console.log("KanbanBoard - Project Info:", {
    project,
    projectName,
    projectStartedAt,
    projectEndedAt,
    boardId,
    projectId,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [filter, setFilter] = useState<KanbanFilterType>({
    priority: "all",
    assignee: "all",
    date: "all",
  });

  const { data: session, status } = useSession();

  const isOutsideProjectRange = useCallback(
    (date: Date) => {
      if (!projectStartedAt || !projectEndedAt) return false;

      const dateStr = format(date, "yyyy-MM-dd");
      return dateStr < projectStartedAt || dateStr > projectEndedAt;
    },
    [projectStartedAt, projectEndedAt]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredTasks = useMemo(() => {
    if (status === "loading") {
      return [];
    }

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
      if (filter.priority !== "all" && task.priority !== filter.priority) {
        return false;
      }

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

          const taskUserIdStr = taskUserId ? String(taskUserId) : null;
          const currentUserIdStr = currentUserId ? String(currentUserId) : null;

          if (!taskUserIdStr || taskUserIdStr !== currentUserIdStr) {
            return false;
          }
        }
      }

      if (filter.date !== "all") {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        if (filter.date === "today") {
          if (!task.ended_at) return false;

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
  }, [tasks, filter, session, status]);

  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    const columnTasks = filteredTasks.filter(
      (task) => task.status === column.id
    );
    acc[column.id] = columnTasks;
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const taskId = event.active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      setActiveTask(task || null);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveTask(null);
        return;
      }

      if (isOutsideProjectRange(new Date())) {
        showToast(
          projectEndedAt &&
            new Date().toISOString().split("T")[0] > projectEndedAt
            ? "종료된 프로젝트입니다."
            : "아직 시작되지 않은 프로젝트입니다.",
          "warning"
        );
        setActiveTask(null);
        return;
      }

      const taskId = active.id as string;
      let newStatus: TaskStatus;

      const isColumn = KANBAN_COLUMNS.some((col) => col.id === over.id);

      if (isColumn) {
        newStatus = over.id as TaskStatus;
      } else {
        const targetTask = tasks.find((t) => t.id === over.id);
        if (!targetTask) {
          setActiveTask(null);
          return;
        }
        newStatus = targetTask.status;
      }

      const task = tasks.find((t) => t.id === taskId);

      if (task && task.status !== newStatus) {
        onUpdateTask?.(task.id, { status: newStatus });
      }

      setActiveTask(null);
    },
    [tasks, onUpdateTask, projectEndedAt, isOutsideProjectRange]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  const handleFilterChange = (key: keyof KanbanFilterType, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTaskAddSuccess = useCallback(
    (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
      onCreateTask?.(taskData);
      onTaskCreated?.();
      setShowTaskAddModal(false);
    },
    [onCreateTask, onTaskCreated, setShowTaskAddModal]
  );

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    onUpdateTask?.(taskId, updates);
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask?.(taskId);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    onSelectTask?.(task);
  };

  return (
    <KanbanLayout projectId={projectId}>
      <KanbanHeader
        projectName={projectName}
        onAddClick={() => setShowTaskAddModal(true)}
        onToggleFilter={() => setShowFilter(!showFilter)}
        onToggleHelp={() => setShowHelp(!showHelp)}
        showHelp={showHelp}
        tasksCount={tasks.length}
        project={project}
      />

      <KanbanFilterComponent
        filter={filter}
        onFilterChange={handleFilterChange}
        showFilter={showFilter}
        taskCount={filteredTasks.length}
        totalCount={tasks.length}
      />

      {showHelp && <KanbanHelp />}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[]}
      >
        <ColumnGrid
          groupedTasks={groupedTasks}
          projectId={projectId}
          onTaskClick={handleTaskClick}
        />

        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div className="transform-none opacity-90">
              <TaskCard
                task={activeTask}
                projectId={projectId}
                onClick={() => {}}
                isOverlay
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

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

      {showTaskAddModal && (
        <Modal isOpen onClose={() => setShowTaskAddModal(false)}>
          <TaskAdd
            boardId={boardId}
            projectId={projectId}
            projectStartedAt={projectStartedAt}
            projectEndedAt={projectEndedAt}
            onSuccess={handleTaskAddSuccess}
            onCancel={() => setShowTaskAddModal(false)}
          />
        </Modal>
      )}
    </KanbanLayout>
  );
};

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

export default KanbanBoard;
