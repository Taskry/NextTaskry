"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus, TaskPriority, Subtask } from "@/types";
import Button from "@/components/ui/Button";

// 공용 컴포넌트
import { FormSection } from "@/components/features/task/shared/FormSection";
import { StatusPrioritySection } from "@/components/features/task/shared/StatusPrioritySection";
import { DateFields } from "@/components/features/task/shared/DateFields";
import { SubtaskSection } from "@/components/features/task/shared/SubtaskSection";
import { AssigneeField } from "@/components/features/task/fields/AssigneeField";

// ============================================
// Types & Constants
// ============================================

interface TaskAddProps {
  boardId: string;
  projectId: string;
  onSuccess?: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_user_id: string;
  started_at: string;
  ended_at: string;
  memo: string;
  subtasks: Subtask[];
};

type ProjectMember = {
  project_id: string;
  user_id: string;
  role: string;
  users: {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
};

const INITIAL_FORM_DATA: FormData = {
  title: "",
  description: "",
  status: "todo",
  priority: "normal",
  assigned_user_id: "",
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
  projectId,
  onSuccess,
  onCancel,
  initialStartDate,
  initialEndDate,
}: TaskAddProps) {
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
    started_at: initialStartDate || "",
    ended_at: initialEndDate || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [members, setMembers] = useState<ProjectMember[] | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${projectId}`
        );
        if (!response.ok) {
          throw new Error("프로젝트 멤버를 불러오는 데 실패했습니다.");
        }
        const result = await response.json();
        setMembers(result.data || []);
      } catch (error) {
        console.error(error);
        setErrors((prev) => ({
          ...prev,
          submit: "프로젝트 멤버를 불러오는 데 실패했습니다.",
        }));
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchMember();
  }, [projectId]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "제목은 필수입니다.";

    if (formData.started_at && formData.ended_at) {
      const start = new Date(formData.started_at);
      const end = new Date(formData.ended_at);
      if (start > end) {
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
      const payload: Omit<Task, "id" | "created_at" | "updated_at"> = {
        kanban_board_id: boardId,
        project_id: boardId,
        title: formData.title.trim(),
        description: cleanValue(formData.description),
        status: formData.status,
        priority: formData.priority,
        assigned_user_id: cleanValue(formData.assigned_user_id),
        started_at: formData.started_at || undefined,
        ended_at: formData.ended_at || undefined,
        memo: cleanValue(formData.memo),
        subtasks: formData.subtasks.length > 0 ? formData.subtasks : undefined,
      };

      onSuccess?.(payload);
    } catch (err) {
      console.error("작업 생성 실패:", err);
      setErrors({ submit: "작업 생성에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          새 작업 추가
        </h2>
      </div>

      {/* 에러 */}
      {errors.submit && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">
            {errors.submit}
          </p>
        </div>
      )}

      {/* 제목 */}
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
            errors.title
              ? "border-red-500 dark:border-red-600 focus:ring-red-300 dark:focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-main-300 dark:focus:ring-main-500"
          }`}
          placeholder="작업 제목을 입력하세요"
          autoFocus
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1 pl-3">
            * {errors.title}
          </p>
        )}
      </div>

      {/* 상태 & 우선순위 */}
      <StatusPrioritySection
        status={formData.status}
        priority={formData.priority}
        onStatusChange={(v) => handleChange("status", v)}
        onPriorityChange={(v) => handleChange("priority", v)}
      />

      {/* 설명 */}
      <FormSection icon="description" title="설명">
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-main-300 dark:focus:ring-main-500 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="설명을 입력하세요 "
          disabled={isSubmitting}
        />
      </FormSection>

      {/* 담당자 */}
      <AssigneeField
        value={formData.assigned_user_id}
        disabled={isSubmitting}
        onChange={(value) => handleChange("assigned_user_id", value)}
        isLoading={isLoadingMembers}
        members={members}
      />

      {/* 날짜 */}
      <FormSection icon="calendar" title="기간">
        <DateFields
          startDate={formData.started_at}
          endDate={formData.ended_at}
          error={errors.ended_at}
          disabled={isSubmitting}
          onStartDateChange={(value) => handleChange("started_at", value)}
          onEndDateChange={(value) => handleChange("ended_at", value)}
        />
      </FormSection>

      {/* 하위 할 일 */}
      <SubtaskSection
        subtasks={formData.subtasks}
        onUpdate={(list) => handleChange("subtasks", list)}
      />

      {/* 메모 */}
      <FormSection icon="notes" title="메모">
        <textarea
          value={formData.memo}
          onChange={(e) => handleChange("memo", e.target.value)}
          className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg focus:ring-yellow-400 dark:focus:ring-yellow-500 min-h-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="메모를 입력하세요"
          disabled={isSubmitting}
        />
      </FormSection>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 ">
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
