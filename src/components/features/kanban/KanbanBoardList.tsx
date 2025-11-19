// app/components/kanban/KanbanBoardList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, KanbanBoardType } from "@/app/types";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import Modal from "../Modal/Modal";

interface KanbanBoardListProps {
  projectId: string;
}

interface KanbanBoardFormData {
  name: string;
  description: string;
}

export default function KanbanBoardList({ projectId }: KanbanBoardListProps) {
  const [boards, setBoards] = useState<KanbanBoardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<KanbanBoardType | null>(
    null
  );
  const [formData, setFormData] = useState<KanbanBoardFormData>({
    name: "",
    description: "",
  });

  // 칸반보드 목록 조회
  const fetchBoards = useCallback(async () => {
    try {
      const response = await fetch(`/api/kanban/boards?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (error) {
      console.error("칸반보드 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // 폼 초기화
  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingBoard(null);
  };

  // 모달 열기
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (board: KanbanBoardType) => {
    setFormData({
      name: board.name,
      description: board.description || "",
    });
    setEditingBoard(board);
    setIsCreateModalOpen(true);
  };

  // 칸반보드 생성/수정
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("칸반보드 이름을 입력해주세요.");
      return;
    }

    try {
      const url = editingBoard
        ? `/api/kanban/boards?id=${editingBoard.id}`
        : "/api/kanban/boards";

      const method = editingBoard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          project_id: projectId,
        }),
      });

      if (response.ok) {
        await fetchBoards();
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || "저장 실패");
      }
    } catch (error) {
      console.error("칸반보드 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 칸반보드 삭제
  const handleDelete = async (boardId: string) => {
    if (
      !confirm(
        "정말 이 칸반보드를 삭제하시겠습니까?\n삭제된 칸반보드의 모든 작업도 함께 삭제됩니다."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/kanban/boards?id=${boardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBoards();
      } else {
        const error = await response.json();
        alert(error.error || "삭제 실패");
      }
    } catch (error) {
      console.error("칸반보드 삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">칸반보드 관리</h2>
        <Button variant="primary" onClick={openCreateModal}>
          <Icon type="plus" size={16} className="mr-2" />새 칸반보드
        </Button>
      </div>

      {/* 칸반보드 목록 */}
      {boards.length === 0 ? (
        <div className="text-center py-12">
          <Icon
            type="board"
            size={48}
            color="#9CA3AF"
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            칸반보드가 없습니다
          </h3>
          <p className="text-gray-500 mb-6">첫 번째 칸반보드를 생성해보세요.</p>
          <Button variant="primary" onClick={openCreateModal}>
            칸반보드 생성하기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {board.name}
                  </h3>
                  {board.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(board)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="수정"
                  >
                    <Icon type="edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="삭제"
                  >
                    <Icon type="trash" size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>작업 수: 0</span>
                <span>
                  {new Date(board.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>

              <Button
                variant="basic"
                className="w-full"
                onClick={() => {
                  // 칸반보드 상세 페이지로 이동
                  window.location.href = `/kanban/${board.id}`;
                }}
              >
                <Icon type="eye" size={16} className="mr-2" />
                보기
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 생성/수정 모달 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingBoard ? "칸반보드 수정" : "새 칸반보드 생성"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              칸반보드 이름 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e: any) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
              placeholder="칸반보드 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 min-h-[100px]"
              placeholder="칸반보드에 대한 설명을 입력하세요 (선택사항)"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="basic" onClick={() => setIsCreateModalOpen(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingBoard ? "수정" : "생성"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
