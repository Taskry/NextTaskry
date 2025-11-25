import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBgColor } from "@/app/sample/color/page";
import { Icon } from "@/components/shared/Icon";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/api/adminUsers";
import { AdminUserRow } from "@/types/adminUser";
import { updateUserRole } from "@/lib/api/adminUsers";


export default function AdminUsersPage() {

  const[users, setUsers]= useState<AdminUserRow[]>([])
  const[searchName, setSearchName] = useState("");
  const[filterRole, setFilterRole] = useState("all"); // all | leader | member

  

  async function handleRoleChange(memberId: string, newRole: string) {
  try {
    // 서버에 반영
    await updateUserRole(memberId, newRole);

    // UI 즉시 변경
    setUsers((prev) =>
      prev.map((u) =>
        u.member_id === memberId ? { ...u, role: newRole }as AdminUserRow : u
      )
    );
    } catch (err) {
      console.error(err);
    }
  }

  const filteredUsers = users.filter((u) =>
  u.user_name.toLowerCase().includes(searchName.toLowerCase().trim())
  ).filter((u) =>
  filterRole === "all" ? true : u.role === filterRole
  );



    

  useEffect(() => {
    async function getData() {
      const data = await fetchAdminUsers();
      setUsers(data);
    }
    getData();
  }, []); 

 

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
              onChange={(e) => setSearchName(e.target.value)}
              className="h-12 text-sm font-normal w-2xs border px-3 rounded-md"
            />


            {/* <div className="h-12 flex items-center gap-1 rounded-md border border-gray-100 px-3 cursor-pointer"> */}
              {/* <Icon type="filter" size={18} />
              <span className="inline-block">필터</span> */}


                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="h-12 border px-3 rounded-md text-sm"
                >
                  <option value="all">전체</option>
                  <option value="leader">leader</option>
                  <option value="member">member</option>
                </select>
            {/* </div> */}
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
              <th className="py-3 px-4 text-center text-sm">프로젝트</th>
              <th className="py-3 px-4 text-center text-sm">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm bg-white dark:text-gray-100  dark:bg-black">
            {filteredUsers.map((user) => (
              <tr key={user.member_id}>
                {/* 이름 */}
                <td className="py-3 px-4 text-center">{user.user_name}</td>

                {/* 이메일 */}
                <td className="py-3 px-4 text-center">{user.email}</td>

                {/* 권한 */}
                <td className="py-3 px-4 text-center">
                  <select
                    value={user.role}
                      onChange={(e) => {
                        const newRole = e.target.value;

                        // 확인창 띄우기
                        const ok = window.confirm(`정말 ${user.user_name} 님의 권한을 '${newRole}' 로 변경하시겠습니까?`);
                        if (!ok) return; 

                        handleRoleChange(user.member_id, newRole);
                      }}
                    className="border rounded px-2 py-1 text-sm dark:bg-black"
                  >
                    <option value="leader">leader</option>
                    <option value="member">member</option>
                  </select>
                </td>

                {/* 프로젝트명 */}
                <td className="py-3 px-4 text-center">
                  {user.project_name}
                </td>

                {/* 삭제 버튼 */}
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
