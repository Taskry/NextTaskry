import { supabase } from "@/lib/supabase/supabase";

// ----------------------------------------------------------------
// Task 담당자 지정을 위한 프로젝트 맴버 조회 API
// 설명: 특정 프로젝트에 속한 멤버들을 조회하여, Task 담당자 지정에 활용
// 입력: projectId (string) - 조회할 프로젝트의 고유 ID
// 출력: 프로젝트 멤버들의 배열 (userId, email, role 포함)
// ----------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  // 파라미터 검증
  if (!projectId) {
    console.error("Missing projectId parameter");
    return Response.json(
      { error: "projectId 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  // 쿼리 실행 [프로젝트 멤버 조회 + 사용자 정보 JOIN]
  try {
    const { data: members, error } = await supabase
      .from("project_members")
      .select(
        `
        project_id,
        user_id,
        role,
        users!user_id (
          user_id,
          user_name,
          email,
          profile_image
        )
      `
      )
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching project members:", error);
      return Response.json(
        {
          error: "프로젝트 멤버 조회 중 오류가 발생했습니다.",
          details: error.message,
          projectId: projectId,
        },
        { status: 500 }
      );
    }

    console.log(
      `프로젝트 멤버 조회 성공 [${projectId}]: ${members?.length || 0}명`
    );

    return Response.json({
      message: `Task 담당자 프로젝트 멤버[${projectId}] 정보 조회`,
      data: members || [],
      count: members?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
