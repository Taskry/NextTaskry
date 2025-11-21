import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBorderColor } from "@/app/sample/color/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNotices } from "@/lib/api/notices";
import { showToast } from "@/lib/utils/toast";
import { Notice } from "@/app/data/mockNotices";
import { formatDate } from "@/lib/utils/utils";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await getNotices();
      setNotices(res.data);
    } catch (error) {
      console.error("공지사항 로드 오류: ", error);
      showToast("공지사항을 불러오는 데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <AdminPageWrapper
      title="공지사항 관리"
      titleIcon="bellFilled"
      action={
        <Button btnType="form_s" icon="plus" size={18} hasIcon={true}>
          새 공지사항
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-center">공지사항을 불러오고 있는 중입니다...</p>
      ) : (
        notices.map((notice, index) => (
          <Link
            key={notice.announcement_id || index}
            href={`notice/${notice.announcement_id}`}
            className={`border ${primaryBorderColor.Color2[0]} py-7 px-5 rounded-xl mb-4 block`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <ul className="flex gap-5 mt-3">
                  <li className="font-normal text-sm">
                    작성일 | {formatDate(notice.created_at)}
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button btnType="icon" icon="edit" size={16} variant="basic" />
                <Button
                  btnType="icon"
                  icon="trash"
                  size={16}
                  variant="warning"
                />
              </div>
            </div>
          </Link>
        ))
      )}
    </AdminPageWrapper>
  );
}
