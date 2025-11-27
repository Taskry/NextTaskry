"use client";

import { useState, useEffect } from "react";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { showToast } from "@/lib/utils/toast";
import { TASK_MESSAGES } from "@/lib/constants/messages";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";

// 공용 컴포넌트
import { FormSection } from "@/components/features/task/shared/FormSection";
import { StatusPrioritySection } from "@/components/features/task/shared/StatusPrioritySection";
import { DateFields } from "@/components/features/task/shared/DateFields";
import { SubtaskSection } from "@/components/features/task/shared/SubtaskSection";
import { AssigneeField } from "@/components/features/task/fields/AssigneeField";

import { Task } from "@/types/kanban";

// ===========================================
// utilities
// ===========================================

const dateTimeUtils = {
  // 저장용: 날짜+시간을 ISO 문자열로 변환
  toISOString: (dateStr: string, timeStr?: string) => {
    const time = timeStr || "00:00";
    return `${dateStr}T${time}:00.000Z`;
  },

  // 표시용: ISO 문자열을 날짜/시간으로 분리
  parseDateTime: (isoString?: string | null) => {
    if (!isoString) return { date: "", time: "", hasTime: false };

    const [datePart, timePart] = isoString.split("T");
    const [hours, minutes] = timePart.split(":");

    return {
      date: datePart,
      time: `${hours}:${minutes}`,
      hasTime: hours !== "00" || minutes !== "00",
    };
  },
};

// ============================================
// Types
// ============================================

interface TaskDetailProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  onClose?: () => void;
}

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

// ============================================
// Main Component
// ============================================

