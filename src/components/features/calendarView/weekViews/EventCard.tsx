"use client";

import { useState, useRef, useCallback } from "react";
import { Task, TaskStatus } from "@/types/kanban";
import {
  getTaskStatusDotColor,
  getTaskStatusBgColor,
  isTaskOverdue,
} from "@/lib/utils/taskUtils";

interface EventCardProps {
  tasks: Task[];
  onSelectEvent: (task: Task) => void;
}

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

interface PopupStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

const POPUP_WIDTH = 220;
const POPUP_MAX_HEIGHT = 280;
const POPUP_MARGIN = 8;

export default function EventCard({ tasks, onSelectEvent }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupStyle, setPopupStyle] = useState<PopupStyle>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // 호버 시 팝업 위치를 동적으로 계산
  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const style: PopupStyle = {};

      // 가로 위치 계산
      if (rect.left + POPUP_WIDTH + POPUP_MARGIN > viewportWidth) {
        style.right = viewportWidth - rect.right;
      } else {
        style.left = rect.left;
      }

      // 세로 위치 계산
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
      className="absolute left-1 right-1 top-1 bottom-1"
      style={{ zIndex: isHovered ? 50 : 10 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 일정 표시: 도트 + 시간 + 제목 */}
      <div className="flex flex-col gap-0.5 p-1 overflow-hidden">
        {tasks.slice(0, 2).map((task) => {
          const overdue = isTaskOverdue(task);
          return (
            <div
              key={task.id}
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(task);
              }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${getTaskStatusDotColor(
                  task.status as TaskStatus
                )}`}
              />
              {overdue && (
                <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500" />
              )}
              <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 shrink-0">
                {task.start_time ? task.start_time.slice(0, 5) : "종일"}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-700 dark:text-gray-300 truncate font-medium">
                {task.title}
              </span>
            </div>
          );
        })}
        {tasks.length > 2 && (
          <span className="text-[9px] text-gray-400 dark:text-gray-500 pl-0.5">
            +{tasks.length - 2}개
          </span>
        )}
      </div>

      {/* 호버 시 리스트 표시 - fixed 포지션으로 화면 경계 벗어나지 않음 */}
      {isHovered && tasks.length > 0 && (
        <div
          className="fixed w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 space-y-1"
          style={{ ...popupStyle, zIndex: 9999 }}
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
                  className={`p-2 rounded-md border text-xs cursor-pointer hover:shadow-md transition-shadow ${getTaskStatusBgColor(
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
                  {task.start_time && (
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 ml-3.5">
                      {task.start_time}
                      {task.end_time ? ` ~ ${task.end_time}` : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
