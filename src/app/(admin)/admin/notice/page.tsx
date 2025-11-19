import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBorderColor } from "@/app/sample/color/page";
import Link from "next/link";

export default function AdminNoticesPage() {
  return (
    <AdminPageWrapper
      title="공지사항 관리"
      titleIcon="bellFilled"
      action={
        <Button icon="plus" variant="primary" btnType="form" size={16}>
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
            <Button btnType="icon" icon="edit" size={16} variant="basic" />
            <Button btnType="icon" icon="trash" size={16} variant="warning" />
          </div>
        </div>
      </Link>
    </AdminPageWrapper>
  );
}
