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
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {/* 상태 */}
      <div className="flex items-center gap-2 min-w-fit">
        <Icon
          type="progressAlert"
          size={16}
          className="text-gray-600 dark:text-gray-400"
        />
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
          상태
        </h3>
        <BadgeSelector
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
        />
      </div>

      {/* 우선순위 */}
      <div className="flex items-center gap-2 min-w-fit">
        <Icon
          type="alertTriangle"
          size={16}
          className="text-gray-600 dark:text-gray-400"
        />
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
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
