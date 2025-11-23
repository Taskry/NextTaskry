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
  };

  const handleDelete = () => {
    if (!confirm(TASK_MESSAGES.DELETE_CONFIRM)) return;
    onDelete?.(task.id);
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
    <div className="pb-4 border-b">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon type="clock" size={16} color="#9CA3AF" />
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
        className="text-2xl font-bold text-gray-800 w-full border-b-2 border-main-300 focus:outline-none pb-2"
      />
    );
  }

  return (
    <h2
      onClick={onEdit}
      className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-main-500 transition-colors flex items-center gap-2"
    >
      <Icon type="edit" size={20} color="#6B7280" />
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
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-main-300 min-h-[100px]"
    />
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 p-3 rounded min-h-[60px]"
    >
      {value || "클릭하여 설명 추가"}
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
        className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:ring-yellow-400 min-h-20"
      />
    );
  }

  return value ? (
    <div
      onClick={onEdit}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:bg-yellow-100"
    >
      <p className="text-gray-700 whitespace-pre-wrap">{value}</p>
    </div>
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-400 cursor-pointer hover:bg-yellow-50 p-4 border border-dashed border-yellow-200 rounded-lg"
    >
      클릭하여 메모 추가
    </p>
  );
}

function ActionButtons({ hasChanges, onCancel, onSave, onDelete }: any) {
  return (
    <div className="flex justify-between pt-4 border-t">
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
