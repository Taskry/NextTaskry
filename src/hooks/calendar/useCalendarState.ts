/**
 * 캘린더 상태 관리 hook
 *
 * 관리하는 상태:
 * - 현재 날짜 및 뷰
 * - 모달 상태 (TaskAdd, TaskDetail)
 * - 선택된 태스크 및 날짜
 * - 도움말 표시 여부
 * - 현재 시간 (1분마다 업데이트)
 */

import { useState, useEffect } from "react";
import { View } from "react-big-calendar";
import { Task } from "@/types/kanban";

export function useCalendarState() {
  // 모달 상태
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

  // 선택된 태스크 및 날짜
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    started_at: string;
    ended_at: string;
  } | null>(null);

  // UI 상태

  // 도움말 표시 여부
  const [showHelp, setShowHelp] = useState(false);

  // 캘린더 뷰 상태
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 현재 시간 업데이트 (1분마다) - 캘린더 시간 라인 표시용
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분 간격
    return () => clearInterval(interval);
  }, []);

  return {
    // 모달 상태
    showTaskAddModal,
    setShowTaskAddModal,
    showTaskDetailModal,
    setShowTaskDetailModal,
    // 선택된 태스크 및 날짜
    selectedTask,
    setSelectedTask,
    selectedDates,
    setSelectedDates,
    // UI 상태
    showHelp,
    setShowHelp,
    // 캘린더 뷰 상태
    currentDate,
    setCurrentDate,
    currentView,
    setCurrentView,
    currentTime,
  };
}
