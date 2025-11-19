// components/task/PriorityBadge.tsx

import { TaskPriority } from "@/types";
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

  const priorityCircleColor = {
    high: "bg-red-500",
    normal: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1.5 ${PRIORITY_COLORS[priority]}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${priorityCircleColor[priority]}`}
      ></span>
      {priorityLabel[priority]}
    </span>
  );
};

export default PriorityBadge;
