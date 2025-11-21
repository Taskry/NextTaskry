// 공통 섹션 라벨 컴포넌트
import { Icon } from "@/components/shared/Icon";

export function FieldLabel({ icon, title }: { icon: string; title: string }) {
  return (
    <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
      <Icon type={icon} size={16} color="#6B7280" />
      {title}
    </h3>
  );
}
