// components/task/SubtaskList.tsx
"use client";

import { useState } from "react";
import { Subtask } from "@/types";
import { Icon } from "@/components/shared/Icon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";

interface SubtaskListProps {
  subtasks: Subtask[];
  editable?: boolean;
  onUpdate?: (subtasks: Subtask[]) => void;
}

const SubtaskList = ({
  subtasks,
  editable = false,
  onUpdate,
}: SubtaskListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [deletingSubtaskId, setDeletingSubtaskId] = useState<string | null>(
    null
  );

  const { modalProps, openModal, closeModal } = useModal();

  const completedCount = subtasks.filter((s) => s.completed).length;

  const handleToggleComplete = (subtaskId: string) => {
    if (!editable || !onUpdate) return;

    const updated = subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdate(updated);
  };

  const handleStartEdit = (subtask: Subtask) => {
    setEditingId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const handleSaveEdit = (subtaskId: string) => {
    if (!editable || !onUpdate || !editingTitle.trim()) return;

    const updated = subtasks.map((s) =>
      s.id === subtaskId ? { ...s, title: editingTitle } : s
    );
    onUpdate(updated);
    setEditingId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // 서브태스크 삭제 확인 모달 열기
  const handleDelete = (subtaskId: string) => {
    if (!editable || !onUpdate) return;

    setDeletingSubtaskId(subtaskId);
    openModal("delete", "하위 작업 삭제", "이 하위 작업을 삭제하시겠습니까?");
  };

  // 서브태스크 삭제 실행
  const confirmDeleteSubtask = () => {
    if (!deletingSubtaskId || !onUpdate) return;

    const updated = subtasks.filter((s) => s.id !== deletingSubtaskId);
    onUpdate(updated);
    setDeletingSubtaskId(null);
    closeModal();
  };

  const handleAddSubtask = () => {
    if (!editable || !onUpdate || !newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false,
    };
    onUpdate([...subtasks, newSubtask]);
    setNewSubtaskTitle("");
    setShowAddInput(false);
  };

  // 읽기 전용 모드 (카드에서 사용)
  if (!editable) {
    const progressPercent =
      subtasks.length > 0
        ? Math.round((completedCount / subtasks.length) * 100)
        : 0;

    return (
      <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            하위 작업
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedCount}/{subtasks.length}
          </span>
        </div>

        {/* 진행률 바 */}
        <div className="mb-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-main-500 dark:bg-main-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-1.5">
          {subtasks.slice(0, 2).map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2 text-sm">
              <Icon
                type={subtask.completed ? "circleCheck" : "circle"}
                size={16}
                className={
                  subtask.completed
                    ? "text-main-500"
                    : "text-gray-300 dark:text-gray-600"
                }
              />
              <span
                className={
                  subtask.completed
                    ? "line-through text-gray-400 dark:text-gray-500"
                    : "text-gray-700 dark:text-gray-300"
                }
              >
                {subtask.title}
              </span>
            </div>
          ))}
          {subtasks.length > 2 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 pl-6">
              +{subtasks.length - 2}개 더
            </p>
          )}
        </div>
      </div>
    );
  }

  // 편집 가능 모드 (상세보기에서 사용)
  // 완료된 항목을 하단으로 정렬
  const sortedSubtasks = [...subtasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          완료 {completedCount}/{subtasks.length}
        </p>
        <div className="flex-1 mx-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-main-400 dark:bg-main-500 transition-all duration-300"
            style={{
              width: `${
                subtasks.length > 0
                  ? (completedCount / subtasks.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {subtasks.length > 0
            ? Math.round((completedCount / subtasks.length) * 100)
            : 0}
          %
        </span>
      </div>

      <div className="space-y-2">
        {sortedSubtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
          >
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => handleToggleComplete(subtask.id)}
              className="w-4 h-4 cursor-pointer accent-main-500"
            />

            {editingId === subtask.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e: any) => setEditingTitle(e.target.value)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") handleSaveEdit(subtask.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-main-300 dark:border-main-600 rounded focus:outline-none focus:ring-2 focus:ring-main-300 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={() => handleSaveEdit(subtask.id)}
                  className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                >
                  <Icon type="circleCheck" size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon type="x" size={18} />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-sm ${
                    subtask.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {subtask.title}
                </span>
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(subtask)}
                    className="text-gray-400 hover:text-main-500 dark:text-gray-500 dark:hover:text-main-400"
                  >
                    <Icon type="edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(subtask.id)}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <Icon type="trash" size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 새 하위 작업 추가 */}
      {showAddInput ? (
        <div className="flex items-center gap-2 mt-3 p-2 border border-main-300 dark:border-main-600 rounded dark:bg-gray-800">
          <Icon
            type="plus"
            size={16}
            className="text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e: any) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") handleAddSubtask();
              if (e.key === "Escape") {
                setShowAddInput(false);
                setNewSubtaskTitle("");
              }
            }}
            placeholder="하위 작업 제목"
            autoFocus
            className="flex-1 text-sm focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <button
            onClick={handleAddSubtask}
            className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
          >
            <Icon type="circleCheck" size={18} />
          </button>
          <button
            onClick={() => {
              setShowAddInput(false);
              setNewSubtaskTitle("");
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Icon type="x" size={18} />
          </button>
        </div>
      ) : (
        <Button
          variant="basic"
          icon="plus"
          onClick={() => setShowAddInput(true)}
          className="mt-3 w-full"
        >
          하위 작업 추가
        </Button>
      )}

      {/* 삭제 확인 모달 */}
      <Modal {...modalProps} onConfirm={confirmDeleteSubtask} />
    </div>
  );
};

export default SubtaskList;
