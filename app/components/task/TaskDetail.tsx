"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/app/types";
import { Icon } from "../Icon/Icon";
import Button from "../Button/Button";
import SubtaskList from "./SubtaskList";
import BadgeSelector from "./BadgeSelector";
import { showToast } from "@/lib/toast";
import { TASK_MESSAGES } from "@/lib/constants/messages";

// ============================================
// Types & Constants
// ============================================

interface TaskDetailProps {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose?: () => void;
}

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

const MOCK_TEAM_MEMBERS = [
  "김철수",
  "이영희",
  "박민수",
  "최지원",
  "정수현",
  "강민지",
  "윤대현",
  "송하늘",
  "임서연",
];

// ============================================
// Main Component
// ============================================

export default function TaskDetail({
  task,
  onUpdate,
  onDelete,
  onClose,
}: TaskDetailProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const hasChanges = () => {
    return JSON.stringify(editedTask) !== JSON.stringify(task);
  };

  const handleSave = () => {
    if (!hasChanges()) return;

    const updatedTask = {
      ...editedTask,
      updated_at: new Date().toISOString(),
    };

    onUpdate?.(updatedTask);
    setEditingField(null);
    showToast("작업이 저장되었습니다.", "success");
  };

  const handleClose = () => {
    if (hasChanges()) {
      const confirmed = confirm("변경 사항이 있습니다. 저장하시겠습니까?");
      if (confirmed) {
        handleSave();
      } else {
        setEditedTask(task);
      }
    }
    onClose?.();
  };

  const handleDelete = () => {
    if (!confirm(TASK_MESSAGES.DELETE_CONFIRM)) return;
    onDelete?.(task.id);
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Header createdAt={task.created_at} />

      <TitleField
        value={editedTask.title}
        isEditing={editingField === "title"}
        onEdit={() => setEditingField("title")}
        onChange={(value) => handleChange("title", value)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      <StatusPriorityRow
        status={editedTask.status}
        priority={editedTask.priority || "normal"}
        onStatusChange={(value) => handleChange("status", value)}
        onPriorityChange={(value) => handleChange("priority", value)}
      />

      <DescriptionField
        value={editedTask.description}
        isEditing={editingField === "description"}
        onEdit={() => setEditingField("description")}
        onChange={(value) => handleChange("description", value)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      <AssigneeField
        value={editedTask.assigned_to}
        isEditing={editingField === "assigned_to"}
        onEdit={() => setEditingField("assigned_to")}
        onChange={(value) => handleChange("assigned_to", value)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      <DateFields
        startDate={editedTask.started_at}
        endDate={editedTask.ended_at}
        editingField={editingField}
        onStartEdit={() => setEditingField("started_at")}
        onEndEdit={() => setEditingField("ended_at")}
        onStartChange={(value) => handleChange("started_at", value)}
        onEndChange={(value) => handleChange("ended_at", value)}
        onBlur={() => setEditingField(null)}
      />

      <SubtaskField
        subtasks={editedTask.subtasks || []}
        onUpdate={(list) => handleChange("subtasks", list)}
      />

      <MemoField
        value={editedTask.memo}
        isEditing={editingField === "memo"}
        onEdit={() => setEditingField("memo")}
        onChange={(value) => handleChange("memo", value)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      {/* ✅ 항상 하단에 액션 버튼 표시 */}
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
}: {
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCancel: () => void;
}) {
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
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: {
  value: string | null | undefined;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="description" size={16} color="#6B7280" />
        설명
      </h3>
      {isEditing ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
          }}
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-300 focus:outline-none min-h-[100px]"
          placeholder="설명을 입력하세요"
        />
      ) : (
        <p
          onClick={onEdit}
          className="text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 p-3 rounded transition-colors min-h-[60px]"
        >
          {value || "클릭하여 설명 추가"}
        </p>
      )}
    </div>
  );
}

function AssigneeField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: {
  value: string | null | undefined;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCancel: () => void;
}) {
  const filteredMembers = MOCK_TEAM_MEMBERS.filter((name) =>
    name.toLowerCase().includes(value?.toLowerCase() || "")
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="userCircle" size={16} color="#6B7280" />
        담당자
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          <div className="relative">
            <Icon
              type="search"
              size={18}
              color="#9CA3AF"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") onBlur();
                if (e.key === "Escape") onCancel();
              }}
              autoFocus
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-300 focus:outline-none"
              placeholder="담당자 이름을 입력하세요"
            />
          </div>
          {value && filteredMembers.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {filteredMembers.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    onChange(name);
                    onBlur();
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-main-600">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : value ? (
        <div
          onClick={onEdit}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
            <span className="text-sm font-medium text-main-600">
              {value.charAt(0)}
            </span>
          </div>
          <span className="text-gray-700">{value}</span>
        </div>
      ) : (
        <p
          onClick={onEdit}
          className="text-gray-400 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          클릭하여 담당자 추가
        </p>
      )}
    </div>
  );
}

function DateFields({
  startDate,
  endDate,
  editingField,
  onStartEdit,
  onEndEdit,
  onStartChange,
  onEndChange,
  onBlur,
}: {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  editingField: string | null;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="calendarPlus" size={16} color="#6B7280" />
          시작일
        </h3>
        {editingField === "started_at" ? (
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartChange(e.target.value)}
            onBlur={onBlur}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-300 focus:outline-none"
          />
        ) : (
          <p
            onClick={onStartEdit}
            className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            {startDate
              ? new Date(startDate).toLocaleDateString("ko-KR")
              : "클릭하여 시작일 설정"}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="calendarCheck" size={16} color="#6B7280" />
          마감일
        </h3>
        {editingField === "ended_at" ? (
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndChange(e.target.value)}
            onBlur={onBlur}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-300 focus:outline-none"
          />
        ) : (
          <p
            onClick={onEndEdit}
            className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            {endDate
              ? new Date(endDate).toLocaleDateString("ko-KR")
              : "클릭하여 마감일 설정"}
          </p>
        )}
      </div>
    </div>
  );
}

function SubtaskField({
  subtasks,
  onUpdate,
}: {
  subtasks: any[];
  onUpdate: (list: any[]) => void;
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
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: {
  value: string | null | undefined;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="notes" size={16} color="#6B7280" />
        메모
      </h3>
      {isEditing ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
          }}
          autoFocus
          className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none min-h-20"
          placeholder="메모를 입력하세요"
        />
      ) : value ? (
        <div
          onClick={onEdit}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <p className="text-gray-700 whitespace-pre-wrap">{value}</p>
        </div>
      ) : (
        <p
          onClick={onEdit}
          className="text-gray-400 cursor-pointer hover:bg-yellow-50 p-4 border border-dashed border-yellow-200 rounded-lg transition-colors"
        >
          클릭하여 메모 추가
        </p>
      )}
    </div>
  );
}

function ActionButtons({
  hasChanges,
  onCancel,
  onSave,
  onDelete,
}: {
  hasChanges: boolean;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between pt-4 border-t">
      {/* 왼쪽: 삭제 버튼 */}
      <Button btnType="form_s" variant="warning" onClick={onDelete}>
        삭제
      </Button>

      {/* 오른쪽: 취소/저장 버튼 */}
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
