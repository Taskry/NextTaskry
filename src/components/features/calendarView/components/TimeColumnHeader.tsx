/**
 * 시간 열 헤더 컴포넌트
 *
 * 사용 위치: CalendarView의 components.timeGutterHeader
 * 표시 내용: 주간/일간 뷰 왼쪽 시간 열 상단의 "시간" 텍스트
 * 위치: 캘린더 왼쪽 상단 모서리
 */

export default function TimeColumnHeader() {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 px-1 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
      <div className="font-medium">시간</div>
    </div>
  );
}
