"use client";

import { useState, useEffect } from "react";
import { ProjectMemo } from "@/types/projectMemo";

const MEMO_MAX_LENGTH = 5000;

interface MemoFormProps {
  projectId: string;
}

const MemoView = ({ projectId }: MemoFormProps) => {
  const [memos, setMemos] = useState<ProjectMemo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [loadingMemos, setLoadingMemos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const memoMaxLength = MEMO_MAX_LENGTH;

  // 메모 목록 조회
  const fetchMemos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        projectId,
        userId: "", // 추가된 부분
        page: "1",
        limit: "20",
        sortBy: "newest",
      });

      const res = await fetch(`/api/projectMemos?${params}`);
      if (!res.ok) throw new Error("메모 조회 실패");

      const data = await res.json();
      setMemos(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 조회 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (projectId) {
      fetchMemos();
    }
  }, [projectId]);

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

      const newMemoData = await res.json();
      const updatedMemos = [newMemoData, ...memos];

      // 고정된 메모를 위로 정렬
      const sortedMemos = updatedMemos.sort((a, b) => {
        // 1. 고정 상태 우선
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        // 2. 같은 고정 상태면 생성일 기준 내림차순
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      setMemos(sortedMemos);
      setNewMemo("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 저장 실패");
    } finally {
      setLoadingMemos(false);
    }
  };

  // 메모 삭제
  const handleDeleteMemo = async (memoId: string) => {
    if (!confirm("메모를 삭제하시겠습니까?")) return;

    try {
      setError(null);

      const res = await fetch(`/api/projectMemos?memoId=${memoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "메모 삭제 실패");
      }

      setMemos(memos.filter((memo) => memo.memo_id !== memoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 삭제 실패");
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

      const res = await fetch(`/api/projectMemos?memoId=${memoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_pinned: !isPinned,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "메모 고정 설정 실패");
      }

      // 메모 목록 업데이트 및 정렬
      const updatedMemos = memos.map((memo) =>
        memo.memo_id === memoId
          ? {
              ...memo,
              is_pinned: !isPinned,
              pinned_at: !isPinned ? new Date().toISOString() : null,
            }
          : memo
      );

      // 고정된 메모를 위로 정렬
      const sortedMemos = updatedMemos.sort((a, b) => {
        // 1. 고정 상태 우선
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        // 2. 같은 고정 상태면 생성일 기준 내림차순
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      setMemos(sortedMemos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 고정 설정 실패");
    }
  };

  // 작성자 확인 함수 (userId는 세션에서 가져와야 함)
  const isAuthor = (memoUserId: string) => {
    // TODO: 실제 로그인한 사용자 ID와 비교
    return true; // 임시로 모든 메모에 삭제 권한 부여
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 mb-4 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 rounded-t-lg shadow-sm">
        <h2 className="text-xl font-bold text-white dark:text-gray-100">
          메모
        </h2>
        <span className="text-sm font-medium text-white/90 dark:text-gray-200">
          {memos.length}
        </span>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
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
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <textarea
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MEMO_MAX_LENGTH}
          placeholder="메모를 입력하세요..."
          disabled={loadingMemos}
          rows={3}
          className="w-full p-3 border-0 bg-gray-50 dark:bg-gray-900/50 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-main-400 dark:focus:ring-main-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {newMemo.length} / {MEMO_MAX_LENGTH}
          </span>
          <button
            onClick={handleAddMemo}
            disabled={loadingMemos || !newMemo.trim()}
            className="group relative px-4 py-2 bg-gradient-to-r from-main-400 to-main-500 dark:from-main-500 dark:to-main-600 text-white text-sm rounded-lg font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden"
          >
            <span className="relative z-10">
              {loadingMemos ? "저장 중..." : "추가"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-main-500 to-main-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main-400"></div>
          </div>
        ) : memos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              메모가 없습니다
            </p>
          </div>
        ) : (
          memos.map((memo) => (
            <div
              key={memo.memo_id}
              className="group relative bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50 p-3 hover:shadow-md transition-all group"
            >
              {/* 상단: 날짜 + 버튼들 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* 고정 버튼 */}
                  <button
                    onClick={() =>
                      handleTogglePin(memo.memo_id, memo.is_pinned)
                    }
                    className={`p-1.5 rounded-lg transition-all ${
                      memo.is_pinned
                        ? "text-main-500 dark:text-main-400 bg-main-50 dark:bg-main-900/30"
                        : "text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {new Date(memo.created_at).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* 삭제 버튼 */}
                {isAuthor(memo.user_id) && (
                  <button
                    onClick={() => handleDeleteMemo(memo.memo_id)}
                    className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
                {memo.content}
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
                  {memo.author?.user_name || memo.author?.email || "알 수 없음"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoView;
