"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Task, TaskStatus } from "@/types/kanban";
import {
  getTaskStatusBarStyle,
  getTaskStatusDotColor,
  getTaskStatusBgColor,
  isTaskOverdue,
} from "@/lib/utils/taskUtils";

// 우선순위별 삼각형 아이콘
const getPriorityIcon = (priority: string | undefined) => {
  switch (priority) {
    case "high":
      return <span className="text-red-500">▲</span>;
    case "normal":
      return <span className="text-yellow-500">▲</span>;
    case "low":
      return <span className="text-green-500">▲</span>;
    default:
      return null;
  }
};

interface MonthEventCardProps {
  tasks: Task[];
  onSelectEvent: (task: Task) => void;
}

interface PopupStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

const POPUP_WIDTH = 220;
const POPUP_MAX_HEIGHT = 250;
const POPUP_MARGIN = 8;

// 컴팩트 모드 전환 높이 임계값
const COMPACT_HEIGHT_THRESHOLD = 60;

export default function MonthEventCard({
  tasks,
  onSelectEvent,
}: MonthEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupStyle, setPopupStyle] = useState<PopupStyle>({});
  const [isCompact, setIsCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 컨테이너 높이 감지하여 컴팩트 모드 전환
  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setIsCompact(height < COMPACT_HEIGHT_THRESHOLD);
      }
    };

    checkHeight();

    // ResizeObserver로 높이 변화 감지
    const resizeObserver = new ResizeObserver(checkHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // 호버 시 팝업 위치를 동적으로 계산
  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const style: PopupStyle = {};

      // 가로 위치 계산: 오른쪽 공간이 부족하면 왼쪽으로
      if (rect.left + POPUP_WIDTH + POPUP_MARGIN > viewportWidth) {
        style.right = viewportWidth - rect.right;
      } else {
        style.left = rect.left;
      }

      // 세로 위치 계산: 아래 공간이 부족하면 위로
      if (rect.bottom + POPUP_MAX_HEIGHT + POPUP_MARGIN > viewportHeight) {
        style.bottom = viewportHeight - rect.top + POPUP_MARGIN;
      } else {
        style.top = rect.bottom + POPUP_MARGIN;
      }

      setPopupStyle(style);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  if (tasks.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-hidden relative z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isCompact ? (
        // 컴팩트 모드: 원(dot)으로 표시
        <div className="flex flex-wrap gap-1 p-0.5">
          {tasks.slice(0, 5).map((task) => {
            const overdue = isTaskOverdue(task);
            return (
              <div
                key={task.id}
                className="flex items-center gap-0.5 cursor-pointer hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(task);
                }}
                title={task.title}
              >
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${getTaskStatusDotColor(
                    task.status as TaskStatus
                  )}`}
                />
                {overdue && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
                )}
              </div>
            );
          })}
          {tasks.length > 5 && (
            <span className="text-[8px] text-gray-500 dark:text-gray-400">
              +{tasks.length - 5}
            </span>
          )}
        </div>
      ) : (
        // 기본 모드: 바(bar)로 표시
        <div className="space-y-0.5">
          {tasks.slice(0, 3).map((task) => {
            const overdue = isTaskOverdue(task);
            return (
              <div
                key={task.id}
                className={`
                  h-4 sm:h-5 px-1 sm:px-1.5 rounded text-[9px] sm:text-[10px] font-medium truncate
                  flex items-center gap-0.5 sm:gap-1
                  ${getTaskStatusBarStyle(task.status as TaskStatus)}
                  cursor-pointer hover:brightness-95 dark:hover:brightness-110 transition-all
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(task);
                }}
                title={task.title}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${getTaskStatusDotColor(
                    task.status as TaskStatus
                  )}`}
                />
                {overdue && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500" />
                )}
                {task.priority && (
                  <span className="text-[8px] shrink-0">
                    {getPriorityIcon(task.priority)}
                  </span>
                )}
                <span className="truncate">{task.title}</span>
              </div>
            );
          })}
          {tasks.length > 3 && (
            <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 pl-1">
              +{tasks.length - 3}
            </div>
          )}
        </div>
      )}

      {/* 호버 시 전체 리스트 표시 - fixed 포지션으로 화면 경계 벗어나지 않음 */}
      {isHovered && tasks.length > 0 && (
        <div
          className="fixed z-9999 w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 space-y-1"
          style={popupStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 pb-1 border-b border-gray-100 dark:border-gray-700">
            {tasks.length}개의 일정
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {tasks.map((task) => {
              const overdue = isTaskOverdue(task);
              return (
                <div
                  key={task.id}
                  className={`p-2 rounded-md text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${getTaskStatusBgColor(
                    task.status as TaskStatus
                  )}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(task);
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${getTaskStatusDotColor(
                        task.status as TaskStatus
                      )}`}
                    />
                    {overdue && (
                      <div className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
                    )}
                    {task.priority && (
                      <span className="text-[10px]">
                        {getPriorityIcon(task.priority)}
                      </span>
                    )}
                    <span className="font-medium truncate text-gray-800 dark:text-gray-200">
                      {task.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
