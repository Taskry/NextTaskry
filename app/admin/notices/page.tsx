import Button from "@/app/components/Button/Button";
import AdminPageWrapper from "@/app/components/UI/Admin/AdminPageWrapper";
import { primaryBgColor, primaryBorderColor } from "@/app/sample/color/page";
import Link from "next/link";

export default function AdminNoticesPage() {
  return (
    <AdminPageWrapper
      title="공지사항 관리"
      titleIcon="bellFilled"
      action={
        <Button
          icon="plus"
          iconSize="sm"
          variant="bgMain300"
          size="sm"
          radius="sm"
          textColor="white"
        >
          새 공지사항
        </Button>
      }
    >
      <Link
        href=""
        className={`border ${primaryBorderColor.Color2[0]} py-7 px-5 rounded-xl mb-4 block`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">공지사항1</h3>
            <ul className="flex gap-5 mt-3">
              <li className="font-normal text-sm">작성일 | 2025-11-10</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              icon="edit"
              radius="full"
              size="full"
              variant="lightMain40"
            />
            <Button
              icon="trash"
              radius="full"
              size="full"
              variant="lightRed40"
              textColor="lightRed100"
            />
          </div>
        </div>
      </Link>
    </AdminPageWrapper>
  );
}
