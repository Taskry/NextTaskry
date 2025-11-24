import { supabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const role = searchParams.get("role");
  const userId = searchParams.get("userId");

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 멤버 조회]
  let query = supabase.from("project_members").select("*");
  if (id) {
    query = query.eq("project_id", id);
  }
  if (role) {
    query = query.eq("role", role);
  }
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: projectMembers, error: getError } = await query;

  if (getError) {
    console.error("Error fetching projects:", getError);
    return Response.json({ error: getError.message }, { status: 500 });
  }

  
  const result = {
    message: `프로젝트 멤버[${id}] 정보 조회`,
    params: {
      projectMemberId: id || "파라미터 없음",
      userId: userId || "파라미터 없음",
    },
    data: projectMembers,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const data = await request.json();

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  const projectMember = data.map((member:any) => ({
    project_id: id,
    user_id: member.userId,
    role: member.role
  }));
  

  // 쿼리 실행 [프로젝트 멤버 정보 업데이트]
  const { data: projectMembers, error: postError } = await supabase
    .from('project_members')
    .upsert(projectMember, { onConflict: 'project_id, user_id' })
    .select();

    if (postError) {
      console.error("Error fetching projects:", postError);
      return Response.json({ error: postError.message }, { status: 500 });
    }

    const currentIds = projectMember.map((member:any) => member.user_id);

    const { error: deleteError } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id) 
      .not('user_id', 'in', `(${currentIds.join(',')})`); 

    if (deleteError) {
      console.error("Error deleting project:", deleteError);
      return Response.json({ error: deleteError.message }, { status: 500 });
    }

  const result = {
    message: `프로젝트 멤버 업데이트`,
    params: {
      projectMemberId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();

  const id = searchParams.get("id");
  const { data } = body;

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 멤버 정보 업데이트]
  const result = {
    message: `프로젝트 멤버[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 멤버 정보 삭제]
  const { data: deletedProjectMember, error: deleteError } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", id);

  if (deleteError) {
    console.error("Error deleting project:", deleteError);
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트 멤버[${id}] 정보 삭제`,
    params: {
      projectMemberId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}
