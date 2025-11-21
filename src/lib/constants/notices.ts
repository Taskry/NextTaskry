export const NOTICE_CONSTANS = {
  ITEMS_PER_PAGE: 8,
  TITLE_MAX_LENGTH: 255,
  CONTENT_MIN_LENGTH: 1,
} as const;

export const NOTICE_MESSAGES = {
  // ---------------------------- 입력 검증
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_TOO_LONG: "제목은 255자를 초과할 수 없습니다.",
  CONTENT_REQUIRED: "내용을 입력해주세요.",

  // ---------------------------- 확인 메시지
  DELETE_CONFIRM: "정말로 이 공지사항을 삭제하시겠습니까?",

  // ---------------------------- 성공 메시지
  CREATE_SUCCESS: "작성이 완료되었습니다.",
  UPDATE_SUCCESS: "성공적으로 수정되었습니다.",
  DELETE_SUCCESS: "공지사항이 삭제되었습니다.",

  // ---------------------------- 로딩 & 상태
  NOT_FOUND: "공지사항을 찾을 수 없습니다.",
  LOADING: "공지사항을 불러오는 중입니다...",

  // ----------------------------  에러 메시지
  LOAD_ERROR: "공지사항을 불러오는 데 실패했습니다.",
  DELETE_ERROR: "삭제 중 오류가 발생했습니다.",
  UPDATE_ERROR: "수정 중 오류가 발생했습니다.",
  CREATE_ERROR: "작성 중 오류가 발생했습니다.",
  UNKNOWN_ERROR: "오류가 발생했습니다. 다시 시도해주세요.",
} as const;
