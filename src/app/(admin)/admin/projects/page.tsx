import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBgColor, primaryBorderColor } from "@/app/sample/color/page";
import { Icon } from "@/components/shared/Icon";

export default function AdminProjectsPage() {
  const progress = 65;
  return (
    <AdminPageWrapper
      title="프로젝트 관리"
      titleIcon="folder"
      action={
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="프로젝트 검색"
            className="h-12 text-sm font-normal w-2xs border px-3 rounded-md"
          />
          <div className="h-12 flex items-center gap-1 rounded-md border border-gray-100 px-3 cursor-pointer">
            <Icon type="filter" size={18} />
            <span className="inline-block">필터</span>
          </div>
        </div>
      }
    >
      <div
        className={`border ${primaryBorderColor.Color2[0]} py-7 px-5 rounded-xl mb-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              프로젝트명 <Badge type="dueSoon" />
            </h3>
            <ul className="flex gap-5 mt-3">
              <li className="font-normal text-sm">리더: 김이름</li>
              <li className="font-normal text-sm">멤버: 5명</li>
            </ul>
          </div>
          <Button btnType="icon" icon="trash" size={16} variant="basic" />
        </div>
        {/* 진행률 */}
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`w-100% ${primaryBgColor.Color2[0]} rounded-full h-2.5 overflow-hidden mt-5`}
        >
          <div
            className={`${primaryBgColor.color1[1]} h-2.5 transition-all duration-500 rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}
