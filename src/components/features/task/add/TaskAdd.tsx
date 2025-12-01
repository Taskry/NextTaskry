// src/components/features/task/add/TaskAdd.tsx
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
  projectStartedAt?: string;
  projectEndedAt?: string;
  onSuccess?: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  initialUseTime?: boolean;
}

type FormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_user_id: string;
  started_at: string;
  ended_at: string;
  start_time: string; // 추가
  end_time: string; // 추가
  use_time: boolean; // 추가
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
  start_time: "", // 비워둠 (사용자가 선택)
  end_time: "", // 비워둠 (사용자가 선택)
  use_time: false, // 기본적으로 날짜만
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
  projectStartedAt,
  projectEndedAt,
  onSuccess,
  onCancel,
  initialStartDate,
  initialEndDate,
  initialStartTime,
  initialEndTime,
  initialUseTime,
}: TaskAddProps) {
  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_DATA,
    started_at: initialStartDate || "",
    ended_at: initialEndDate || "",
    start_time: initialStartTime || "",
    end_time: initialEndTime || "",
    use_time: initialUseTime || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [members, setMembers] = useState<ProjectMember[] | null>(null);

  // 프로젝트 종료 상태 체크
  const isProjectEnded = (() => {
    if (!projectEndedAt) return false;
    const today = new Date().toISOString().split("T")[0];
    return today > projectEndedAt;
  })();

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
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // "시간 지정" 체크 시 기본 시간값 자동 설정
      if (field === "use_time" && value === true) {
        // console.log("⏰ 시간 지정 체크됨, 기본 시간값 설정");
        if (!newData.start_time) {
          newData.start_time = "09:00";
        }
        if (!newData.end_time) {
          newData.end_time = "18:00";
        }
      }

      // "시간 지정" 해제 시 시간값 초기화
      if (field === "use_time" && value === false) {
        // console.log("⏰ 시간 지정 해제됨, 시간값 초기화");
        newData.start_time = "";
        newData.end_time = "";
      }

      // 시간을 모두 지우면 use_time을 false로 설정
      if (
        (field === "start_time" || field === "end_time") &&
        (!value || !value.trim())
      ) {
        const otherTimeField =
          field === "start_time" ? newData.end_time : newData.start_time;
        if (!otherTimeField || !otherTimeField.trim()) {
          // console.log(`⏰ 시간 모두 삭제됨, use_time을 false로 설정`);
          newData.use_time = false;
        }
      }

      // console.log("TaskAdd - Updated formData:", newData);
      return newData;
    });
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
      // 시간까지 고려한 검증
      const startDateTime =
        formData.use_time && formData.start_time
          ? new Date(`${formData.started_at}T${formData.start_time}:00`)
          : new Date(formData.started_at);

      const endDateTime =
        formData.use_time && formData.end_time
          ? new Date(`${formData.ended_at}T${formData.end_time}:00`)
          : new Date(formData.ended_at);

      // ✅ 수정: 시작과 종료가 같아도 허용 (> 사용으로 변경)
      if (startDateTime > endDateTime) {
        newErrors.ended_at = "종료 시간은 시작 시간보다 이전일 수 없습니다.";
      }
    }

    // 시간 지정 시 시간 입력 확인
    if (formData.use_time) {
      if (formData.started_at && !formData.start_time) {
        newErrors.start_time = "시작 시간을 입력하세요.";
      }
      if (formData.ended_at && !formData.end_time) {
        newErrors.end_time = "종료 시간을 입력하세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      // 입력된 날짜+시간을 UTC 기준으로 저장
      const toUTCString = (dateStr: string, timeStr?: string) => {
        // 사용자 입력 시간을 UTC로 직접 변환 (시간대 보정 없이)
        const [year, month, day] = dateStr.split("-");
        const [hour, minute] = (timeStr || "00:00").split(":");

        const utcDate = new Date(
          Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            0,
            0
          )
        );

        return utcDate.toISOString();
      };

      // ✅ 날짜는 항상 자정(00:00:00)으로 저장
      // ✅ 실제 시간은 start_time/end_time 컬럼에 별도 저장
      const startedAtISO = formData.started_at
        ? `${formData.started_at}T00:00:00`
        : undefined;

      const endedAtISO = formData.ended_at
        ? `${formData.ended_at}T00:00:00`
        : undefined;

      // 데이터베이스 저장용 payload (UI 전용 필드 제외)
      const payload: Omit<Task, "id" | "created_at" | "updated_at"> = {
        kanban_board_id: boardId,
        project_id: projectId,
        title: formData.title.trim(),
        description: cleanValue(formData.description),
        status: formData.status,
        priority: formData.priority,
        assigned_user_id: cleanValue(formData.assigned_user_id),
        started_at: startedAtISO,
        ended_at: endedAtISO,
        start_time: formData.use_time ? formData.start_time : null,
        end_time: formData.use_time ? formData.end_time : null,
        use_time: formData.use_time,
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
    <div className="task-form-layout">
      {/* 헤더 - 고정 */}
      <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          새 작업 추가
        </h2>
      </div>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="task-form-content space-y-5">
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
            className={`w-full px-3 py-2.5 border rounded-lg input-focus-style bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.title
                ? "border-red-500 dark:border-red-600"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="작업 제목을 입력하세요"
            autoFocus
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1 pl-1">
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
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg input-focus-style min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="설명을 입력하세요"
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
            startTime={formData.start_time}
            endTime={formData.end_time}
            useTime={formData.use_time}
            projectStartedAt={projectStartedAt}
            projectEndedAt={projectEndedAt}
            disabled={isSubmitting}
            onStartDateChange={(v: string) => handleChange("started_at", v)}
            onEndDateChange={(v: string) => handleChange("ended_at", v)}
            onStartTimeChange={(v: string) => handleChange("start_time", v)}
            onEndTimeChange={(v: string) => handleChange("end_time", v)}
            onUseTimeChange={(v: boolean) => handleChange("use_time", v)}
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
            className="w-full px-3 py-2.5 border border-yellow-300 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg input-focus-style min-h-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="메모를 입력하세요"
            disabled={isSubmitting}
          />
        </FormSection>
      </div>

      {/* 액션 버튼 - Sticky Footer */}
      <div className="task-form-footer flex justify-end gap-3 pt-4 bg-white dark:bg-gray-800">
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
          disabled={isSubmitting || isProjectEnded}
        >
          {isSubmitting
            ? "생성 중..."
            : isProjectEnded
            ? "프로젝트 종료됨"
            : "작업 추가"}
        </Button>
      </div>
    </div>
  );
}
