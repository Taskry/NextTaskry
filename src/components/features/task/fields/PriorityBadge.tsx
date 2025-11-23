// components/task/PriorityBadge.tsx

import { TaskPriority } from "@/types";
import Badge from "@/components/ui/Badge";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return <Badge type={priority} />;
};

export default PriorityBadge;
