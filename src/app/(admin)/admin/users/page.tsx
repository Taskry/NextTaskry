"Use Client";
import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBgColor } from "@/app/sample/color/page";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/api/adminUsers";
import { UserInfoRow } from "@/types/adminUser";
import AdminInviteModal from "@/components/features/invite/AdminInviteModal";
import { Icon } from "@/components/shared/Icon";
import CommonPagination from "@/components/ui/CommonPagination";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserInfoRow[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // all | leader | member
  const [isInviteOpen, setIsInviteOpen] = useState(false); //초대버튼
  const [projects, setProjects] = useState<
    { project_id: string; project_name: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지

  const filteredUsers = users.filter((user) => {
    // 1) 이름 검색
    const matchName = user.user_name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    // 2) 역할 필터 (전체면 모두 포함)
    const matchRole =
      filterRole === "all" ? true : user.global_role === filterRole;

    return matchName && matchRole;
  });

  const rowsPerPage = 10; //한페이지에 몇명을 보여줄지
  //slice(포함, 불포함) => 새로운 배열 반환
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage); //전체유저 / 한페이지보여줄유저
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    (currentPage - 1) * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    async function load() {
      //1) 유저 목록 가져오기
      const data = await fetchAdminUsers();
      setUsers(data);

      //2) 프로젝트 목록 가져오기
      const res = await fetch("/api/admin/projects");
      const projectsData = await res.json();

      setProjects(projectsData);
    }

    load();
  }, []);

  async function updateUserRole(userId: string, newRole: string) {
    const res = await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, newRole }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("역할 변경 실패:", data);
      alert("역할 변경에 실패했습니다.");
    } else {
      alert("역할이 성공적으로 변경되었습니다!");
    }
  }

  return (
    <>
      <AdminPageWrapper
        title="유저 관리"
        titleIcon="userCircle"
        action={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="유저 검색"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="h-12 text-sm font-normal w-2xs border px-3 rounded-md"
            />
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="h-12 border px-3 rounded-md text-sm"
            >
              <option value="all">전체</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
            <Button
              btnType="basic"
              variant="primary"
              className="h-12 px-4 rounded-md"
              onClick={() => setIsInviteOpen(true)}
            >
              초대하기
            </Button>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead
            className={`${primaryBgColor.color1[2]} text-white text-sm uppercase dark:bg-gray-900`}
          >
            <tr>
              <th className="py-3 px-4 text-center text-sm">이름</th>
              <th className="py-3 px-4 text-center text-sm">이메일</th>
              <th className="py-3 px-4 text-center text-sm">권한</th>
              <th className="py-3 px-4 text-center text-sm">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm bg-white dark:text-gray-100  dark:bg-black">
            {paginatedUsers.map((user, index) => (
              <tr key={index}>
                {/* 이름 */}
                <td className="py-3 px-4 text-center">{user.user_name}</td>

                {/* 이메일 */}
                <td className="py-3 px-4 text-center">{user.email}</td>

                {/* 권한 */}
                <td className="py-3 px-4 text-center">
                  <select
                    value={user.global_role}
                    onChange={async (e) => {
                      const newRole = e.target.value as "admin" | "user";
                      // 확인창 띄우기
                      const ok = window.confirm(
                        `정말 ${user.user_name} 님의 권한을 '${newRole}' 로 변경하시겠습니까?`
                      );
                      if (!ok) return;

                      await updateUserRole(user.user_id, newRole);
                      setUsers((prev) =>
                        prev.map((prevUser) =>
                          prevUser.user_id === user.user_id
                            ? { ...prevUser, global_role: newRole }
                            : prevUser
                        )
                      );
                    }}
                    className="border rounded px-2 py-1 text-sm dark:bg-black"
                  >
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                  </select>
                </td>

                {/* 삭제 버튼 */}
                <td className="p-4 text-gray-700 text-center">
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
        {isInviteOpen && (
          <AdminInviteModal
            projects={projects}
            onClose={() => setIsInviteOpen(false)}
          />
        )}

        <div className="flex gap-2 justify-center mt-4">
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            buttonStyle="arrow"
            pageGroupSize={3}
          />

          {/* 이전 버튼
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-2 border border-border rounded disabled:opacity-40 cursor-pointer"
          >
            <Icon type="arrowDown" className="rotate-90" size={17} />
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded border 
                ${
                  currentPage === num
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-black"
                }`}
            >
              {num}
            </button>
          ))}

          {/* 다음 버튼 
          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="px-2 py-2 border border-border rounded disabled:opacity-40 cursor-pointer"
          >
            <Icon type="arrowDown" className="rotate-270" size={16} />
          </button> */}
        </div>
      </AdminPageWrapper>
    </>
  );
}
