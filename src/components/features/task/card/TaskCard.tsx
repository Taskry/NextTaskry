import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/types";
import { CSS } from "@dnd-kit/utilities";
import PriorityBadge from "@/components/features/task/fields/PriorityBadge";
import AssigneeInfo from "@/components/features/task/fields/AssigneeInfo";
import SubtaskList from "@/components/features/task/fields/SubtaskList";
import DateInfo from "@/components/features/task/fields/DateInfo";

interface TaskCardProps {
  task: Task;
  projectId: string;
  onClick?: () => void;
  isOverlay?: boolean; // ✨ DragOverlay 모드
}

const TaskCard = ({
  task,
  projectId,
  onClick,
  isOverlay = false,
}: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      animateLayoutChanges: () => false,
    });

  // --- 스타일 처리 ---
  const dragStyle = useMemo(
    () => ({
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition: isDragging ? "none" : undefined,
      opacity: isDragging ? 0 : 1,
      zIndex: isDragging ? 999 : isOverlay ? 500 : 1,
    }),
    [transform, isDragging, isOverlay]
  );

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  const hasAdditionalInfo = useMemo(() => {
    return Boolean(
      task.description ||
        task.assigned_user_id ||
        task.started_at ||
        task.ended_at ||
        (task.subtasks && task.subtasks.length > 0) ||
        task.memo
    );
  }, [task]);

  // --- Height 계산 (아코디언) ---
  useEffect(() => {
    if (contentRef.current) {
      const calc = () => setContentHeight(contentRef.current!.scrollHeight);
      calc();
      const timer = setTimeout(calc, 80);
      return () => clearTimeout(timer);
    }
  }, [task, isExpanded]);

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-700
        text-gray-700 dark:text-gray-300
        p-4 rounded-lg border shadow-md
        border-gray-200 dark:border-gray-500
        cursor-grab active:cursor-grabbing
        ${
          isDragging
            ? ""
            : "hover:shadow-lg hover:border-main-300 dark:hover:border-main-400"
        }
        ${isOverlay ? "shadow-2xl scale-[1.02] opacity-90" : ""}
        transition-shadow duration-150
      `}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-2 flex-1">
          <h3 className="font-bold text-lg flex-1 line-clamp-2 text-gray-800 dark:text-gray-100">
            {task.title}
          </h3>
        </div>

        {/* 우선순위 + 펼치기 버튼 */}
        <div className="flex items-center gap-2">
          {task.priority && <PriorityBadge priority={task.priority} />}
          {hasAdditionalInfo && !isOverlay && (
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 접혔을 때 날짜 표시 */}
      {!isExpanded && !isOverlay && (task.started_at || task.ended_at) && (
        <div className="pt-1">
          <DateInfo
            startedAt={task.started_at ?? undefined}
            endedAt={task.ended_at ?? undefined}
            startTime={task.start_time || undefined}
            endTime={task.end_time || undefined}
            useTime={task.use_time ?? false}
            status={task.status}
          />
        </div>
      )}

      {/* 펼쳐진 내용 */}
      {!isOverlay && (
        <div
          className="overflow-hidden transition-[max-height,opacity,transform] duration-400 ease-out"
          style={{
            maxHeight:
              isExpanded || !hasAdditionalInfo ? `${contentHeight}px` : "0px",
            opacity: isExpanded || !hasAdditionalInfo ? 1 : 0,
            transform: isExpanded ? "scale(1)" : "scale(0.98)",
          }}
        >
          <div ref={contentRef} className="space-y-3">
            {task.description && (
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                {task.description}
              </p>
            )}

            {task.assigned_user_id && (
              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <AssigneeInfo
                  userId={task.assigned_user_id}
                  projectId={projectId}
                />
              </div>
            )}

            {(task.started_at || task.ended_at) && (
              <DateInfo
                startedAt={task.started_at ?? undefined}
                endedAt={task.ended_at ?? undefined}
                startTime={task.start_time || undefined}
                endTime={task.end_time || undefined}
                useTime={task.use_time ?? false}
                status={task.status}
              />
            )}

            {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                <SubtaskList subtasks={task.subtasks} />
              </div>
            )}

            {task.memo && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs text-gray-700 dark:text-yellow-200">
                {task.memo}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
