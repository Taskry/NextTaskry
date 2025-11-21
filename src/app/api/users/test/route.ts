import { supabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 조회]
  let query = supabase.from("users").select("*", { count: "exact" });

  if (id) {
    switch (type) {
      case "eq":
        query = query.eq("user_id", id);
        break;
      case "neq":
        query = query.neq("user_id", id);
        break;
      default:
        query = query.eq("user_id", id);
    }
  }

  const { data: users, count: count, error: getError } = await query;

  if (getError) {
    console.error("Error fetching users:", getError);
    return Response.json({ error: getError.message }, { status: 500 });
  }

  const result = {
    message: `유저[${id}] 정보 조회`,
    params: {
      projectId: id || "파라미터 없음",
    },
    data: users,
    count: count,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}
