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
      setMemos([newMemoData, ...memos]);
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

  return (
    <div className="h-full flex flex-col">
      {/* 메모 박스 */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-main-200/80 dark:bg-main-700/80">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            📝 메모
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {memos.length}
            </span>
          </h2>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 메모 입력 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <textarea
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={memoMaxLength}
            placeholder="메모를 입력하세요 (저장: Ctrl+Enter)"
            disabled={loadingMemos}
            rows={3}
            className={[
              "w-full p-3 border rounded-lg resize-none text-sm focus:outline-none",
              "border-gray-300 focus:ring-2 focus:ring-main-300 bg-white text-gray-900",
              "dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-main-500 dark:text-gray-200",
              "disabled:bg-gray-100 dark:disabled:bg-gray-600",
            ].join(" ")}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {newMemo.length} / {memoMaxLength}자
            </span>
            <button
              onClick={handleAddMemo}
              disabled={loadingMemos || !newMemo.trim()}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                "bg-main-300 text-white hover:bg-main-400",
                "disabled:bg-gray-300 disabled:cursor-not-allowed",
                "dark:bg-main-500 dark:hover:bg-main-600",
                "dark:disabled:bg-gray-600",
              ].join(" ")}
            >
              {loadingMemos ? "저장 중..." : "메모 추가"}
            </button>
          </div>
        </div>

        {/* 메모 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
              로딩 중...
            </div>
          ) : memos.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
              메모가 없습니다
            </div>
          ) : (
            <div className="space-y-2">
              {memos.map((memo) => (
                <div
                  key={memo.memo_id}
                  className={[
                    "bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg shadow-sm",
                    "border border-yellow-200 dark:border-yellow-700",
                    "hover:shadow-md transition-shadow group",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(memo.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    {memo.is_pinned && (
                      <span
                        className={[
                          "text-xs bg-blue-100 dark:bg-blue-800/50",
                          "text-blue-700 dark:text-blue-300",
                          "px-2 py-1 rounded whitespace-nowrap",
                        ].join(" ")}
                      >
                        📌 고정
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteMemo(memo.memo_id)}
                      className={[
                        "ml-auto opacity-0 group-hover:opacity-100",
                        "text-gray-400 hover:text-red-500 transition-all",
                        "dark:text-gray-400/60 dark:hover:text-red-400",
                      ].join(" ")}
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
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {memo.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoView;
