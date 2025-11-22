import { supabase } from "@/lib/supabase/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/projectMemos
 * 프로젝트별 메모 목록 조회 (작성자 정보 포함)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = (searchParams.get("sortBy") || "newest") as
      | "newest"
      | "oldest";

    if (!projectId) {
      return Response.json(
        { error: "프로젝트 ID가 필수입니다" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;
    const orderDirection = sortBy === "newest" ? "desc" : "asc";

    // 메모 조회 + 사용자 정보 JOIN
    const {
      data: memos,
      error: fetchError,
      count,
    } = await supabase
      .from("project_memos")
      .select(
        `
        memo_id,
        project_id,
        user_id,
        content,
        is_pinned,
        pinned_at,
        is_deleted,
        deleted_at,
        created_at,
        updated_at,
        users:user_id (
          id,
          name,
          email
        )
      `,
        { count: "exact" }
      )
      .eq("project_id", projectId)
      .eq("is_deleted", false)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: orderDirection === "asc" })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return Response.json(
        { error: "메모 조회에 실패했습니다" },
        { status: 500 }
      );
    }

    // 응답 포맷 변환
    const formattedMemos = memos?.map((memo: any) => ({
      ...memo,
      author:
        Array.isArray(memo.users) && memo.users.length > 0
          ? memo.users[0]
          : { id: memo.user_id, name: "알 수 없음", email: "" },
    }));

    return Response.json(
      {
        data: formattedMemos || [],
        total: count || 0,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projectMemos
 * 메모 생성
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.user_id) {
      return Response.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();
    const { project_id, content } = body;

    // 필수 필드 검증
    if (!project_id || !content) {
      return Response.json(
        { error: "project_id와 content는 필수입니다" },
        { status: 400 }
      );
    }

    // 메모 생성
    const { data, error } = await supabase
      .from("project_memos")
      .insert([
        {
          project_id,
          user_id: session.user.user_id,
          content: content.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "메모 저장에 실패했습니다" },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projectMemos
 * 메모 수정
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.user_id) {
      return Response.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");
    const body = await request.json();
    const { content } = body;

    if (!memoId) {
      return Response.json({ error: "메모 ID가 필수입니다" }, { status: 400 });
    }

    if (!content) {
      return Response.json(
        { error: "메모 내용이 필수입니다" },
        { status: 400 }
      );
    }

    // 메모 조회 - 작성자 확인
    const { data: memo, error: fetchError } = await supabase
      .from("project_memos")
      .select("user_id")
      .eq("memo_id", memoId)
      .single();

    if (fetchError || !memo) {
      return Response.json(
        { error: "해당 메모를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (memo.user_id !== session.user.user_id) {
      return Response.json(
        { error: "수정 권한이 없습니다 (작성자만 수정 가능)" },
        { status: 403 }
      );
    }

    // 메모 수정
    const { data, error } = await supabase
      .from("project_memos")
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("memo_id", memoId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "메모 수정에 실패했습니다" },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projectMemos
 * 메모 삭제 (소프트 삭제)
 * 작성자만 삭제 가능
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.user_id) {
      return Response.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");

    if (!memoId) {
      return Response.json({ error: "메모 ID가 필수입니다" }, { status: 400 });
    }

    // 메모 조회 - 작성자 확인
    const { data: memo, error: fetchError } = await supabase
      .from("project_memos")
      .select("user_id, memo_id")
      .eq("memo_id", memoId)
      .single();

    if (fetchError || !memo) {
      return Response.json(
        { error: "해당 메모를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 작성자 확인 (작성자만 삭제 가능)
    if (memo.user_id !== session.user.user_id) {
      return Response.json(
        { error: "삭제 권한이 없습니다 (작성자만 삭제 가능)" },
        { status: 403 }
      );
    }

    // 소프트 삭제: is_deleted = true, deleted_at 기록
    const { error: updateError } = await supabase
      .from("project_memos")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("memo_id", memoId);

    if (updateError) {
      console.error("Supabase error:", updateError);
      return Response.json(
        { error: "메모 삭제에 실패했습니다" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "메모가 삭제되었습니다",
        memo_id: memoId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
