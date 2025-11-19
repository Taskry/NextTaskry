import { supabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "all";

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 멤버 조회]
  const result = {
    message: `프로젝트 멤버[${id}] 정보 조회`,
    params: {
      projectMemberId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, userId, role } = body;

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  const insertProjectMemberData = {
    project_id: projectId,
    user_id: userId,
    role: role,
  };

  // 쿼리 실행 [프로젝트 정보 생성]
  const { data: newProjectMember, error: postError } = await supabase
    .from("project_members")
    .insert([insertProjectMemberData]);

  if (postError) {
    console.error("Error adding projectMember:", postError);
    return Response.json({ error: postError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트 멤버 생성`,
    params: body,
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
