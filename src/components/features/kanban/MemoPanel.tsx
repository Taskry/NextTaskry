"use client";

import { useState } from "react";

interface Memo {
  id: string;
  content: string;
  createdAt: string;
}

const MemoPanel = () => {
  const [memos, setMemos] = useState<Memo[]>([
    {
      id: "1",
      content: "프로젝트 킥오프 미팅 - 11/15 오후 2시",
      createdAt: "2025-11-12",
    },
    {
      id: "2",
      content: "디자인 시스템 정리\n- 메인 컬러: #3b82f6",
      createdAt: "2025-11-12",
    },
  ]);

  const [newMemo, setNewMemo] = useState("");

  const handleAddMemo = () => {
    if (!newMemo.trim()) return;

    const memo: Memo = {
      id: Date.now().toString(),
      content: newMemo,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMemos([memo, ...memos]);
    setNewMemo("");
  };

  const handleDeleteMemo = (id: string) => {
    setMemos(memos.filter((memo) => memo.id !== id));
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

        {/* 메모 입력 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <textarea
            value={newMemo}
            onChange={(e: any) => setNewMemo(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-main-300 dark:focus:ring-main-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
          />
          <button
            onClick={handleAddMemo}
            className="mt-2 w-full px-4 py-2 bg-main-300 dark:bg-main-600 text-white rounded-lg hover:bg-main-400 dark:hover:bg-main-700 transition-colors text-sm font-medium"
          >
            메모 추가
          </button>
        </div>

        {/* 메모 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {memos.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                메모가 없습니다
              </div>
            ) : (
              memos.map((memo) => (
                <div
                  key={memo.id}
                  className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-700/50 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {memo.createdAt}
                    </span>
                    <button
                      onClick={() => handleDeleteMemo(memo.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoPanel;
