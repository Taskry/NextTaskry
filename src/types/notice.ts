// ------------------------------------------------------
// 테이블 스키마:
// announcement_id, user_id, title, content,
// is_important, created_at, updated_at
// ------------------------------------------------------

export type Notice = {
  announcement_id: string; // (int8)
  user_id: string | null; // (uuannouncement_id)
  title: string; // (varcher(255))
  content: string; // (text: any)
  is_important: boolean; // (default false) -> 중요 공지
  created_at: string; // (timestamp)
  updated_at: string; // (timestamp)
};

// ------------------------------------------------------
// API 응답 타입
// ------------------------------------------------------

export interface NoticeResponse {
  data: Notice[];
  totalCount: number;
}

// ------------------------------------------------------
// 페이지네이션 Props 타입
// ------------------------------------------------------

export interface NoticePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ------------------------------------------------------
// 수정 타입
// ------------------------------------------------------

export interface NoticeEditState {
  title: string;
  content: string;
  isImportant: boolean;
}

export interface NoticeEditModeProps {
  editState: NoticeEditState;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImportantChange: (isImportant: boolean) => void;
}

// ------------------------------------------------------
// 공지사항 수정, 삭제, 저장 타입
// ------------------------------------------------------

export interface NoticeActionButtonsProps {
  admin: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: () => void;
}

// ------------------------------------------------------
// 공지사항 조회 타입
// ------------------------------------------------------

export interface NoticeViewModeProps {
  notice: Notice;
}

// ------------------------------------------------------
// 공지사항 네비게이션 타입
// ------------------------------------------------------

export interface NoticeNavigationProps {
  nextNotice: Notice | null;
  prevNotice: Notice | null;
}
