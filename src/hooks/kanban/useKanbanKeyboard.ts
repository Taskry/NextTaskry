/**
 * 칸반 키보드 단축키 hook
 *
 * 지원하는 단축키:
 * - ESC: 모달 닫기
 * - Ctrl/Cmd + N: 새 작업 추가
 */

import { useEffect } from "react";

interface UseKanbanKeyboardProps {
  showTaskAddModal: boolean;
  showTaskDetailModal: boolean;
  setShowTaskAddModal: (show: boolean) => void;
  setShowTaskDetailModal: (show: boolean) => void;
  setSelectedTask: (task: null) => void;
}

export function useKanbanKeyboard({
  showTaskAddModal,
  showTaskDetailModal,
  setShowTaskAddModal,
  setShowTaskDetailModal,
  setSelectedTask,
}: UseKanbanKeyboardProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC: 모달 닫기
      if (e.key === "Escape") {
        if (showTaskAddModal) {
          setShowTaskAddModal(false);
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
        setShowTaskAddModal(true);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    showTaskAddModal,
    showTaskDetailModal,
    setShowTaskAddModal,
    setShowTaskDetailModal,
    setSelectedTask,
  ]);
}
