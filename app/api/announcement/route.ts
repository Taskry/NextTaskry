import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ------------------------------------------------------
// 공지사항 조회
// ------------------------------------------------------

export async function GET(request: Request) {
  // 사용자 인증
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return Response.json({ error: 'Unauthorized-test', session:session }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id && id !== "all") {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("announcement_id", id)
        .single();

      if (error) {
        console.error("공지사항 조회 오류: ", error);
        return NextResponse.json(
          { error: "공지사항을 찾을 수 없습니다" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data });
    }

    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("공지사항 목록 조회 오류: ", error);
      return NextResponse.json(
        { error: "공지사항 목록을 불러올 수 없습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("GET 요청 오류: ", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------
// 공지사항 생성
// ------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 유효성 검사
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "제목을 입력해주세요" },
        { status: 400 }
      );
    }

    if (body.title.length > 255) {
      return NextResponse.json(
        { error: "제목은 255자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: "내용을 입력해주세요" },
        { status: 400 }
      );
    }

    //
    const { data, error } = await supabase
      .from("notices")
      .insert([
        {
          // user_id: body.user_id || null,
          user_id: "00000000-0000-0000-0000-000000000001",
          title: body.title.trim(),
          content: body.content.trim(),
          is_pinned: body.is_pinned || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("공지사항 등록 오류: ", error);
      return NextResponse.json(
        { error: "공지사항 등록에 실패했습니다" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("POST 요청 오류: ", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------
// 공지사항 수정
// ------------------------------------------------------

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "공지사항 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 유효성 검사
    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { error: "제목을 입력해주세요." },
          { status: 400 }
        );
      }
      if (body.title.length > 255) {
        return NextResponse.json(
          { error: "제목은 255자를 초과할 수 없습니다." },
          { status: 400 }
        );
      }
    }

    // 업데이트할 필드만 추출
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.content !== undefined) updates.content = body.content.trim();
    if (body.is_pinned !== undefined) updates.is_pinned = body.is_pinned;

    // 공지사항 수정
    const { data, error } = await supabase
      .from("notices")
      .update(updates)
      .eq("announcement_id", id)
      .select()
      .single();

    if (error) {
      console.error("공지사항 수정 오류:", error);
      return NextResponse.json(
        { error: "공지사항 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("PUT 요청 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------
// 공지사항 삭제
// ------------------------------------------------------

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "공지사항 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 공지사항 삭제
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("announcement_id", id);

    if (error) {
      console.error("공지사항 삭제 오류:", error);
      return NextResponse.json(
        { error: "공지사항 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error("DELETE 요청 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
