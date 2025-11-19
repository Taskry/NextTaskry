"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority, Subtask } from "@/types";
import DatePicker from "@/components/ui/DatePicker";
import { Icon } from "@/components/shared/Icon";
import Button from "@/components/ui/Button";
import SubtaskList from "./SubtaskList";
import BadgeSelector from "./BadgeSelector";

// ============================================
// Types & Constants
// ============================================

interface TaskAddProps {
  boardId: string;
  onSuccess?: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string;
  started_at: string;
  ended_at: string;
  memo: string;
  subtasks: Subtask[];
};

const STATUS_OPTIONS = [
  { value: "todo" as const, badgeType: "todo" as const },
  { value: "inprogress" as const, badgeType: "inProgress" as const },
  { value: "done" as const, badgeType: "done" as const },
];

const PRIORITY_OPTIONS = [
  { value: "low" as const, badgeType: "low" as const },
  { value: "normal" as const, badgeType: "normal" as const },
  { value: "high" as const, badgeType: "high" as const },
];

const INITIAL_FORM_DATA: FormData = {
  title: "",
  description: "",
  status: "todo",
  priority: "normal",
  assigned_to: "",
  started_at: "",
  ended_at: "",
  memo: "",
  subtasks: [],
};

// ============================================
// Utils
// ============================================

const cleanValue = (value: string) => value.trim() || undefined;

// ============================================
// Main Component
// ============================================

export default function TaskAdd({
  boardId,
  onSuccess,
  onCancel,
}: TaskAddProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const taskData: Omit<Task, "id" | "created_at" | "updated_at"> = {
        kanban_board_id: boardId,
        project_id: boardId,
        title: formData.title.trim(),
        description: cleanValue(formData.description),
        status: formData.status,
        priority: formData.priority,
        assigned_to: cleanValue(formData.assigned_to),
        started_at: formData.started_at || undefined,
        ended_at: formData.ended_at || undefined,
        memo: cleanValue(formData.memo),
        subtasks: formData.subtasks.length > 0 ? formData.subtasks : undefined,
      };

      onSuccess?.(taskData);
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
      <Header />

      {errors.submit && <ErrorMessage message={errors.submit} />}

      <TitleInput
        value={formData.title}
        error={errors.title}
        disabled={isSubmitting}
        onChange={(value) => handleChange("title", value)}
      />

      <StatusPriorityRow
        status={formData.status}
        priority={formData.priority}
        onStatusChange={(value) => handleChange("status", value)}
        onPriorityChange={(value) => handleChange("priority", value)}
      />

      <DescriptionField
        value={formData.description}
        disabled={isSubmitting}
        onChange={(value) => handleChange("description", value)}
      />

      <AssigneeField
        value={formData.assigned_to}
        disabled={isSubmitting}
        onChange={(value) => handleChange("assigned_to", value)}
      />

      <DateFields
        startDate={formData.started_at}
        endDate={formData.ended_at}
        error={errors.ended_at}
        disabled={isSubmitting}
        onStartDateChange={(value) => handleChange("started_at", value)}
        onEndDateChange={(value) => handleChange("ended_at", value)}
      />

      <SubtaskField
        subtasks={formData.subtasks}
        onUpdate={(list) => handleChange("subtasks", list)}
      />

      <MemoField
        value={formData.memo}
        disabled={isSubmitting}
        onChange={(value) => handleChange("memo", value)}
      />

      <ActionButtons
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ============================================
// Sub Components
// ============================================

function Header() {
  return (
    <div className="pb-4 border-b">
      <h2 className="text-2xl font-bold text-gray-800">새 작업 추가</h2>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  );
}

function TitleInput({
  value,
  error,
  disabled,
  onChange,
}: {
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-main-300"
        }`}
        placeholder="작업 제목을 입력하세요"
        autoFocus
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-xs mt-1 pl-3">* {error}</p>}
    </div>
  );
}

function StatusPriorityRow({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: {
  status: TaskStatus;
  priority: TaskPriority;
  onStatusChange: (value: TaskStatus) => void;
  onPriorityChange: (value: TaskPriority) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex items-center gap-2">
        <Icon type="progressAlert" size={16} color="#6B7280" />
        <h3 className="text-sm font-semibold text-gray-600">상태</h3>
        <BadgeSelector
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Icon type="alertTriangle" size={16} color="#6B7280" />
        <h3 className="text-sm font-semibold text-gray-600 whitespace-nowrap">
          우선순위
        </h3>
        <BadgeSelector
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={onPriorityChange}
        />
      </div>
    </div>
  );
}

function DescriptionField({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="description" size={16} color="#6B7280" />
        설명
      </h3>
      <textarea
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-main-300 min-h-[100px]"
        placeholder="설명을 입력하세요"
        disabled={disabled}
      />
    </div>
  );
}

function AssigneeField({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
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
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-main-300"
          placeholder="담당자 이름을 입력하세요"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function DateFields({
  startDate,
  endDate,
  error,
  disabled,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  error?: string;
  disabled: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        label="시작일"
        icon="calendarPlus"
        value={startDate}
        onChange={onStartDateChange}
        disabled={disabled}
      />
      <DatePicker
        label="마감일"
        icon="calendarCheck"
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
        error={error}
        disabled={disabled}
      />
    </div>
  );
}

function SubtaskField({
  subtasks,
  onUpdate,
}: {
  subtasks: Subtask[];
  onUpdate: (list: Subtask[]) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
        <Icon type="checkList" size={16} color="#6B7280" />
        하위 할 일
      </h3>
      <SubtaskList subtasks={subtasks} editable={true} onUpdate={onUpdate} />
    </div>
  );
}

function MemoField({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="notes" size={16} color="#6B7280" />
        메모
      </h3>
      <textarea
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:ring-yellow-400 min-h-20"
        placeholder="메모를 입력하세요"
        disabled={disabled}
      />
    </div>
  );
}

function ActionButtons({
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
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
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "생성 중..." : "작업 추가"}
      </Button>
    </div>
  );
}
