// 작업의 상태 및 우선순위 선택 섹션 컴포넌트, 동일한 UI가 여러 곳에서 사용됨
import { Icon } from "@/components/shared/Icon";
import BadgeSelector from "@/components/features/task/fields/BadgeSelector";
import { TaskPriority, TaskStatus } from "@/types";

const STATUS_OPTIONS: {
  value: string;
  badgeType: "todo" | "inProgress" | "done";
}[] = [
  { value: "todo", badgeType: "todo" },
  { value: "inprogress", badgeType: "inProgress" },
  { value: "done", badgeType: "done" },
];

const PRIORITY_OPTIONS: {
  value: string;
  badgeType: "low" | "normal" | "high";
}[] = [
  { value: "low", badgeType: "low" },
  { value: "normal", badgeType: "normal" },
  { value: "high", badgeType: "high" },
];

export function StatusPrioritySection({
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
      {/* 상태 */}
      <div className="flex items-center gap-2">
        <Icon type="progressAlert" size={16} color="#6B7280" />
        <h3 className="text-sm font-semibold text-gray-600">상태</h3>
        <BadgeSelector
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />
      </div>

      {/* 우선순위 */}
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
