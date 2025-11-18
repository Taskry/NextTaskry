import { mockNotices, Notice, STORAGE_KEY } from "@/app/data/mockNotices";

// ------------------------------------------------------
// 추후 DB 연결 시, localStorage -> fetch(route.ts)로 교체
// ------------------------------------------------------

// ------------------------------------------------------
// 공지사항 목록 조회
// ------------------------------------------------------

export async function getNotices(): Promise<Notice[]> {
  if (typeof window === "undefined") {
    return [];
  }

  const savedNoticesJson = localStorage.getItem(STORAGE_KEY);

  // 저장된 데이터가 있다면
  if (savedNoticesJson) {
    return JSON.parse(savedNoticesJson) as Notice[];
  }

  // 저장된 데이터가 없다면 -> localStroage 저장 후 반환
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotices));
  return mockNotices;
}

// ------------------------------------------------------
// 공지사항 작성
// ------------------------------------------------------

export async function createNotice(data: {
  title: string;
  is_pinned: boolean;
  content: string;
}): Promise<Notice> {
  // 기존 목록 불러오고
  // 없다면 초기 mock 데이터 사용
  const existingNoticesJson = localStorage.getItem(STORAGE_KEY);
  const existingNotices: Notice[] = existingNoticesJson
    ? JSON.parse(existingNoticesJson)
    : [];

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
  const updatedNotices = [newNotice, ...existingNotices].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1; // pinned가 먼저
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // 로컬스토리지에 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotices));

  return newNotice;
}

// ------------------------------------------------------
// 공지사항 상세
// ------------------------------------------------------
export async function getNoticeById(id: string): Promise<Notice | null> {
  const notices = await getNotices();
  return notices.find((notice) => notice.announcement_id === id) || null;
}
