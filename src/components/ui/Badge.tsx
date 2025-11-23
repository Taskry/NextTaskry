import { bgColorOpacity } from "@/app/sample/color/page";
interface BadgeType {
  type: keyof typeof badgeConfigs;
}

export const badgeConfigs = {
  dueSoon: {
    title: "계획 진행중",
    className: `${bgColorOpacity.colorOpacity2[3]}`,
    category: "status",
  },
  overDue: {
    title: "계획에서 벗어남",
    className: `${bgColorOpacity.colorOpacity2[0]} text-red-700`,
    category: "status",
  },
  todo: {
    title: "TODO",
    className: "bg-[#9CA3AF]",
    category: "status",
  },
  inProgress: {
    title: "진행중",
    className: `${bgColorOpacity.colorOpacity2[4]}`,
    category: "status",
  },
  done: {
    title: "완료",
    className: `${bgColorOpacity.colorOpacity3[1]}`,
    category: "status",
  },
  high: {
    title: "높음",
    className: `${bgColorOpacity.colorOpacity2[2]}`,
    category: "priority",
    dotColor: `${bgColorOpacity.colorOpacity2[0]}`,
  },
  normal: {
    title: "보통",
    className: `${bgColorOpacity.colorOpacity[5]}`,
    category: "priority",
    dotColor: `${bgColorOpacity.colorOpacity[3]}`,
  },
  low: {
    title: "낮음",
    className: `${bgColorOpacity.colorOpacity3[2]}`,
    category: "priority",
    dotColor: `${bgColorOpacity.colorOpacity3[0]}`,
  },
};

const PriorityDot = ({ color }: { color: string }) => {
  return (
    <span
      className={`w-2 h-2 inline-block mr-1 rounded-full ${color}`}
      aria-hidden="true"
    ></span>
  );
};

export default function Badge({ type }: BadgeType) {
  const badgeConfig = badgeConfigs[type];
  if (!badgeConfig) return null;

  return (
    <span
      data-type={type}
      className={`py-1.5 px-2 rounded-sm text-xs font-medium ${badgeConfig.className}`}
    >
      {(badgeConfig.category === "priority" ||
        (badgeConfig as any).dotColor) && (
        <PriorityDot color={(badgeConfig as any).dotColor} />
      )}
      {badgeConfig.title}
    </span>
  );
}
