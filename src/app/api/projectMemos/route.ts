import { supabase } from "@/lib/supabase/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ============================================
// 유틸 함수
// ============================================

/**
 * 현재 인증된 사용자 ID 가져오기
 */
async function getAuthUserId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.user_id) {
    throw {
      error: "인증이 필요합니다",
      status: 401,
    };
  }

  return session.user.user_id;
}

/**
 * 메모 조회 (상세 정보 포함)
 */
async function getMemoById(memoId: string) {
  const { data: memo, error } = await supabase
    .from("project_memos")
    .select("*")
    .eq("memo_id", memoId)
    .single();

  if (error || !memo) {
    throw {
      error: "해당 메모를 찾을 수 없습니다",
      status: 404,
    };
  }

  return memo;
}

/**
 * 작성자 권한 확인
 */
function checkAuthor(memo: any, userId: string) {
  if (memo.user_id !== userId) {
    throw {
      error: "권한이 없습니다 (작성자만 가능)",
      status: 403,
    };
  }
}

/**
 * 에러 응답 생성
 */
function errorResponse(error: any, defaultMessage: string) {
  if (error.error && error.status) {
    return Response.json({ error: error.error }, { status: error.status });
  }

  console.error("API error:", error);
  return Response.json({ error: defaultMessage }, { status: 500 });
}

// ============================================
// API 엔드포인트
// ============================================

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

    // user_id만 가져오기 (JOIN은 나중에)
    const {
      data: memos,
      error: fetchError,
      count,
    } = await supabase
      .from("project_memos")
      .select("*", { count: "exact" })
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

    // user_id들을 수집해서 한 번에 조회
    const userIds = [...new Set(memos?.map((m) => m.user_id) || [])];

    const userMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("user_id, user_name, email")
        .in("user_id", userIds);

      users?.forEach((user) => {
        userMap[user.user_id] = user;
      });
    }

    // memos에 author 정보 추가
    const memosWithAuthor = memos?.map((memo) => ({
      ...memo,
      author: userMap[memo.user_id] || {
        user_id: memo.user_id,
        user_name: "알 수 없음",
        email: "",
      },
    }));

    return Response.json(
      {
        data: memosWithAuthor || [],
        total: count || 0,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error, "메모 조회에 실패했습니다");
  }
}
/**
 * POST /api/projectMemos
 * 메모 생성
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await request.json();
    const { project_id, content } = body;

    if (!project_id || !content) {
      return Response.json(
        { error: "project_id와 content는 필수입니다" },
        { status: 400 }
      );
    }

    // 한국 시간(KST, UTC+9)으로 저장
    const now = new Date();
    const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("project_memos")
      .insert([
        {
          project_id,
          user_id: userId,
          content: content.trim(),
          created_at: kstTime.toISOString(),
          updated_at: kstTime.toISOString(),
          is_pinned: false, // 새 메모는 기본적으로 고정되지 않음
          pinned_at: null, // 고정되지 않으므로 null
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 작성자 정보 추가
    const { data: author } = await supabase
      .from("users")
      .select("user_id, user_name, email")
      .eq("user_id", userId)
      .single();

    const memoWithAuthor = {
      ...data,
      author: author || {
        user_id: userId,
        user_name: "알 수 없음",
        email: "",
      },
    };

    return Response.json(memoWithAuthor, { status: 201 });
  } catch (error) {
    return errorResponse(error, "메모 저장에 실패했습니다");
  }
}

/**
 * PUT /api/projectMemos
 * 메모 수정 (작성자만 가능)
 */
export async function PUT(request: Request) {
  try {
    const userId = await getAuthUserId();
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

    const memo = await getMemoById(memoId);
    checkAuthor(memo, userId);

    const { data, error } = await supabase
      .from("project_memos")
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("memo_id", memoId)
      .select()
      .single();

    if (error) throw error;

    return Response.json(data, { status: 200 });
  } catch (error) {
    return errorResponse(error, "메모 수정에 실패했습니다");
  }
}

/**
 * DELETE /api/projectMemos
 * 메모 삭제 (소프트 삭제, 작성자만 가능)
 */
export async function DELETE(request: Request) {
  try {
    const userId = await getAuthUserId();
    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");

    if (!memoId) {
      return Response.json({ error: "메모 ID가 필수입니다" }, { status: 400 });
    }

    const memo = await getMemoById(memoId);
    checkAuthor(memo, userId);

    const { error: updateError } = await supabase
      .from("project_memos")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("memo_id", memoId);

    if (updateError) throw updateError;

    return Response.json(
      {
        message: "메모가 삭제되었습니다",
        memo_id: memoId,
      },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error, "메모 삭제에 실패했습니다");
  }
}

/**
 * PATCH /api/projectMemos
 * 메모 고정/해제
 */
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get("memoId");
    const body = await request.json();
    const { is_pinned } = body;

    console.log("🔧 서버 수신 데이터:", { memoId, body, is_pinned });

    if (!memoId) {
      return Response.json({ error: "메모 ID가 필수입니다" }, { status: 400 });
    }

    if (typeof is_pinned !== "boolean") {
      return Response.json(
        { error: "is_pinned 값이 필요합니다" },
        { status: 400 }
      );
    }

    const updateData = {
      is_pinned,
      pinned_at: is_pinned ? new Date().toISOString() : null,
    };

    console.log("💾 DB 업데이트 데이터:", updateData);

    const { data, error } = await supabase
      .from("project_memos")
      .update(updateData)
      .eq("memo_id", memoId)
      .select()
      .single();

    console.log("📊 DB 업데이트 결과:", { data, error });

    if (error) throw error;

    return Response.json(data, { status: 200 });
  } catch (error) {
    return errorResponse(error, "메모 고정에 실패했습니다");
  }
}
