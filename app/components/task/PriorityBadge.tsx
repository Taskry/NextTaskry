// components/task/PriorityBadge.tsx

import { TaskPriority } from "@/app/types";
import { PRIORITY_COLORS } from "@/lib/constants";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const priorityLabel = {
    high: "높음",
    normal: "보통",
    low: "낮음",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium ${PRIORITY_COLORS[priority]}`}
    >
      {priorityLabel[priority]}
    </span>
  );
};

export default PriorityBadge;
