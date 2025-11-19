import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBgColor, primaryBorderColor } from "@/app/sample/color/page";

export default function AdminUsersPage() {
  const data = [
    {
      name: "홍길동1",
      email: "qwer@example.com",
      role: "Admin",
      project: "프로젝트명",
    },
    {
      name: "홍길동2",
      email: "qwer@example.com",
      role: "Editor",
      project: "프로젝트명",
    },
    {
      name: "홍길동3",
      email: "qwer@example.com",
      role: "Viewer",
      project: "프로젝트명",
    },
    {
      name: "홍길동4",
      email: "qwer@example.com",
      role: "Editor",
      project: "프로젝트명",
    },
  ];

  return (
    <>
      <AdminPageWrapper
        title="유저 관리"
        titleIcon="userCircle"
        action={
          <div className="flex">
            <input
              type="text"
              placeholder="유저 검색"
              className="text-sm font-normal w-full max-w-48 border"
            />
            <div>필터 자리</div>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead
            className={`${primaryBgColor.color1[2]} text-white text-sm uppercase`}
          >
            <tr>
              <th className="py-3 px-4 text-center text-sm">이름</th>
              <th className="py-3 px-4 text-center text-sm">이메일</th>
              <th className="py-3 px-4 text-center text-sm">권한</th>
              <th className="py-3 px-4 text-center text-sm">프로젝트</th>
              <th className="py-3 px-4 text-center text-sm">삭제</th>
            </tr>
          </thead>

          <tbody className="divide-y text-sm bg-[#ffffff]">
            {data.map((user, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <select name="" id="">
                    <option value="">리더</option>
                    <option value="">멤버</option>
                  </select>
                </td>
                <td className="p-4 text-gray-700">{user.project}</td>
                <td className="p-4 text-gray-700">
                  {" "}
                  <Button
                    btnType="icon"
                    icon="trash"
                    size={16}
                    variant="warning"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminPageWrapper>
    </>
  );
}
