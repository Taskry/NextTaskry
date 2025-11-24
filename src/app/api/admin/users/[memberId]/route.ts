import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: any) {
  // ★ 여기! await 써야 정상 동작함 ★
  const { memberId } = await context.params;

  const { role } = await req.json();

  const { error } = await supabaseAdmin
    .from("project_members")
    .update({ role })
    .eq("member_id", memberId);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
