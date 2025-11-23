"use client";

import { useState, useEffect } from "react";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { showToast } from "@/lib/utils/toast";
import { TASK_MESSAGES } from "@/lib/constants/messages";

// 공용 컴포넌트
import { FormSection } from "@/components/features/task/shared/FormSection";
import { StatusPrioritySection } from "@/components/features/task/shared/StatusPrioritySection";
import { DateFields } from "@/components/features/task/shared/DateFields";
import { SubtaskSection } from "@/components/features/task/shared/SubtaskSection";
import { AssigneeField } from "@/components/features/task/fields/AssigneeField";

import { Task } from "@/types/kanban";

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
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [members, setMembers] = useState<ProjectMember[] | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${task.project_id}`
        );
        if (!response.ok) {
          throw new Error("프로젝트 멤버를 불러오는 데 실패했습니다.");
        }
        const result = await response.json();
        setMembers(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchMember();
  }, [task.project_id]);

  const hasChanges = () => JSON.stringify(editedTask) !== JSON.stringify(task);

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!hasChanges()) return;

    const updates: Partial<Task> = {};

    Object.keys(editedTask).forEach((key) => {
      const k = key as keyof Task;
      if (editedTask[k] !== task[k]) updates[k] = editedTask[k] as any;
    });

    updates.updated_at = new Date().toISOString();
    delete (updates as any).id;
    delete (updates as any).created_at;
    delete (updates as any).kanban_boards;

    onUpdate?.(task.id, updates);
    showToast("작업이 저장되었습니다.", "success");

    // 저장 후 모달 닫기
    setTimeout(() => {
      onClose?.();
    }, 500);
  };

  const handleDelete = () => {
    if (!confirm(TASK_MESSAGES.DELETE_CONFIRM)) return;
    onDelete?.(task.id);
    showToast("작업이 삭제되었습니다.", "deleted");

    // 삭제 후 모달 닫기
    setTimeout(() => {
      onClose?.();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header createdAt={task.created_at} />

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
          onStartDateChange={(v) => handleChange("started_at", v)}
          onEndDateChange={(v) => handleChange("ended_at", v)}
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
    </div>
  );
}

// ============================================
// Sub Components
// ============================================

function Header({ createdAt }: { createdAt: string }) {
  return (
    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Icon
          type="clock"
          size={16}
          className="text-gray-400 dark:text-gray-500"
        />
        <span>생성일: {new Date(createdAt).toLocaleDateString("ko-KR")}</span>
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-main-300 dark:focus:ring-main-500 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
        className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg focus:ring-yellow-400 dark:focus:ring-yellow-500 min-h-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
