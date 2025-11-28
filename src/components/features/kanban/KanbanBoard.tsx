"use client";

import { useState } from "react";
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
import {  Task, TaskStatus } from "@/types";
import KanbanColumn from "@/components/features/kanban/KanbanColumn";
import Modal from "@/components/ui/Modal";
import TaskDetail from "@/components/features/task/detail/TaskDetail";
import TaskAdd from "@/components/features/task/add/TaskAdd";
import KanbanLayout from "@/components/layout/KanbanLayout";

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

  // 센서 설정: 8px 이상 움직여야 드래그 시작 (클릭과 구분)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 상태별로 Task 그룹핑
  const groupedTasks = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
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
            task={selectedTask}
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

}: {
  projectName: string;
  onAddClick: () => void;
 
  projectId: string;
}) {

  return (
    <div className="flex justify-between items-center px-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-white dark:text-gray-100">
        {projectName}
      </h2>

      <div className="flex items-center gap-3">
        
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-main-400 dark:bg-main-500 text-white rounded-lg hover:bg-main-500 dark:hover:bg-main-400 active:bg-main-600 dark:active:bg-main-600 transition-all font-medium shadow-sm"
        >
          + 새 작업
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
    <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex gap-4 h-full min-h-[600px] justify-center-safe">
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
