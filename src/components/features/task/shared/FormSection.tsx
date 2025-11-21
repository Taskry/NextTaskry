// 설명, 날짜, 메모, 서브태스크 등 폼 섹션을 감싸는 컴포넌트
import { FieldLabel } from "@/components/features/task/shared/FieldLabel";

export function FormSection({
  icon,
  title,
  children,
  className = "",
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel icon={icon} title={title} />
      {children}
    </div>
  );
}
