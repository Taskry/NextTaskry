"use client";

import { useState, useRef, useEffect } from "react";

// Components
import DatePicker from "../DatePicker/datePicker";
import { Icon } from "../Icon/Icon";
import Badge, { badgeConfigs } from "../Badge/Badge";
import Button from "../Button/Button";
import SubtaskList from "./SubtaskList";

// Types
import { Task, TaskStatus, TaskPriority, Subtask } from "../../types/kanban";
import { createTask } from "@/app/api/task/tasks";

interface TaskAddProps {
  boardId: string;
  onSuccess?: (task: Task) => void;
  onCancel: () => void;
}

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string;
  started_at: string; // ISO string
  ended_at: string; // ISO string
  memo: string;
  subtasks: Subtask[];
};

const clean = (value: string) => value.trim() || undefined;

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
  const ref = useRef<HTMLDivElement>(null);

  // open일 때만 이벤트 등록 → 성능 최적화
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const current = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="flex items-center gap-2 flex-nowrap">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          relative transition-all duration-200 cursor-pointer
          hover:scale-105 active:scale-95 
          ${isOpen ? "ring-2 ring-main-300 ring-offset-1 rounded-sm" : ""}
        `}
      >
        {current && <Badge type={current.badgeType} />}
      </button>

      {isOpen && (
        <div className="flex items-center gap-1.5 animate-fadeIn flex-nowrap">
          {options
            .filter((opt) => opt.value !== value)
            .map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="
                  hover:scale-105 active:scale-95 transition-all duration-200
                  opacity-70 hover:opacity-100
                "
              >
                <Badge type={opt.badgeType} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function TaskAdd({
  boardId,
  onSuccess,
  onCancel,
}: TaskAddProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "todo",
    priority: "normal",
    assigned_to: "",
    started_at: "",
    ended_at: "",
    memo: "",
    subtasks: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions: {
    value: string;
    badgeType: "todo" | "inProgress" | "done";
  }[] = [
    { value: "todo", badgeType: "todo" },
    { value: "inprogress", badgeType: "inProgress" },
    { value: "done", badgeType: "done" },
  ];

  const priorityOptions: {
    value: string;
    badgeType: "low" | "normal" | "high";
  }[] = [
    { value: "low", badgeType: "low" },
    { value: "normal", badgeType: "normal" },
    { value: "high", badgeType: "high" },
  ];

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목은 필수입니다.";
    }

    if (formData.started_at && formData.ended_at) {
      const start = new Date(formData.started_at);
      const end = new Date(formData.ended_at);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        newErrors.ended_at = "날짜 형식이 잘못되었습니다.";
      } else if (start > end) {
        newErrors.ended_at = "종료일은 시작일보다 늦어야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const taskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
        kanban_board_id: boardId,
        project_id: boardId, // 임시로 동일하게 설정
        title: formData.title.trim(),
        description: clean(formData.description),
        status: formData.status,
        priority: formData.priority,
        assigned_to: clean(formData.assigned_to),
        started_at: formData.started_at || undefined,
        ended_at: formData.ended_at || undefined,
        memo: clean(formData.memo),
        subtasks: formData.subtasks.length > 0 ? formData.subtasks : undefined,
      };

      const { data, error } = await createTask(taskData);

      if (error) throw error;
      if (data) {
        onSuccess?.(data);
      }
    } catch (err) {
      console.error("작업 생성 실패:", err);
      setErrors({
        submit: "작업 생성에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">새 작업 추가</h2>
      </div>

      {/* 전역 에러 메시지 */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* 제목 */}
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-main-300"
          }`}
          placeholder="작업 제목을 입력하세요"
          autoFocus
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1 pl-3">* {errors.title}</p>
        )}
      </div>

      {/* 상태 & 우선순위 */}
      <div className="grid grid-cols-2 gap-8">
        <div className="flex items-center gap-2">
          <Icon type="progressAlert" size={16} color="#6B7280" />
          <h3 className="text-sm font-semibold text-gray-600">상태</h3>
          <BadgeSelector
            value={formData.status}
            options={statusOptions}
            onChange={(v) => handleChange("status", v)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <Icon type="alertTriangle" size={16} color="#6B7280" />
            <h3 className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              우선순위
            </h3>
          </div>
          <div className="shrink-0">
            <BadgeSelector
              value={formData.priority}
              options={priorityOptions}
              onChange={(v) => handleChange("priority", v)}
            />
          </div>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-main-300 min-h-[100px]"
          placeholder="설명을 입력하세요"
          disabled={isSubmitting}
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
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={formData.assigned_to}
            onChange={(e) => handleChange("assigned_to", e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-main-300"
            placeholder="담당자 이름을 입력하세요"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* 날짜 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="시작일"
          icon="calendarPlus"
          value={formData.started_at}
          onChange={(date: string) => handleChange("started_at", date)}
          disabled={isSubmitting}
        />

        <DatePicker
          label="마감일"
          icon="calendarCheck"
          value={formData.ended_at}
          onChange={(date: string) => handleChange("ended_at", date)}
          minDate={formData.started_at}
          error={errors.ended_at}
          disabled={isSubmitting}
        />
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
          onUpdate={(list) => handleChange("subtasks", list)}
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
          className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:ring-yellow-400 min-h-20"
          placeholder="메모를 입력하세요"
          disabled={isSubmitting}
        />
      </div>

      {/* 버튼들 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          btnType="basic"
          variant="basic"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>

        <Button
          btnType="form"
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "생성 중..." : "작업 추가"}
        </Button>
      </div>
    </div>
  );
}
