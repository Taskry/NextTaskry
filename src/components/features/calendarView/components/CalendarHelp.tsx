/**
 * 캘린더 도움말 컴포넌트
 *
 * 사용 위치: CalendarView 상단 (헤더 아래)
 * 표시 내용: 사용법, 키보드 단축키, 상태별 색상 가이드
 */

export default function CalendarHelp() {
  return (
    <div className="mx-2 sm:mx-4 mb-2 sm:mb-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {/* 사용법 & 단축키 */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-x-4 sm:gap-y-2">
        {/* 모바일: 사용법 + 색상 가이드 한 줄 */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          {/* 기본 사용법 */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-main-500 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">사용법</span>
          </div>

          {/* 모바일에서 상태 색상 가이드 (우측 정렬) */}
          <div className="flex sm:hidden items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded"></span>
              <span>할일</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded"></span>
              <span>진행</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded"></span>
              <span>완료</span>
            </div>
          </div>
        </div>

        {/* 사용법 상세 */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-gray-400">•</span>
            <span>더블클릭: 추가</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">•</span>
            <span>드래그: 기간선택</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-400">•</span>
            <span>클릭: 상세보기</span>
          </span>
        </div>

        {/* 구분선 - 데스크톱만 */}
        <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-gray-600" />

        {/* 키보드 단축키 - 데스크톱만 */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-mono">
              Ctrl+N
            </kbd>
            <span>새 일정</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-mono">
              ←→
            </kbd>
            <span>날짜 이동</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-mono">
              ESC
            </kbd>
            <span>닫기</span>
          </span>
        </div>

        {/* 상태별 색상 가이드 - 데스크톱만 */}
        <div className="hidden sm:flex ml-auto items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>할일</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
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
