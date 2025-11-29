/**
 * 캘린더 도움말 컴포넌트
 *
 * 사용 위치: CalendarView 상단 (헤더 아래)
 * 표시 내용: 사용법, 키보드 단축키, 뷰별 특징, 상태별 색상 가이드
 */

export default function CalendarHelp() {
  return (
    <div className="mx-4 mb-4 px-4 py-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm space-y-3">
      {/* 기본 사용법 & 키보드 단축키 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 기본 사용법 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            📅 기본 사용법
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>날짜 더블클릭: 새 일정 추가</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>드래그: 기간 선택하여 추가</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>일정 클릭: 상세보기/수정</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              <span>뷰 전환: 월/주/일/일정</span>
            </div>
          </div>
        </div>

        {/* 키보드 단축키 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ⌨️ 키보드 단축키
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                  N
                </kbd>
              </div>
              <span>새 일정 추가</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                ESC
              </kbd>
              <span>모달 닫기</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                  ←
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-300 dark:border-gray-600 font-mono">
                  →
                </kbd>
              </div>
              <span>날짜 이동</span>
            </div>
          </div>
        </div>
      </div>

      {/* 뷰별 특징 */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          📋 뷰별 특징
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="space-y-1">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              🗓️ 월간뷰
            </div>
            <div>• 전체 한달 일정 조망</div>
            <div>• 주말 강조 표시</div>
            <div>• 오늘 날짜 하이라이트</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              📅 주간뷰
            </div>
            <div>• 시간대별 상세 일정</div>
            <div>• 업무시간 구분 표시</div>
            <div>• 점심시간 하이라이트</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              📄 일간뷰
            </div>
            <div>• 하루 일정 집중 보기</div>
            <div>• 시간별 세부 스케줄</div>
            <div>• 오늘 특별 강조</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              📝 일정뷰
            </div>
            <div>• 목록 형태로 보기</div>
            <div>• 기간별 정렬</div>
            <div>• 검색 및 필터링</div>
          </div>
        </div>
      </div>

      {/* 일정 색상 가이드 - 칸반이랑 동일 */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🎨 일정 상태별 색상
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-400">할일</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-400">진행중</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded border"></div>
            <span className="text-gray-600 dark:text-gray-400">완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
