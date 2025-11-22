import { supabase } from "@/lib/supabase/supabase";
import { ca } from "date-fns/locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "all";

  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  // 쿼리 실행 [프로젝트 메모 조회]
  const result = {
    message: `프로젝트 메모[${id}] 정보 조회`,
    params: {
      projectMemoId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project_id, content } = body;

    // 필수 필드 검증
    if (!project_id || !content) {
      return Response.json(
        { error: "project_id와 content는 필수입니다." },
        { status: 400 }
      );
    }

    // user_id (임시) -> 실제로는 auth.uid() 사용
    const userId = "22601b88-9c53-4430-a4f3-622fa87e4462";

    // supabase에 저장
    const { data, error } = await supabase
      .from("project_memos")
      .insert([
        {
          project_id: project_id,
          user_id: userId,
          content: content.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error", error);
      return Response.json(
        { error: "메모 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // data에 memo_id 포함된 상태로 반환
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("API error", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
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

  // 쿼리 실행 [프로젝트 메모 정보 업데이트]
  const result = {
    message: `프로젝트 메모[${id}] 정보 업데이트`,
    receivedData: body,
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

  // 쿼리 실행 [프로젝트 메모 정보 삭제]
  const result = {
    message: `프로젝트 메모[${id}] 정보 삭제`,
    params: {
      projectMemoId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  // 결과 반환
  return Response.json(result);
}
