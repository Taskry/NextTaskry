// components/task/AssigneeInfo.tsx

interface AssigneeInfoProps {
  assignedTo: string;
}

const AssigneeInfo = ({ assignedTo }: AssigneeInfoProps) => {
  return (
    <span className="text-sm text-gray-600">
      👤 User {assignedTo.slice(-1)}
    </span>
  );
};

export default AssigneeInfo;
