// app/api/kanban/route.ts (또는 현재 파일 경로)
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("id");

  try {
    if (boardId && boardId !== "all") {
      // 특정 보드의 작업들 조회
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("kanban_board_id", boardId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `캔반보드[${boardId}] 작업 목록 조회`,
        data: data,
        count: data.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      // 모든 작업 조회
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "전체 작업 목록 조회",
        data: data,
        count: data.length,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "작업 조회 실패",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = {
    message: `캔반보드 정보 생성`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();

  const id = searchParams.get("id");

  const result = {
    message: `캔반보드[${id}] 정보 업데이트`,
    receivedData: body,
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const result = {
    message: `캔반보드[${id}] 정보 삭제`,
    params: {
      boardId: id || "파라미터 없음",
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(result);
}
