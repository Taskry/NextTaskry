"Use Client"
import Button from "@/components/ui/Button";
import AdminPageWrapper from "@/components/features/admin/AdminPageWrapper";
import { primaryBgColor } from "@/app/sample/color/page";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/api/adminUsers";
import { UserInfoRow } from "@/types/adminUser";
import { updateUserRole } from "@/lib/api/adminUsers";
import AdminInviteModal from "@/components/features/invite/AdminInviteModal";


export default function AdminUsersPage() {

  const[users, setUsers]= useState<UserInfoRow[]>([])
  const[searchName, setSearchName] = useState("");
  const[filterRole, setFilterRole] = useState("all"); // all | leader | member
  const [isInviteOpen, setIsInviteOpen] = useState(false); //초대버튼
  const [projects, setProjects] = useState<{ project_id: string; project_name: string }[]>([]);

  




    

useEffect(() => {
  async function load() {
    //1) 유저 목록 가져오기
    const data = await fetchAdminUsers();
    setUsers(data);

    //2) 프로젝트 목록 가져오기
    const res = await fetch("/api/admin/projects");
    const projectsData = await res.json();
    
    setProjects(projectsData);
    console.log(projectsData,"프로젝트 목록")
  }
  
  load();
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
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="h-12 border px-3 rounded-md text-sm"
                >
                  <option value="all">전체</option>
                  <option value="leader">admin</option>
                  <option value="member">user</option>
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
            {users.map((user,index) => (
              <tr key={index}>
                {/* 이름 */}
                <td className="py-3 px-4 text-center">{user.user_name}</td>

                {/* 이메일 */}
                <td className="py-3 px-4 text-center">{user.email}</td>

                {/* 권한 */}
                <td className="py-3 px-4 text-center">
                  <select
                    value={user.global_role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        // 확인창 띄우기
                        const ok = window.confirm(`정말 ${user.user_name} 님의 권한을 '${newRole}' 로 변경하시겠습니까?`);
                        if (!ok) return; 
                      }}
                    className="border rounded px-2 py-1 text-sm dark:bg-black"
                  >
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                  </select>
                </td>

            

                {/* 삭제 버튼 */}
                <td className="p-4 text-gray-700 pl-18">
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
      </AdminPageWrapper>
    </>
  );
}
