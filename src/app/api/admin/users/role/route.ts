import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server"; // service role

export async function PATCH(req: Request) {
  try {
    const { user_id, newRole } = await req.json();

    if (!user_id || !newRole) {
      return NextResponse.json(
        { error: "user_id와 newRole은 필수입니다." },
        { status: 400 }
      );
    }

    // Supabase 업데이트
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ global_role: newRole })
      .eq("user_id", user_id);

    if (error) {
      console.error("역할 변경 실패:", error);
      return NextResponse.json(
        { error: "역할 변경 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "서버 오류" },
      { status: 500 }
    );
  }
}
