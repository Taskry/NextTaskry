import { UserInfoRow } from "@/types/adminUser";


//users 목록 조회
export async function fetchAdminUsers(): Promise<UserInfoRow[]>{
  const res =  await fetch("/api/admin/users")
    if (!res.ok) throw new Error("Fetch failed");

  const data = await res.json()
  return data

}



