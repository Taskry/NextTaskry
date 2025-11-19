// lib/api/tasks.ts
const tasksAPI = {
  // 작업 목록 조회
  getTasks: async (boardId?: string) => {
    const url = boardId ? `/api/kanban?id=${boardId}` : "/api/kanban?id=all";

    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "작업 조회 실패");
    }

    return result.data;
  },
};

export default tasksAPI;
