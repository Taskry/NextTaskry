// ------------------------------------------------------
// 테스트용 mock 데이터

// 스키마:
// announcement_id, user_id, title, content,
// is_pinned, created_at, updated_at
// ------------------------------------------------------
export type Notice = {
  announcement_id: string; // (uuid)
  user_id: string | null; // (uuid)
  title: string; // (varcher(255))
  content: string; // (text)
  is_pinned: boolean; // (default false) -> 중요 공지
  created_at: string; // (timestamp)
  updated_at: string; // (timestamp)
};

export const mockNotices: Notice[] = [
  {
    announcement_id: "9e2b1d3d-4c5e-4f6a-8b0c-7d9a0f3e2c1b",
    user_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    title: "테스트를 위한 중요 공지(중요)",
    content: "이거는 중요 공지입니다.",
    is_pinned: true,
    created_at: "2025-11-18T14:00:00Z",
    updated_at: "2025-11-18T14:00:00Z",
  },
  {
    announcement_id: "7f5a4e2c-3b1d-9f0e-8d7c-6b5a4f3e2d1c",
    user_id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
    title: "테스트를 위한 일반 공지",
    content: "이거는 일반 공지입니다.",
    is_pinned: false,
    created_at: "2025-11-15T09:30:00Z",
    updated_at: "2025-11-15T09:30:00Z",
  },
];

export const STORAGE_KEY = "notice_storage";
