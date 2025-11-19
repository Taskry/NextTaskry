import { supabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 조회]
  let query = supabase.from("projects").select("*");

  if (id) {
    // id 변수가 존재하는 경우 (예: null, undefined, 0, 빈 문자열 등이 아닐 때)
    query = query.eq("project_id", id);
  }
  query.order("created_at", { ascending: true });

  const { data: projects, error: getError } = await query;

  if (getError) {
    console.error("Error fetching projects:", getError);
    return Response.json({ error: getError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트[${id}] 정보 조회`,
    params: {
      projectId: id || "파라미터 없음",
    },
    data: projects,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    projectName,
    type,
    status,
    startedAt,
    endedAt,
    techStack,
    description,
  } = body;

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  const insertProjectData = {
    user_id: 1, //테스트용
    project_name: projectName,
    type: type,
    status: status,
    started_at: startedAt,
    ended_at: endedAt,
    tech_stack: techStack,
    description: description,
  };

  // 쿼리 실행 [프로젝트 정보 생성]
  const { data: newProject, error: postError } = await supabase
    .from("projects")
    .insert([insertProjectData]);

  if (postError) {
    console.error("Error adding project:", postError);
    return Response.json({ error: postError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트 정보 생성`,
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
  const {
    projectName,
    type,
    status,
    startedAt,
    endedAt,
    techStack,
    description,
  } = body;

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  const updateProjectData = {
    project_name: projectName,
    ...(type !== undefined && { type }),
    ...(status !== undefined && { status }),
    ...(startedAt !== undefined && { started_at: startedAt }),
    ...(endedAt !== undefined && { ended_at: endedAt }),
    ...(techStack !== undefined && { tech_stack: techStack }),
    ...(description !== undefined && { description }),
  };

  // 쿼리 실행 [프로젝트 정보 업데이트]
  const { data: updatedProject, error: putError } = await supabase
    .from("projects")
    .update(updateProjectData)
    .eq("project_id", id);

  if (putError) {
    console.error("Error updating project:", putError);
    return Response.json({ error: putError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트${id} 정보 업데이트`,
    params: body,
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 정보 삭제]
  const { data: deletedProject, error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("project_id", id);

  if (deleteError) {
    console.error("Error deleting project:", deleteError);
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  const result = {
    message: `프로젝트[${id}] 정보 삭제`,
    params: {
      projectId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}
