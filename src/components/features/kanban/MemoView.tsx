"use client";

/**
 * MemoView 컴포넌트
 *
 * 프로젝트별 메모를 관리하는 컴포넌트
 * 주요 기능:
 * - 메모 작성, 조회, 삭제, 고정/해제
 * - 실시간 메모 동기화 (Supabase Realtime)
 * - 검색 및 필터링 (전체/내메모/고정됨)
 * - 무한 스크롤 페이지네이션
 * - 키보드 단축키 지원 (Ctrl+Enter)
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { ProjectMemo } from "@/types/projectMemo";
import { supabase } from "@/lib/supabase/supabase";
import { useSession } from "next-auth/react";
import { Icon } from "@/components/shared/Icon";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

// 메모 최대 길이 제한
const MEMO_MAX_LENGTH = 5000;

// 필터 타입: 전체, 내 메모, 고정된 메모
type FilterType = "all" | "mine" | "pinned";
// 정렬 타입: 최신순, 오래된순
type SortType = "newest" | "oldest";

interface MemoFormProps {
  projectId: string;
}

const MemoView = ({ projectId }: MemoFormProps) => {
  // === 기본 상태 관리 ===
  const [memos, setMemos] = useState<ProjectMemo[]>([]); // 서버에서 받은 원본 메모 목록
  const [newMemo, setNewMemo] = useState(""); // 새 메모 입력 내용
  const [loadingMemos, setLoadingMemos] = useState(false); // 메모 추가/수정/삭제 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [isLoading, setIsLoading] = useState(true); // 초기 데이터 로딩 상태

  // === UI 상태 관리 ===
  const [showFilter, setShowFilter] = useState(false); // 필터 영역 표시/숨김
  const [searchTerm, setSearchTerm] = useState(""); // 검색어

  // === 필터링 & 정렬 상태 ===
  const [filter, setFilter] = useState<FilterType>("all"); // 메모 필터 (전체/내메모/고정됨)
  const [sort, setSort] = useState<SortType>("newest"); // 정렬 방식 (최신순/오래된순)

  // === 페이지네이션 상태 ===
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(false); // 더 로드할 메모가 있는지

  const ITEMS_PER_PAGE = 10; // 페이지당 메모 개수

  const { data: session } = useSession();
  const memoMaxLength = MEMO_MAX_LENGTH;
  const { openModal, closeModal, modalProps } = useModal();
  const [deletingMemoId, setDeletingMemoId] = useState<string | null>(null);

  /**
   * 필터링된 메모 계산
   *
   * 클라이언트 사이드에서 실시간으로 필터링 수행
   * 1. 검색어 필터링 (메모 내용, 작성자명, 이메일)
   * 2. 작성자 필터링 (전체, 내 메모, 고정된 메모)
   * 3. 정렬 (최신순, 오래된순)
   */
  const filteredMemos = useMemo(() => {
    let result = [...memos];

    // 1️⃣ 검색어로 메모 내용, 작성자명, 이메일 필터링
    if (searchTerm.trim()) {
      result = result.filter(
        (memo) =>
          memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          memo.author?.user_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          memo.author?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. 작성자 필터
    if (filter === "mine" && session?.user?.user_id) {
      result = result.filter((memo) => memo.user_id === session.user.user_id);
    } else if (filter === "pinned") {
      result = result.filter((memo) => memo.is_pinned);
    }

    // 3. 정렬
    result.sort((a, b) => {
      // 1. 고정된 메모가 항상 위로
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      // 2. 사용자 설정에 따른 정렬
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      // 3. 정렬 방식 적용
      if (sort === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return result;
  }, [memos, filter, sort, searchTerm, session?.user?.user_id]);

  /**
   * 메모 목록 조회 함수
   *
   * @param page - 페이지 번호 (기본값: 1)
   * @param append - 기존 목록에 추가할지 여부 (무한스크롤용)
   */
  const fetchMemos = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          projectId,
          userId: filter === "mine" ? session?.user?.user_id || "" : "",
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          sortBy: sort === "newest" ? "newest" : "oldest",
          search: searchTerm,
          pinned_only: filter === "pinned" ? "true" : "false",
        });

        const res = await fetch(`/api/projectMemos?${params}`);
        if (!res.ok) throw new Error("메모 조회 실패");

        const data = await res.json();
        const newMemos = data.data || [];

        if (append) {
          setMemos((prev) => [...prev, ...newMemos]);
        } else {
          setMemos(newMemos);
        }

        setHasMore(data.hasMore || false);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : "메모 조회 실패");
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, filter, session?.user?.user_id, sort, searchTerm]
  );

  // 초기 로드
  useEffect(() => {
    if (projectId) {
      fetchMemos();
    }
  }, [projectId, fetchMemos]);

  // 필터링 및 검색어 변경 시 재조회
  useEffect(() => {
    if (projectId) {
      setCurrentPage(1);
      fetchMemos(1);
    }
  }, [searchTerm, filter, sort, projectId, fetchMemos]);

  /**
   * Supabase Realtime 구독 설정
   *
   * 다른 사용자의 메모 추가/수정/삭제를 실시간으로 동기화
   * - INSERT: 새 메모가 추가되면 목록에 추가하고 재정렬
   * - UPDATE: 메모 수정 시 목록 업데이트, soft delete 처리
   * - DELETE: 메모 삭제 시 목록에서 제거
   */
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`project-memos-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_memos",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          console.log("memo realtime payload");
          if (payload.eventType === "INSERT") {
            const insertNewMemo = payload.new as ProjectMemo;

            const { data: authorData } = await supabase
              .from("project_memos")
              .select(
                `
                *,
                author:users!project_memos_user_id_fkey(
                  user_id,
                  user_name,
                  email
                )
              `
              )
              .eq("memo_id", insertNewMemo.memo_id)
              .single();

            const memoWithAuthor = authorData || insertNewMemo;

            setMemos((prev) => {
              if (prev.some((m) => m.memo_id === memoWithAuthor.memo_id)) {
                return prev;
              }

              const updatedMemos = [memoWithAuthor, ...prev];

              const sortedMemos = updatedMemos.sort((a, b) => {
                // 1. 고정된 메모가 항상 위로
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;

                // 2. 사용자 설정에 따른 정렬
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();

                if (sort === "newest") {
                  return dateB - dateA;
                } else {
                  return dateA - dateB;
                }
              });

              return sortedMemos;
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedMemo = payload.new as ProjectMemo;

            if (updatedMemo.is_deleted) {
              console.log(updatedMemo.memo_id);
              setMemos((prev) =>
                prev.filter((memo) => memo.memo_id !== updatedMemo.memo_id)
              );
              return;
            }

            const { data: authorData } = await supabase
              .from("project_memos")
              .select(
                `
                *,
                author:users!project_memos_user_id_fkey(
                  user_id,
                  user_name,
                  email
                )
              `
              )
              .eq("memo_id", updatedMemo.memo_id)
              .single();

            const memoWithAuthor = authorData || updatedMemo;

            setMemos((prev) => {
              const updated = prev.map((memo) =>
                memo.memo_id === memoWithAuthor.memo_id ? memoWithAuthor : memo
              );

              const sortedMemos = updated.sort((a, b) => {
                // 1. 고정된 메모가 항상 위로
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;

                // 2. 사용자 설정에 따른 정렬
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();

                if (sort === "newest") {
                  return dateB - dateA;
                } else {
                  return dateA - dateB;
                }
              });

              return sortedMemos;
            });
          } else if (payload.eventType === "DELETE") {
            const deletedMemo = payload.old as ProjectMemo;
            console.log(deletedMemo.memo_id);
            setMemos((prev) =>
              prev.filter((memo) => memo.memo_id !== deletedMemo.memo_id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      console.log("memo realtime unsubscribe");
      supabase.removeChannel(channel);
    };
  }, [projectId, sort]);

  // 메모 추가
  const handleAddMemo = async () => {
    if (!newMemo.trim()) {
      setError("메모를 입력하세요");
      return;
    }

    if (newMemo.length > memoMaxLength) {
      setError(`메모는 ${memoMaxLength}자 이내여야 합니다`);
      return;
    }

    try {
      setLoadingMemos(true);
      setError(null);

      const res = await fetch("/api/projectMemos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          content: newMemo.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "메모 저장 실패");
      }

      setNewMemo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 저장 실패");
    } finally {
      setLoadingMemos(false);
    }
  };

  // 메모 삭제 확인 모달 열기
  const handleDeleteMemo = (memoId: string) => {
    setDeletingMemoId(memoId);
    openModal("delete", "메모 삭제", "이 메모를 삭제하시겠습니까?");
  };

  // 메모 삭제 실행
  const confirmDeleteMemo = async () => {
    if (!deletingMemoId) return;

    try {
      setError(null);

      const res = await fetch(`/api/projectMemos?memoId=${deletingMemoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "메모 삭제 실패");
      }

      // 삭제 성공 시 deleteSuccess 모달 표시
      closeModal();
      setTimeout(() => {
        openModal("deleteSuccess");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 삭제 실패");
    } finally {
      setDeletingMemoId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleAddMemo();
    }
  };

  // 메모 고정/해제
  const handleTogglePin = async (memoId: string, isPinned: boolean) => {
    try {
      setError(null);

      const requestBody = {
        is_pinned: !isPinned, // 서버에서 pinned_at을 자동으로 처리함
      };

      const res = await fetch(`/api/projectMemos?memoId=${memoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "메모 고정 설정 실패");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 고정 설정 실패");
    }
  };

  // 작성자 확인 함수
  const isAuthor = (memoUserId: string) => {
    return session?.user?.user_id === memoUserId;
  };

  /**
   * 검색어 하이라이트 함수
   *
   * 메모 내용에서 검색어와 일치하는 부분을 노란색으로 강조 표시
   * @param text - 하이라이트할 텍스트
   * @returns JSX 요소 배열 (하이라이트된 부분 포함)
   */
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm.trim()) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-600/50 text-gray-900 dark:text-gray-100 rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  /**
   * 무한 스크롤 - 더 많은 메모 로드
   *
   * 현재 로딩 중이 아니고 더 로드할 데이터가 있을 때만 실행
   * append=true로 기존 목록에 새 메모들을 추가
   */
  const loadMoreMemos = () => {
    if (!isLoading && hasMore) {
      fetchMemos(currentPage + 1, true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 shadow-sm">
        <h2 className="text-sm font-bold text-white dark:text-gray-100">
          메모
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/90 dark:text-gray-200">
            {filteredMemos.length}개
          </span>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            title={showFilter ? "필터 닫기" : "필터 열기"}
          >
            <Icon
              type="filter"
              size={14}
              className={`text-white transition-transform duration-300 ${
                showFilter ? "scale-110" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      {showFilter && (
        <div className="m-2 p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg space-y-2.5">
          {/* 작성자 & 고정 필터 */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
              표시
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  filter === "all"
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-main-300"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter("mine")}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  filter === "mine"
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-main-300"
                }`}
              >
                내 메모
              </button>
              <button
                onClick={() => setFilter("pinned")}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors flex items-center justify-center gap-0.5 ${
                  filter === "pinned"
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-main-300"
                }`}
              >
                <Icon type="pin" size={9} />
                고정
              </button>
            </div>
          </div>

          {/* 검색 */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
              검색
            </span>
            <div className="relative">
              <Icon
                type="search"
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="메모, 작성자..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-6 py-1 text-[11px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 input-focus-style"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Icon type="x" size={10} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* 정렬 */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase">
              정렬
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setSort("newest")}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  sort === "newest"
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-main-300"
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSort("oldest")}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  sort === "oldest"
                    ? "bg-main-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-main-300"
                }`}
              >
                오래된순
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-2 sm:mx-4 mb-2 px-3 sm:px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* 메모 입력 폼 */}
      <div className="m-2 p-2.5 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <textarea
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MEMO_MAX_LENGTH}
            placeholder="메모를 입력하세요..."
            disabled={loadingMemos}
            rows={3}
            className="w-full p-3 sm:p-4 pr-8 sm:pr-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 rounded-xl resize-none text-sm input-focus-style transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
          />
          {newMemo && (
            <button
              onClick={() => setNewMemo("")}
              className="absolute right-2 top-2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="메모 내용 지우기"
            >
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {newMemo.length} / {MEMO_MAX_LENGTH}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                ↵
              </kbd>
            </span>
          </div>
          <Button
            onClick={handleAddMemo}
            disabled={loadingMemos || !newMemo.trim()}
            btnType="form"
            icon="plus"
            size={16}
            className="w-full sm:w-auto"
          >
            {loadingMemos ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              "추가"
            )}
          </Button>
        </div>
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-400"></div>
          </div>
        ) : filteredMemos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-400 dark:text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {searchTerm
                ? `"${searchTerm}"에 대한 검색 결과가 없습니다`
                : filter === "mine"
                ? "작성한 메모가 없습니다"
                : filter === "pinned"
                ? "고정된 메모가 없습니다"
                : "첫 번째 메모를 작성해보세요!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 px-4 py-2 text-xs font-medium text-main-600 dark:text-main-400 bg-main-50 dark:bg-main-900/30 hover:bg-main-100 dark:hover:bg-main-900/50 rounded-lg transition-colors"
              >
                검색어 지우기
              </button>
            )}
          </div>
        ) : (
          <>
            {filteredMemos.map((memo) => (
              <div
                key={memo.memo_id}
                className={`group relative rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  memo.is_pinned
                    ? "bg-main-50 dark:bg-main-900/30 border-2 border-main-200 dark:border-main-700/50"
                    : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50"
                }`}
              >
                {/* 상단: 날짜 + 버튼들 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* 고정 버튼 */}
                    <button
                      onClick={() =>
                        handleTogglePin(memo.memo_id, memo.is_pinned)
                      }
                      className={`p-2 rounded-lg transition-all ${
                        memo.is_pinned
                          ? "text-main-500 dark:text-main-400 bg-main-50 dark:bg-main-900/30"
                          : "text-gray-400 dark:text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      title={memo.is_pinned ? "고정 해제" : "고정"}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          transform: memo.is_pinned
                            ? "rotate(45deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                      </svg>
                    </button>

                    {/* 날짜 */}
                    <span className="text-xs text-gray-400 dark:text-gray-400 font-medium">
                      {(() => {
                        const utcDate = new Date(memo.created_at);
                        const kstDate = new Date(
                          utcDate.getTime() - 9 * 60 * 60 * 1000
                        );
                        return kstDate.toLocaleString("ko-KR", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit", // 초 추가
                          hour12: false,
                        });
                      })()}
                    </span>
                  </div>

                  {/* 삭제 버튼 */}
                  {isAuthor(memo.user_id) && (
                    <button
                      onClick={() => handleDeleteMemo(memo.memo_id)}
                      className="p-2 rounded-lg text-gray-400 dark:text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="삭제"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* 내용 */}
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed mb-3">
                  {highlightSearchTerm(memo.content)}
                </p>

                {/* 작성자 */}
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-md text-xs text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {memo.author?.user_name ||
                      memo.author?.email ||
                      "알 수 없음"}
                  </span>
                </div>
              </div>
            ))}

            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="flex justify-center pt-4 pb-2">
                <button
                  onClick={loadMoreMemos}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-main-600 dark:text-main-400 bg-main-50 dark:bg-main-900/30 hover:bg-main-100 dark:hover:bg-main-900/50 border border-main-200 dark:border-main-700/50 rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-main-500 border-t-transparent"></div>
                      로딩 중...
                    </>
                  ) : (
                    <>
                      <Icon type="chevronDown" size={16} />
                      더보기
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal {...modalProps} onConfirm={confirmDeleteMemo} />
    </div>
  );
};

export default MemoView;
