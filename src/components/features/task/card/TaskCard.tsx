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
}

const TaskCard = ({ task, projectId, onClick }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const isCompleted = task.status === "done";

  const dragStyle = useMemo(
    () => ({
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging]
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
        (task.subtasks &&
          Array.isArray(task.subtasks) &&
          task.subtasks.length > 0) ||
        task.memo
    );
  }, [
    task.description,
    task.assigned_user_id,
    task.started_at,
    task.ended_at,
    task.subtasks,
    task.memo,
  ]);

  useEffect(() => {
    if (contentRef.current) {
      const calculateHeight = () => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      };

      calculateHeight();
      const timer = setTimeout(calculateHeight, 100);

      return () => clearTimeout(timer);
    }
    // contentRef.current가 없을 때도 cleanup 함수 반환
    return () => {};
  }, [task, isExpanded]);

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-500 hover:shadow-lg hover:border-main-300 dark:hover:border-main-400 transition-all cursor-grab active:cursor-grabbing"
      role="button"
      tabIndex={0}
      aria-label={`작업 카드: ${task.title}`}
      data-task-id={task.id}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-2 flex-1">
          {/* 완료 아이콘 */}
          {isCompleted && (
            <div className="shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* 제목 */}
          <h3 className="font-bold text-lg flex-1 line-clamp-2 text-gray-800 dark:text-gray-100">
            {task.title}
          </h3>
        </div>

        {/* 우선순위 & 펼치기 버튼 */}
        <div className="flex items-center gap-2">
          {task.priority && <PriorityBadge priority={task.priority} />}

          {hasAdditionalInfo && (
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors cursor-pointer"
              title={isExpanded ? "접기" : "펼치기"}
              aria-label={
                isExpanded ? "작업 상세정보 접기" : "작업 상세정보 펼치기"
              }
              aria-expanded={isExpanded}
              type="button"
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

      {/* 접혔을 때: 날짜 & 뱃지만 표시 */}
      {!isExpanded && (task.started_at || task.ended_at) && (
        <div className="py-2">
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

      {/* 펼쳐진 상태: 모든 정보 표시 */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          maxHeight:
            isExpanded || !hasAdditionalInfo ? `${contentHeight}px` : "0px",
          opacity: isExpanded || !hasAdditionalInfo ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="space-y-3">
          {/* 설명 */}
          {task.description && (
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm line-clamp-3">
              {task.description}
            </p>
          )}

          {/* 담당자 */}
          {task.assigned_user_id && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <AssigneeInfo
                userId={task.assigned_user_id}
                projectId={projectId}
              />
            </div>
          )}

          {/* 날짜 & 뱃지 */}
          {(task.started_at || task.ended_at) && (
            <div className="pt-2">
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

          {/* 서브태스크 */}
          {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <SubtaskList subtasks={task.subtasks} />
            </div>
          )}

          {/* 메모 */}
          {task.memo && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-xs text-gray-700 dark:text-yellow-200 line-clamp-3">
              {task.memo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
