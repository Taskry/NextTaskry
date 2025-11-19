import { mockNotices, Notice, STORAGE_KEY } from "@/app/data/mockNotices";

// ------------------------------------------------------
// mock 데이터 사용 여부 플래그 설정
// true: localStorage 사용,
// false: api route 사용
// ------------------------------------------------------
const USE_MOCK = false;

// ------------------------------------------------------
// 정렬 헬퍼
// ------------------------------------------------------
function sortNotices(notices: Notice[]) {
  return notices.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1; // pinned가 먼저
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

// ------------------------------------------------------
// 공지사항 목록 조회
// ------------------------------------------------------

export async function getNotices(): Promise<Notice[]> {
  if (USE_MOCK) {
    // ------- 로컬스토리지 사용 ------- //
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const savedNoticesJson = localStorage.getItem(STORAGE_KEY);

      let notices: Notice[];

      if (savedNoticesJson) {
        // 저장된 데이터가 있다면
        notices = JSON.parse(savedNoticesJson);
      } else {
        notices = mockNotices;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotices));
      }
      return sortNotices(notices);
    } catch (error) {
      console.error("공지사항 조회 오류: ", error);
      return [];
    }
  } else {
    // ------- api route 사용 ------- //
    try {
      const response = await fetch("/api/announcement");

      if (!response.ok) {
        console.error("API 응답 실패:", response.status);
        throw new Error("공지사항 목록을 불러올 수 없습니다.");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("공지사항 조회 오류: ", error);
      throw error;
    }
  }
}

// ------------------------------------------------------
// 공지사항 작성
// ------------------------------------------------------

export async function createNotice(data: {
  title: string;
  is_pinned: boolean;
  content: string;
}): Promise<Notice> {
  // 유효성 검사
  if (!data.title.trim()) {
    throw new Error("제목을 입력해주세요.");
  }
  if (data.title.length > 255) {
    throw new Error("제목은 255자를 초과할 수 없습니다.");
  }
  if (!data.content.trim()) {
    throw new Error("내용을 입력해주세요.");
  }

  if (USE_MOCK) {
    // ------- 로컬스토리지 사용 ------- //
    try {
      const existingNotices = await getNotices();

      // 새 공지사항 객체 생성
      const newNotice: Notice = {
        announcement_id: crypto.randomUUID(),
        user_id: "admin", // 변경 필요 (임시 사용자)
        title: data.title.trim(),
        content: data.content.trim(),
        is_pinned: data.is_pinned,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 새 공지사항을 목록에 추가
      const updatedNotices = [newNotice, ...existingNotices];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotices));

      return newNotice;
    } catch (error) {
      console.error("공지사항 작성 오류:", error);
      throw new Error("공지사항 작성에 실패했습니다.");
    }
  } else {
    // ------- api route 사용 ------- //
    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title.trim(),
          content: data.content.trim(),
          is_pinned: data.is_pinned,
          user_id: "admin", // 변경 필요 (임시 사용자)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "공지사항 작성에 실패했습니다.");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("공지사항 작성 오류: ", error);
      throw error;
    }
  }
}

// ------------------------------------------------------
// 공지사항 상세
// ------------------------------------------------------
export async function getNoticeById(id: string): Promise<Notice | null> {
  if (USE_MOCK) {
    // ------- 로컬스토리지 사용 ------- //
    try {
      const notices = await getNotices();
      return notices.find((notice) => notice.announcement_id === id) || null;
    } catch (error) {
      console.error("공지사항 조회 오류: ", error);
      return null;
    }
  } else {
    // ------- api route 사용 ------- //
    try {
      const response = await fetch(`/api/announcement?id=${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("공지사항을 불러올 수 없습니다.");
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error("공지사항 조회 오류: ", error);
      throw error;
    }
  }
}
