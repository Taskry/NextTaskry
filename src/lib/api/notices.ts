import { Notice } from "@/app/data/mockNotices";

const ITEM_PER_PAGE = 8;

interface NoticeResponse {
  data: Notice[];
  totalCount: number;
}

// ------------------------------------------------------
// API 에러 처리 헬퍼 함수
// ------------------------------------------------------

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
  }
  return response.json();
}

// ------------------------------------------------------
// 공지사항 목록 조회
// ------------------------------------------------------

export async function getNotices(
  page: number = 1,
  limit: number = ITEM_PER_PAGE
): Promise<NoticeResponse> {
  try {
    const response = await fetch(
      `/api/announcements?page=${page}&limit=${limit}`
    );
    const result = await handleApiResponse<{
      data: Notice[];
      totalCount: number;
    }>(response);

    return {
      data: result.data || [],
      totalCount: result.totalCount || 0,
    };
  } catch (error) {
    console.error("공지사항 조회 오류:", error);
    throw error;
  }
}

// ------------------------------------------------------
// 공지사항 작성 (관리자만 가능)
// ------------------------------------------------------

export async function createNotice(data: {
  title: string;
  is_important: boolean;
  content: string;
}): Promise<Notice> {
  // 클라이언트 측 유효성 검사
  if (!data.title.trim()) {
    throw new Error("제목을 입력해주세요.");
  }
  if (data.title.length > 255) {
    throw new Error("제목은 255자를 초과할 수 없습니다.");
  }
  if (!data.content.trim()) {
    throw new Error("내용을 입력해주세요.");
  }

  try {
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title.trim(),
        content: data.content.trim(),
        is_important: data.is_important,
      }),
    });

    const result = await handleApiResponse<{ data: Notice }>(response);
    return result.data;
  } catch (error) {
    console.error("공지사항 작성 오류:", error);
    throw error;
  }
}

// ------------------------------------------------------
// 공지사항 상세 조회
// ------------------------------------------------------

export async function getNoticeById(
  id: string | number
): Promise<Notice | null> {
  try {
    const response = await fetch(`/api/announcements?announcement_id=${id}`);

    if (response.status === 404) {
      return null;
    }

    const result = await handleApiResponse<{ data: Notice }>(response);
    return result.data || null;
  } catch (error) {
    console.error("공지사항 조회 오류:", error);
    throw error;
  }
}

// ------------------------------------------------------
// 공지사항 수정 (관리자만 가능)
// ------------------------------------------------------

export async function updateNotice(
  id: string | number,
  data: {
    title?: string;
    content?: string;
    is_important?: boolean;
  }
): Promise<Notice> {
  if (data.title !== undefined) {
    if (!data.title.trim()) {
      throw new Error("제목을 입력해주세요.");
    }
    if (data.title.length > 255) {
      throw new Error("제목은 255자를 초과할 수 없습니다.");
    }
  }

  try {
    const response = await fetch(`/api/announcements?announcement_id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await handleApiResponse<{ data: Notice }>(response);
    return result.data;
  } catch (error) {
    console.error("공지사항 수정 오류:", error);
    throw error;
  }
}

// ------------------------------------------------------
// 공지사항 삭제 (관리자만 가능)
// ------------------------------------------------------

export async function deleteNotice(id: string | number): Promise<void> {
  try {
    const response = await fetch(`/api/announcements?announcement_id=${id}`, {
      method: "DELETE",
    });

    await handleApiResponse<{ message: string }>(response);
  } catch (error) {
    console.error("공지사항 삭제 오류:", error);
    throw error;
  }
}
