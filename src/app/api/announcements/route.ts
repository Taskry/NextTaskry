import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/supabase";

// ------------------------------------------------------
// Supabase 클라이언트 생성
// local supabase 시작 시 사용할 테스트용 클라이언트
// ------------------------------------------------------

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// ------------------------------------------------------
// 공통 에러 핸들러
// 각 API에서 반복되는 try, catch 로직을 줄이기 위함
// ------------------------------------------------------

async function handleRequest(fn: () => Promise<NextResponse>) {
  try {
    return await fn();
  } catch (error) {
    console.error("서버 오류:", error);
    const msg =
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ------------------------------------------------------
// 권한 체크
// 1) 세션이 없거나, user가 없으면 -> 로그인 필요 반환
// 3) 세션에 user.email이 없을 경우 -> 관리자 권한 필요 반환

// 251121. 테스트를 위해 임시방편으로 NEXT_PUBLIC_ADMIN_EMAILS로
// 이메일을 받고 있는데, 추후 session?.user?.role === "admin"로 원복 필요
// ------------------------------------------------------

export async function checkAdminFnc() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      ),
    };
  }

  // const adminEmails =
  //   process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  const isAdmin = session?.user?.role === "admin";
  if (!isAdmin) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      ),
    };
  }

  //------------------ 디버깅용
  const user_id = session.user.user_id ?? crypto.randomUUID();
  if (!session.user.user_id) {
    console.warn("세션에 user_id가 없습니다. 임시 UUID를 사용합니다.");
  }
  //------------------ END 디버깅용

  return { authorized: true, user_id };
}

// ------------------------------------------------------
// 공지사항 유효성 검사

// 제목 공백 여부 → 없으면 에러
// 제목 길이 제한 → 255자 초과 시 에러
// 내용 공백 여부 → 없으면 에러
// ------------------------------------------------------

function validateNoticeInput({
  title,
  content,
}: {
  title?: string;
  content?: string;
}) {
  if (!title?.trim()) throw new Error("제목을 입력해주세요.");
  if (title.length > 255) throw new Error("제목은 255자를 초과할 수 없습니다.");
  if (!content?.trim()) throw new Error("내용을 입력해주세요.");
}

// ------------------------------------------------------
// announcement_id 헬퍼
// ------------------------------------------------------

function getAnnouncementId(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("announcement_id");
  if (!id) throw new Error("공지사항 announcement_id가 필요합니다.");
  return id;
}

// ------------------------------------------------------
// 공지사항 조회 (인증 불필요 - 누구나 볼 수 있게)
// ------------------------------------------------------

export async function GET(request: Request) {
  return handleRequest(async () => {
    const { searchParams } = new URL(request.url);
    const announcement_id = searchParams.get("announcement_id");

    // URL에 announcement_id 가 있으면 공지사항 상세 페이지 요청이라고 판단
    if (announcement_id) {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("announcement_id", announcement_id)
        .single();

      if (error) {
        // PGRST116 -> Row not found.
        // 해당 ID의 공지사항이 없다 -> 404 반환
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "공지사항을 찾을 수 없습니다." },
            { status: 404 }
          );
        }
        // 그 외 서버 에러는 -> throw
        throw error;
      }

      return NextResponse.json({ data }, { status: 200 });
    }

    // 페이지 값 파싱
    // 기본값 - page = 1, limit = 8
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 8;
    // 잘못된 page, limit 방어
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "잘못된 페이지 또는 limit 값입니다." },
        { status: 400 }
      );
    }

    // 게시글 range 계산
    // 예: page=1, limit=8 → 0~7
    // 예: page=2, limit=8 → 8~15
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // 중요 공지(is_important)가 항상 위에 오도록 정렬
    // 그 후 최신순 정렬
    // count: "exact" -> 전체 개수를 가져와서 페이지네이션에 사용
    const { data, error, count } = await supabase
      .from("notices")
      .select("*", { count: "exact" })
      .order("is_important", { ascending: false }) // 중요 공지 우선
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;

    // 성공 응답
    return NextResponse.json({ data, totalCount: count || 0 }, { status: 200 });
  });
}

// ------------------------------------------------------
// 공지사항 등록 (관리자 전용)
// ------------------------------------------------------

export async function POST(request: Request) {
  return handleRequest(async () => {
    // 로그인, 관리자 여부 확인한 다음
    const permission = await checkAdminFnc();
    // 둘 중 하나라도 아니라면 false 또는 에러 즉시 반환
    if (!permission.authorized) return permission.error;

    // title, content, is_important를 가져온다
    const body = await request.json();
    // 입력값 검증
    // 제목, 내용 없거나 제목 255자 초과 시 -> 에러
    validateNoticeInput(body);

    const { data, error } = await supabase
      .from("notices")
      // insert()는 기본적으로 배열 형태의 rows를 받는다고 한다
      .insert([
        {
          user_id: permission.user_id,
          title: body.title.trim(),
          content: body.content.trim(),
          is_important: body.is_important || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  });
}

// ------------------------------------------------------
// 공지사항 수정 (관리자 전용)
// ------------------------------------------------------

export async function PUT(request: Request) {
  return handleRequest(async () => {
    // 로그인, 관리자 여부 확인한 다음
    const permission = await checkAdminFnc();
    // 둘 중 하나라도 아니라면 false 또는 에러 즉시 반환
    if (!permission.authorized) return permission.error;

    // /api/notices/:id 방식으로 추출하거나 쿼리스트링에서 가져와서
    // 이 id 기준으로 update가 진행
    const announcement_id = getAnnouncementId(request);
    const body = await request.json();

    if (body.title !== undefined || body.content !== undefined) {
      validateNoticeInput({ title: body.title, content: body.content });
    }

    const updates: any = { updated_at: new Date().toISOString() };

    // tle만 보냈으면 title만 수정
    // content만 보냈으면 content만 수정
    // is_important만 보냈으면 중요 여부만 수정
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.content !== undefined) updates.content = body.content.trim();
    if (body.is_important !== undefined)
      updates.is_important = body.is_important;

    const { data, error } = await supabase
      .from("notices")
      .update(updates)
      .eq("announcement_id", announcement_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  });
}

// ------------------------------------------------------
// 공지사항 삭제 (관리자 전용)
// ------------------------------------------------------

export async function DELETE(request: Request) {
  return handleRequest(async () => {
    const permission = await checkAdminFnc();
    if (!permission.authorized) return permission.error;

    const announcement_id = getAnnouncementId(request);

    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("announcement_id", announcement_id);
    if (error) throw error;

    return NextResponse.json({ message: "삭제되었습니다." }, { status: 200 });
  });
}
