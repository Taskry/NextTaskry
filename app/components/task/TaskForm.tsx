"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "@/app/types/kanban";
import { Icon } from "../Icon/Icon";

interface TaskFormProps {
  boardId: string;
  onSubmit: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

const TaskForm = ({ boardId, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "normal" as TaskPriority,
    assigned_to: "",
    started_at: "",
    ended_at: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목은 필수입니다.";
    }

    if (formData.started_at && formData.ended_at) {
      if (new Date(formData.started_at) > new Date(formData.ended_at)) {
        newErrors.ended_at = "종료일은 시작일보다 늦어야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
      kanban_board_id: boardId,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      assigned_to: formData.assigned_to.trim() || undefined,
      started_at: formData.started_at || undefined,
      ended_at: formData.ended_at || undefined,
    };

    onSubmit(taskData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제목 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="작업 제목을 입력하세요"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 resize-none"
          placeholder="작업에 대한 자세한 설명을 입력하세요"
        />
      </div>

      {/* 상태와 우선순위 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상태
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TaskStatus)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
          >
            <option value="todo">할 일</option>
            <option value="inprogress">진행 중</option>
            <option value="done">완료</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            우선순위
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              handleChange("priority", e.target.value as TaskPriority)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
          >
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </select>
        </div>
      </div>

      {/* 담당자 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          담당자
        </label>
        <div className="relative">
          <Icon
            type="search"
            size={18}
            color="#9CA3AF"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={formData.assigned_to}
            onChange={(e) => {
              handleChange("assigned_to", e.target.value);
              setShowTeamMemberDropdown(e.target.value.length > 0);
            }}
            onFocus={() =>
              setShowTeamMemberDropdown(formData.assigned_to.length > 0)
            }
            onBlur={() =>
              setTimeout(() => setShowTeamMemberDropdown(false), 200)
            }
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            placeholder="팀원 이름 검색..."
          />
          {/* 팀원 목록 드롭다운 */}
          {showTeamMemberDropdown && formData.assigned_to && (
            <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
              {[
                "김철수",
                "이영희",
                "박민수",
                "최지원",
                "정수현",
                "강민지",
                "윤대현",
                "송하늘",
                "임서연",
              ]
                .filter((name) =>
                  name
                    .toLowerCase()
                    .includes(formData.assigned_to.toLowerCase())
                )
                .map((name) => (
                  <div
                    key={name}
                    onClick={() => {
                      handleChange("assigned_to", name);
                      setShowTeamMemberDropdown(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-main-600">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            value={formData.started_at}
            onChange={(e) => handleChange("started_at", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            value={formData.ended_at}
            onChange={(e) => handleChange("ended_at", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 ${
              errors.ended_at ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.ended_at && (
            <p className="text-red-500 text-xs mt-1">{errors.ended_at}</p>
          )}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-main-300 text-white rounded-lg hover:bg-main-400 transition-colors"
        >
          생성하기
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
