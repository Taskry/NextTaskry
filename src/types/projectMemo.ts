// src/types/memo.ts

/**
 * ProjectMemo 기본 인터페이스
 * Supabase project_memos 테이블과 동기화
 */

// 프로젝트 메모 인터페이스

export interface ProjectMemo {
  memo_id: string;
  project_id: string;
  user_id: string;
  content: string;
  is_pinned: boolean;
  pinned_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// 메모 관련 상수 (길이 제한, 페이지네이션)
export const MEMO_CONSTANTS = {
  MAX_LENGTH: 5000, // 최대 메모 길이
  MIN_LENGTH: 1, // 최소 메모 길이
  DEFAULT_LIMIT: 10, // 기본 페이지당 메모 수
  DEFAULT_PAGE: 1, // 기본 페이지 번호
} as const;

/**
 * 메모 생성 요청
 */
export interface CreateMemoRequest {
  project_id: string;
  content: string;
}

/**
 * 메모 생성 응답
 */
export type CreateMemoResponse = ProjectMemo;

/**
 * 메모 수정 요청
 */
export interface UpdateMemoRequest {
  content: string;
}

/**
 * 메모 수정 응답
 */
export type UpdateMemoResponse = ProjectMemo;

/**
 * 메모 목록 응답
 */
export interface GetMemosResponse {
  data: ProjectMemo[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 메모 조회 쿼리 파라미터
 */
export interface GetMemosQuery {
  projectId: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest";
}

/**
 * 메모 삭제 응답 (소프트 삭제)
 */
export interface DeleteMemoResponse {
  message: string;
  memo_id: string;
}

/**
 * 메모 복구 요청 (소프트 삭제 복구)
 */
export interface RestoreMemoRequest {
  memo_id: string;
}

/**
 * 메모 복구 응답
 */
export type RestoreMemoResponse = ProjectMemo;

/**
 * 메모 고정 요청
 */
export interface PinMemoRequest {
  is_pinned: boolean;
}

/**
 * 메모 고정 응답
 */
export type PinMemoResponse = ProjectMemo;
/**
 * 에러 응답
 */
export interface ErrorResponse {
  error: string;
  statusCode: number;
}

/**
 * API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
