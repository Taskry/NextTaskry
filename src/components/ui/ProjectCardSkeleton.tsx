import { Skeleton } from "@/components/ui/shadcn/Skeleton";

export const ProjectCardSkeleton = () => {
  return (
    <div className="border rounded-lg py-6 px-4 space-y-3">
      {/* 제목 */}
      <Skeleton className="h-6 w-[70%]" />

      {/* 설명 */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[85%]" />

      {/* 하단: 팀원 수 + 아이콘들 */}
      <div className="flex flex-col items-end justify-end gap-3 pt-2">
        {/* 4 팀원 */}
        <Skeleton className="h-5 w-16" />

        {/* 취소, 삭제 아이콘 */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
