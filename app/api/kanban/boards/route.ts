import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const projectId = searchParams.get("projectId");

    // 특정 칸반보드 조회
    if (id) {
      const { data, error } = await supabase
        .from("kanban_boards")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // 프로젝트별 칸반보드 목록 조회
    if (projectId) {
      const { data, error } = await supabase
        .from("kanban_boards")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // 전체 칸반보드 조회 (관리자용)
    const { data, error } = await supabase
      .from("kanban_boards")
      .select("*")
      .order("created_at", { ascending: false });

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
    if (!body.name || !body.project_id) {
      return Response.json(
        { error: "name과 project_id는 필수입니다." },
        { status: 400 }
      );
    }

    // 칸반보드 생성
    const { data, error } = await supabase
      .from("kanban_boards")
      .insert([
        {
          name: body.name,
          description: body.description,
          project_id: body.project_id,
          columns: body.columns || "todo,inprogress,done",
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
    console.error("KanbanBoard creation error:", error);
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

    // 칸반보드 업데이트
    const { data, error } = await supabase
      .from("kanban_boards")
      .update({
        name: body.name,
        description: body.description,
        columns: body.columns,
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
    console.error("KanbanBoard update error:", error);
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

    // 칸반보드 삭제 (관련된 모든 tasks도 함께 삭제)
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("kanban_board_id", id);

    if (tasksError) {
      return Response.json({ error: tasksError.message }, { status: 500 });
    }

    const { error } = await supabase
      .from("kanban_boards")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ message: "KanbanBoard deleted successfully" });
  } catch (error) {
    console.error("KanbanBoard deletion error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
