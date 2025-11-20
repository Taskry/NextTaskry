// ------------------------------------------------------
// 테스트용 mock 데이터

// 스키마:
// id, author_id, title, content,
// is_important, created_at, updated_at
// ------------------------------------------------------
export type Notice = {
  id: number; // (int8)
  author_id: string | null; // (uuid)
  title: string; // (varcher(255))
  content: string; // (text: any)
  is_important: boolean; // (default false) -> 중요 공지
  created_at: string; // (timestamp)
  updated_at: string; // (timestamp)
};

export const mockNotices: Notice[] = [
  {
    id: 1,
    author_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    title: "테스트를 위한 중요 공지(중요)",
    content: "이거는 중요 공지입니다.",
    is_important: true,
    created_at: "2025-11-18T14:00:00Z",
    updated_at: "2025-11-18T14:00:00Z",
  },
  {
    id: 2,
    author_id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    title: "테스트를 위한 일반 공지",
    content: "이거는 일반 공지입니다.",
    is_important: false,
    created_at: "2025-11-15T09:30:00Z",
    updated_at: "2025-11-15T09:30:00Z",
  },
];

export const STORAGE_KEY = "notice_storage";
