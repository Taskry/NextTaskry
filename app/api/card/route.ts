import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const kanbanBoardId = searchParams.get("kanbanBoardId");

    // 특정 카드 조회
    if (id && id !== "all") {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // 칸반보드별 카드 목록 조회
    if (kanbanBoardId) {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("kanban_board_id", kanbanBoardId)
        .order("created_at", { ascending: true });

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // 전체 카드 조회 (개발용)
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.title || !body.kanban_board_id) {
      return Response.json(
        { error: "title과 kanban_board_id는 필수입니다." },
        { status: 400 }
      );
    }

    // Task 생성
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          kanban_board_id: body.kanban_board_id,
          title: body.title,
          description: body.description,
          status: body.status || "todo",
          priority: body.priority,
          assigned_to: body.assigned_to,
          subtasks: body.subtasks,
          memo: body.memo,
          started_at: body.started_at,
          ended_at: body.ended_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "id 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Task 업데이트
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        assigned_to: body.assigned_to,
        subtasks: body.subtasks,
        memo: body.memo,
        started_at: body.started_at,
        ended_at: body.ended_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Task update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "id 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    // Task 삭제
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Task deletion error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
