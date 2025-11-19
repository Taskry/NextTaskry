export const TASK_MESSAGES = {
  CREATED: "작업이 생성되었습니다.",
  UPDATED: "작업이 저장되었습니다.",
  DELETED: "작업이 삭제되었습니다.",
  DELETE_CONFIRM: "정말 이 작업을 삭제하시겠습니까?",
  UNSAVED_CHANGES: "변경 사항이 있습니다. 저장하시겠습니까?",
  CREATE_FAILED: "작업 생성에 실패했습니다. 다시 시도해주세요.",
} as const;

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "제목은 필수입니다.",
  INVALID_DATE: "날짜 형식이 잘못되었습니다.",
  END_BEFORE_START: "종료일은 시작일보다 늦어야 합니다.",
} as const;
