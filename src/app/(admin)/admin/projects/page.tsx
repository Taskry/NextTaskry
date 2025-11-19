import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import Container from "@/components/shared/Container";
import { primaryBgColor, primaryBorderColor } from "@/app/sample/color/page";

export default function AdminProjectsPage() {
  const progress = 65;
  return (
    <AdminPageWrapper
      title="프로젝트 관리"
      titleIcon="folder"
      action={
        <div className="flex">
          <input
            type="text"
            placeholder="프로젝트 검색"
            className="text-sm font-normal w-full max-w-48 border"
          />
          <div>필터 자리</div>
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
          <Button
            icon="trash"
            radius="full"
            size="sm"
            variant="lightRed40"
            textColor="lightRed100"
          />
        </div>
        {/* 진행률 */}
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
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
