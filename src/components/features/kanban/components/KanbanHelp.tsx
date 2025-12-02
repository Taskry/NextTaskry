/**
 * 칸반 도움말 컴포넌트
 *
 * 사용 위치: KanbanBoard 상단 (헤더 아래)
 * 표시 내용: 사용법, 드래그앤드롭, 필터 기능, 상태별 색상 가이드
 */

export default function KanbanHelp() {
  return (
    <div className="mx-2 sm:mx-4 mt-2 sm:mt-4 mb-2 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {/* 도움말 메시지 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg
            className="w-4 h-4 text-main-500 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium text-xs">드래그로 상태 변경</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span>•</span>
          <span>필터로 작업 검색</span>
        </div>

        {/* 구분선 - 데스크톱만 */}
        <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-gray-600" />

        {/* 키보드 단축키 - 데스크톱만 */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-mono">
              ESC
            </kbd>
            <span>닫기</span>
          </span>
        </div>

        {/* 상태별 색상 가이드 */}
        <div className="ml-auto flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>할일</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>진행중</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
