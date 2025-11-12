// components/MemoPanel.tsx

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
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 - 칸반보드와 동일한 스타일 */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📝 메모
          <span className="text-sm font-normal text-gray-500">
            ({memos.length})
          </span>
        </h2>
      </div>

      {/* 메모 입력 */}
      <div className="p-4 border-b border-gray-200">
        <textarea
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={3}
        />
        <button
          onClick={handleAddMemo}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          메모 추가
        </button>
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {memos.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            메모가 없습니다
          </div>
        ) : (
          memos.map((memo) => (
            <div
              key={memo.id}
              className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs text-gray-500">{memo.createdAt}</span>
                <button
                  onClick={() => handleDeleteMemo(memo.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
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
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {memo.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoPanel;
