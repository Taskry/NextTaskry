// app/components/task/TaskAdd.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Task, TaskStatus, TaskPriority } from "@/app/types/kanban";
import { Icon } from "../Icon/Icon";
import SubtaskList from "./SubtaskList";
import { Subtask } from "@/app/types/kanban";
import Badge, { badgeConfigs } from "../Badge/Badge";
import Button from "../Button/Button";

interface TaskAddProps {
  boardId: string;
  onSubmit: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

// 뱃지 선택기 컴포넌트
interface BadgeSelectorProps<T extends string> {
  value: T;
  options: { value: T; badgeType: keyof typeof badgeConfigs }[];
  onChange: (value: T) => void;
}

function BadgeSelector<T extends string>({
  value,
  options,
  onChange,
}: BadgeSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      {/* 현재 선택된 뱃지 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative
          hover:scale-105 
          active:scale-95
          transition-all 
          duration-200
          cursor-pointer
          ${isOpen ? "ring-2 ring-main-300 ring-offset-1 rounded-sm" : ""}
        `}
      >
        {currentOption && <Badge type={currentOption.badgeType} />}
      </button>

      {/* 펼쳐진 뱃지들 */}
      {isOpen && (
        <div className="flex items-center gap-1.5 animate-fadeIn">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="
                  hover:scale-105 
                  active:scale-95
                  transition-all 
                  duration-200
                  opacity-70
                  hover:opacity-100
                "
              >
                <Badge type={option.badgeType} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

const TaskAdd = ({ boardId, onSubmit, onCancel }: TaskAddProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "normal" as TaskPriority,
    assigned_to: "",
    started_at: "",
    ended_at: "",
    memo: "",
    subtasks: [] as Subtask[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 상태 옵션
  const statusOptions = [
    { value: "todo" as TaskStatus, badgeType: "todo" as const },
    { value: "inprogress" as TaskStatus, badgeType: "inProgress" as const },
    { value: "done" as TaskStatus, badgeType: "done" as const },
  ];

  // 우선순위 옵션
  const priorityOptions = [
    { value: "low" as TaskPriority, badgeType: "low" as const },
    { value: "normal" as TaskPriority, badgeType: "normal" as const },
    { value: "high" as TaskPriority, badgeType: "high" as const },
  ];

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

  const handleSubmit = () => {
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
      memo: formData.memo.trim() || undefined,
      subtasks: formData.subtasks.length > 0 ? formData.subtasks : undefined,
    };

    onSubmit(taskData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">새 작업 추가</h2>
      </div>

      {/* 제목 */}
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.ended_at
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-main-300"
          }`}
          placeholder="작업 제목을 입력하세요"
          autoFocus
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1 text-left pl-3">
            * {errors.title}
          </p>
        )}
      </div>

      {/* 상태 & 우선순위 */}
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Icon type="progressAlert" size={16} color="#6B7280" />
            <h3 className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              상태
            </h3>
          </div>
          <BadgeSelector
            value={formData.status}
            options={statusOptions}
            onChange={(value) => handleChange("status", value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Icon type="alertTriangle" size={16} color="#6B7280" />
            <h3 className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              우선순위
            </h3>
          </div>
          <BadgeSelector
            value={formData.priority}
            options={priorityOptions}
            onChange={(value) => handleChange("priority", value)}
          />
        </div>
      </div>
      {/* 설명 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="description" size={16} color="#6B7280" />
          설명
        </h3>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 min-h-[100px]"
          placeholder="설명을 입력하세요"
        />
      </div>

      {/* 담당자 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="userCircle" size={16} color="#6B7280" />
          담당자
        </h3>
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
            onChange={(e) => handleChange("assigned_to", e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            placeholder="담당자 이름을 입력하세요"
          />
        </div>
        {/* 팀원 목록 */}
      </div>

      {/* 날짜 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="calendarPlus" size={16} color="#6B7280" />
            시작일
          </h3>
          <input
            type="date"
            value={formData.started_at}
            onChange={(e) => handleChange("started_at", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="calendarCheck" size={16} color="#6B7280" />
            마감일
          </h3>
          <input
            type="date"
            value={formData.ended_at}
            onChange={(e) => handleChange("ended_at", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.ended_at
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-main-300"
            }`}
          />
          {errors.ended_at && (
            <p className="text-red-500 text-xs mt-1 text-left pl-3">
              * {errors.ended_at}
            </p>
          )}
        </div>
      </div>

      {/* 하위 할 일 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          <Icon type="checkList" size={16} color="#6B7280" />
          하위 할 일
        </h3>
        <SubtaskList
          subtasks={formData.subtasks}
          editable={true}
          onUpdate={(updatedSubtasks) =>
            handleChange("subtasks", updatedSubtasks)
          }
        />
      </div>

      {/* 메모 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="notes" size={16} color="#6B7280" />
          메모
        </h3>
        <textarea
          value={formData.memo}
          onChange={(e) => handleChange("memo", e.target.value)}
          className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-20"
          placeholder="메모를 입력하세요"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="basic" size="base" onClick={onCancel}>
          취소
        </Button>
        <Button
          variant="bgMain300"
          size="base"
          textColor="white"
          onClick={handleSubmit}
        >
          작업 추가
        </Button>
      </div>
    </div>
  );
};

export default TaskAdd;