export default function TaskDetail({
  task,
  onUpdate,
  onDelete,
  onClose,
}: TaskDetailProps) {
  const startDateTime = dateTimeUtils.parseDateTime(task.started_at);
  const endDateTime = dateTimeUtils.parseDateTime(task.ended_at);

  const initialTask = {
    ...task,
    started_at: startDateTime.date,
    ended_at: endDateTime.date,
    start_time: startDateTime.time,
    end_time: endDateTime.time,
    use_time: startDateTime.hasTime || endDateTime.hasTime,
  };

  const [editedTask, setEditedTask] = useState<Task>(initialTask);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [members, setMembers] = useState<ProjectMember[] | null>(null);
  const { openModal, modalProps } = useModal();

  useEffect(() => {
    const fetchMember = async () => {
      if (!task.project_id) {
        console.warn("프로젝트 ID가 없습니다.");
        return;
      }

      setIsLoadingMembers(true);
      try {
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${task.project_id}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: 프로젝트 멤버를 불러오는 데 실패했습니다.`
          );
        }

        const result = await response.json();

        if (result.data) {
          setMembers(result.data);
        } else {
          console.warn("프로젝트 멤버 데이터가 없습니다:", result);
          setMembers([]);
        }
      } catch (error) {
        console.error("프로젝트 멤버 조회 에러:", error);
        // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록 처리
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMember();
  }, [task.project_id]);

  const hasChanges = () => {
    // 원본 데이터 파싱
    const originalStart = dateTimeUtils.parseDateTime(task.started_at);
    const originalEnd = dateTimeUtils.parseDateTime(task.ended_at);

    return (
      editedTask.title !== task.title ||
      (editedTask.description || "") !== (task.description || "") ||
      editedTask.status !== task.status ||
      (editedTask.priority || "normal") !== (task.priority || "normal") ||
      (editedTask.assigned_user_id || null) !==
        (task.assigned_user_id || null) ||
      // 날짜 비교
      editedTask.started_at !== originalStart.date ||
      editedTask.ended_at !== originalEnd.date ||
      (editedTask.use_time || false) !==
        (originalStart.hasTime || originalEnd.hasTime) ||
      (editedTask.use_time
        ? editedTask.start_time !== originalStart.time
        : false) ||
      (editedTask.use_time
        ? editedTask.end_time !== originalEnd.time
        : false) ||
      (editedTask.memo || "") !== (task.memo || "") ||
      JSON.stringify(editedTask.subtasks || []) !==
        JSON.stringify(task.subtasks || [])
    );
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges()) return;

    try {
      // 저장: 입력값 그대로 ISO 형식으로
      const startedAtISO = editedTask.started_at
        ? editedTask.use_time && editedTask.start_time
          ? dateTimeUtils.toISOString(
              editedTask.started_at,
              editedTask.start_time
            )
          : dateTimeUtils.toISOString(editedTask.started_at, "00:00")
        : null;

      const endedAtISO = editedTask.ended_at
        ? editedTask.use_time && editedTask.end_time
          ? dateTimeUtils.toISOString(editedTask.ended_at, editedTask.end_time)
          : dateTimeUtils.toISOString(editedTask.ended_at, "23:59")
        : null;

      // 데이터베이스 업데이트용 - UI 전용 필드 제외
      const updates: Partial<Task> = {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        assigned_user_id: editedTask.assigned_user_id,
        started_at: startedAtISO,
        ended_at: endedAtISO,
        start_time: editedTask.use_time ? editedTask.start_time : null,
        end_time: editedTask.use_time ? editedTask.end_time : null,
        use_time: editedTask.use_time || false,
        memo: editedTask.memo,
        subtasks: editedTask.subtasks,
        updated_at: new Date().toISOString(),
      };

      // 불필요한 필드 제거 (DB에 없는 컬럼들)
      const filteredUpdates = { ...updates };
      delete (filteredUpdates as any).id;
      delete (filteredUpdates as any).created_at;
      delete (filteredUpdates as any).kanban_boards;

      console.log("TaskDetail - Saving updates:", filteredUpdates);
      await onUpdate?.(task.id, filteredUpdates);
      showToast("작업이 저장되었습니다.", "success");

      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (error) {
      console.error("작업 저장 중 오류:", error);
      showToast("작업 저장에 실패했습니다.", "error");
    }
  };
  // 작업 삭제 확인 모달 열기
  const handleDelete = () => {
    openModal("delete", "작업 삭제", TASK_MESSAGES.DELETE_CONFIRM);
  };

  // 작업 삭제 실행
  const confirmDelete = async () => {
    try {
      await onDelete?.(task.id);

      // 삭제 성공 모달 표시
      openModal(
        "deleteSuccess",
        "작업 삭제 완료",
        "선택한 작업이 삭제되었습니다."
      );

      // 5초 후 자동으로 모달 닫기 (deleteSuccess 모달은 자동 닫힘)
      setTimeout(() => {
        onClose?.();
      }, 5000);
    } catch (error) {
      console.error("작업 삭제 중 오류:", error);
      openModal("error", "삭제 실패", "작업 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header createdAt={task.created_at} updatedAt={task.updated_at} />

      {/* Title */}
      <TitleField
        value={editedTask.title}
        isEditing={editingField === "title"}
        onEdit={() => setEditingField("title")}
        onChange={(v: string) => handleChange("title", v)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      {/* Status & Priority */}
      <StatusPrioritySection
        status={editedTask.status}
        priority={editedTask.priority || "normal"}
        onStatusChange={(v) => handleChange("status", v)}
        onPriorityChange={(v) => handleChange("priority", v)}
      />

      {/* Description */}
      <FormSection icon="description" title="설명">
        <DescriptionField
          value={editedTask.description}
          isEditing={editingField === "description"}
          onEdit={() => setEditingField("description")}
          onChange={(v: string) => handleChange("description", v)}
          onBlur={() => setEditingField(null)}
          onCancel={() => {
            setEditedTask(task);
            setEditingField(null);
          }}
        />
      </FormSection>

      {/* Assignee */}
      <AssigneeField
        value={editedTask.assigned_user_id}
        isEditing={editingField === "assigned_user_id"}
        isLoading={isLoadingMembers}
        members={members}
        onEdit={() => setEditingField("assigned_user_id")}
        onChange={(v) => handleChange("assigned_user_id", v)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      {/* Dates → Add와 동일한 UI */}
      <FormSection icon="calendar" title="기간">
        <DateFields
          startDate={editedTask.started_at || ""}
          endDate={editedTask.ended_at || ""}
          startTime={editedTask.start_time || ""}
          endTime={editedTask.end_time || ""}
          useTime={editedTask.use_time || false}
          onStartDateChange={(v: string) => handleChange("started_at", v)}
          onEndDateChange={(v: string) => handleChange("ended_at", v)}
          onStartTimeChange={(v: string) => handleChange("start_time", v)}
          onEndTimeChange={(v: string) => handleChange("end_time", v)}
          onUseTimeChange={(v: boolean) => handleChange("use_time", v)}
        />
      </FormSection>

      {/* Subtasks */}
      <SubtaskSection
        subtasks={editedTask.subtasks || []}
        onUpdate={(list) => handleChange("subtasks", list)}
      />

      {/* Memo */}
      <FormSection icon="notes" title="메모">
        <MemoField
          value={editedTask.memo}
          isEditing={editingField === "memo"}
          onEdit={() => setEditingField("memo")}
          onChange={(v: string) => handleChange("memo", v)}
          onBlur={() => setEditingField(null)}
          onCancel={() => {
            setEditedTask(task);
            setEditingField(null);
          }}
        />
      </FormSection>

      {/* Action Buttons */}
      <ActionButtons
        hasChanges={hasChanges()}
        onCancel={() => setEditedTask(task)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* 삭제 확인 모달 */}
      <Modal {...modalProps} onConfirm={confirmDelete} />
    </div>
  );
}

// ============================================
// Sub Components
// ============================================

function Header({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpdated = createdAt !== updatedAt;

  return (
    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
        {/* 생성 정보 */}
        <div className="flex items-center gap-2">
          <Icon
            type="clock"
            size={16}
            className="text-gray-400 dark:text-gray-500"
          />
          <span className="font-medium text-gray-600 dark:text-gray-400">
            생성:
          </span>
          <span>{formatDate(createdAt)}</span>
          {/* TODO: 작성자 정보 추가 시 사용 */}
          {/* <span className="text-gray-400 dark:text-gray-500">by</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">작성자명</span> */}
        </div>

        {/* 수정 정보 */}
        {isUpdated && (
          <div className="flex items-center gap-2">
            <Icon
              type="edit"
              size={16}
              className="text-gray-400 dark:text-gray-500"
            />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              수정:
            </span>
            <span>{formatDate(updatedAt)}</span>
            {/* TODO: 수정자 정보 추가 시 사용 */}
            {/* <span className="text-gray-400 dark:text-gray-500">by</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">수정자명</span> */}
          </div>
        )}
      </div>
    </div>
  );
}

function TitleField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: any) {
  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") onBlur();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="text-2xl font-bold text-gray-800 dark:text-gray-200 w-full border-b-2 border-main-300 dark:border-main-600 focus:outline-none pb-2 bg-transparent"
      />
    );
  }

  return (
    <h2
      onClick={onEdit}
      className="text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer hover:text-main-500 dark:hover:text-main-400 transition-colors flex items-center gap-2"
    >
      <Icon
        type="edit"
        size={20}
        className="text-gray-600 dark:text-gray-400"
      />
      {value}
    </h2>
  );
}

function DescriptionField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: any) {
  return isEditing ? (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      autoFocus
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 dark:focus:ring-main-500 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
    />
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded min-h-[60px] transition-colors"
    >
      {value || (
        <span className="text-gray-400 dark:text-gray-500">
          클릭하여 설명 추가
        </span>
      )}
    </p>
  );
}

function MemoField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: any) {
  if (isEditing) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 min-h-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    );
  }

  return value ? (
    <div
      onClick={onEdit}
      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
    >
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {value}
      </p>
    </div>
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-4 border border-dashed border-yellow-200 dark:border-yellow-700/50 rounded-lg transition-colors"
    >
      클릭하여 메모 추가
    </p>
  );
}

function ActionButtons({ hasChanges, onCancel, onSave, onDelete }: any) {
  return (
    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* 삭제 */}
      <Button btnType="form_s" variant="warning" onClick={onDelete}>
        삭제
      </Button>

      {/* 취소/저장 */}
      {hasChanges && (
        <div className="flex gap-3">
          <Button btnType="basic" variant="basic" onClick={onCancel}>
            취소
          </Button>
          <Button btnType="form" variant="primary" onClick={onSave}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
}
