// components/TaskForm.tsx

"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "../types/kanban";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
  boardId: string; // kanban_board_id를 props로 받음
}

const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
  boardId,
}: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || ("todo" as TaskStatus),
    priority: initialData?.priority || ("normal" as TaskPriority),
    assigned_to: initialData?.assigned_to || "",
    started_at: initialData?.started_at || "",
    ended_at: initialData?.ended_at || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 제목 검증
    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    // 날짜 검증
    if (formData.started_at && formData.ended_at) {
      const startDate = new Date(formData.started_at);
      const endDate = new Date(formData.ended_at);

      if (startDate > endDate) {
        newErrors.ended_at = "마감일은 시작일보다 이후여야 합니다.";
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

    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="작업 제목을 입력하세요"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* 설명 */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          설명
        </label>
        <textarea
          id="task-description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="작업에 대한 자세한 설명을 입력하세요"
        />
      </div>

      {/* 우선순위와 상태를 한 줄에 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="task-priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            우선순위
          </label>
          <select
            id="task-priority"
            value={formData.priority}
            onChange={(e) =>
              handleChange("priority", e.target.value as TaskPriority)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            상태
          </label>
          <select
            id="task-status"
            value={formData.status}
            onChange={(e) =>
              handleChange("status", e.target.value as TaskStatus)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">할 일</option>
            <option value="inprogress">진행 중</option>
            <option value="done">완료</option>
          </select>
        </div>
      </div>

      {/* 담당자 */}
      <div>
        <label
          htmlFor="task-assigned"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          담당자
        </label>
        <input
          id="task-assigned"
          type="text"
          value={formData.assigned_to}
          onChange={(e) => handleChange("assigned_to", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="담당자 이름을 입력하세요"
        />
      </div>

      {/* 날짜들 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="task-start-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            시작일
          </label>
          <input
            id="task-start-date"
            type="date"
            value={formData.started_at}
            onChange={(e) => handleChange("started_at", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-end-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            마감일
          </label>
          <input
            id="task-end-date"
            type="date"
            value={formData.ended_at}
            onChange={(e) => handleChange("ended_at", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.ended_at
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            aria-invalid={!!errors.ended_at}
            aria-describedby={errors.ended_at ? "end-date-error" : undefined}
          />
          {errors.ended_at && (
            <p id="end-date-error" className="mt-1 text-sm text-red-600">
              {errors.ended_at}
            </p>
          )}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {initialData ? "수정" : "생성"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
