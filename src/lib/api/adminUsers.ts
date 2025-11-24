import { AdminUserRow } from "@/types/adminUser";


//users 목록 조회
export async function fetchAdminUsers(): Promise<AdminUserRow[]>{
  const res =  await fetch("/api/admin/users")
    if (!res.ok) throw new Error("Fetch failed");

  const data = await res.json()
  return data

}


//role 변경 patch
export async function updateUserRole(memberId: string, newRole: string) {
  const res = await fetch(`/api/admin/users/${memberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) {
    throw new Error("역할 변경 실패");
  }

  return await res.json();
}

