/**
 * 캘린더 키보드 단축키 hook
 *
 * 지원하는 단축키:
 * - ESC: 모달 닫기
 * - Ctrl/Cmd + N: 새 작업 추가
 * - Arrow Left/Right: 날짜 이동
 */

import { useEffect } from "react";
import { format } from "date-fns";
import { View } from "react-big-calendar";
import { navigateDate, DateDirection } from "@/lib/utils/dateUtils";
import { CALENDAR_FEATURES } from "@/components/features/calendarView/constants/calendarConfig";

interface UseCalendarKeyboardProps {
  showTaskAddModal: boolean;
  showTaskDetailModal: boolean;
  currentDate: Date;
  currentView: View;
  setShowTaskAddModal: (show: boolean) => void;
  setShowTaskDetailModal: (show: boolean) => void;
  setSelectedTask: (task: null) => void;
  setSelectedDates: (
    dates: { started_at: string; ended_at: string } | null
  ) => void;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: View) => void;
}

export function useCalendarKeyboard({
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
}: UseCalendarKeyboardProps) {
  useEffect(() => {
    // 키보드 단축키가 비활성화되어 있으면 실행 안 함
    if (!CALENDAR_FEATURES.enableKeyboardShortcuts) return;

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
        const direction: DateDirection = e.key === "ArrowLeft" ? -1 : 1;
        const newDate = navigateDate(
          currentDate,
          direction,
          currentView as "day" | "week" | "month" | "agenda"
        );
        setCurrentDate(newDate);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
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
  ]);
}
