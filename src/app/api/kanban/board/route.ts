import { supabase } from "@/lib/supabase/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kanbanBoardId = searchParams.get("kanbanBoardId");
    const id = searchParams.get("id");

    // 특정 작업 조회
    if (id) {
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

    // 칸반보드별 작업 목록 조회
    if (kanbanBoardId) {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("kanban_board_id", kanbanBoardId)
        .order("created_at", { ascending: false });

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // 전체 작업 조회 (관리자용)
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Task fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.kanban_board_id || !body.title) {
      return Response.json(
        { error: "kanban_board_id와 title은 필수입니다." },
        { status: 400 }
      );
    }

    // 작업 생성
    type Task = {
      projectId?: string;
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assigned_to?: string;
      started_at?: string;
      ended_at?: string;
      memo?: string;
      subtasks?: string;
      created_at: string;
      updated_at: string;
    };

    const newTask: Task = {
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      status: body.status || "todo",
      priority: body.priority || "normal",
      assigned_to: body.assigned_to,
      started_at: body.started_at,
      ended_at: body.ended_at,
      memo: body.memo,
      subtasks: body.subtasks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .insert([newTask as Task])

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

    // 작업 업데이트
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        assigned_to: body.assigned_to,
        started_at: body.started_at,
        ended_at: body.ended_at,
        memo: body.memo,
        subtasks: body.subtasks,
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

    // 작업 삭제
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
