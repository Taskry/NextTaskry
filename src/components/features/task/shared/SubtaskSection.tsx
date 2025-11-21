// 하위 할 일 섹션 컴포넌트
import { FieldLabel } from "@/components/features/task/shared/FieldLabel";
import SubtaskList from "@/components/features/task/fields/SubtaskList";
import { Subtask } from "@/types";

export function SubtaskSection({
  subtasks,
  onUpdate,
}: {
  subtasks: Subtask[];
  onUpdate: (list: Subtask[]) => void;
}) {
  return (
    <div>
      <FieldLabel icon="checkList" title="하위 할 일" />
      <SubtaskList subtasks={subtasks} editable={true} onUpdate={onUpdate} />
    </div>
  );
}
