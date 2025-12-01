import { Skeleton } from "@/components/ui/shadcn/Skeleton";

export const UserTableSkeleton = () => {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      {/* 이름 - text-center 영역 */}
      <div className="flex justify-center w-[15%]">
        <Skeleton className="h-5 w-24" />
      </div>

      {/* 이메일 - text-center 영역 */}
      <div className="flex justify-center w-[42%]">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* 권한 셀렉트 박스 - text-center 영역 */}
      <div className="flex justify-center w-[23%]">
        <Skeleton className="h-8 w-24 rounded" />
      </div>

      {/* 삭제 아이콘 */}
      <div className="w-[30%]">
        <Skeleton className="h-8 w-8 rounded-full mx-auto" />
      </div>
    </div>
  );
};
