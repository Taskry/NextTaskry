// app/api/test-supabase/route.ts
import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("tasks").select("count");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Supabase 연결 성공!",
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Supabase 연결 실패",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
