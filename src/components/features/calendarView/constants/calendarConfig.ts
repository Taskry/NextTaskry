/**
 * 캘린더 설정 상수
 */

/**
 * 캘린더 UI 메시지 (한국어 로케일)
 * 사용 위치: CalendarView 컴포넌트의 messages prop
 * 역할: react-big-calendar의 모든 텍스트를 한국어로 변환
 */
export const CALENDAR_MESSAGES = {
  allDay: "종일",
  previous: "이전",
  next: "다음",
  today: "오늘",
  month: "월",
  week: "주",
  day: "일",
  agenda: "일정",
  date: "날짜",
  time: "시간",
  event: "이벤트",
  noEventsInRange: "이 기간에 이벤트가 없습니다.",
  showMore: (total: number) => `+${total}개 더보기`,
};

/**
 * 캘린더 시간 표시 설정
 * 사용 위치: CalendarView 컴포넌트의 시간 관련 props
 * 역할: 주간/일간 뷰의 시간 범위 및 단위 설정
 */
export const CALENDAR_TIME_CONFIG = {
  minTime: new Date(0, 0, 0, 8, 0, 0), // 표시 시작: 오전 8시
  maxTime: new Date(0, 0, 0, 23, 59, 0), // 표시 종료: 오후 11시 59분
  scrollToTime: new Date(0, 0, 0, 8, 0, 0), // 초기 스크롤 위치: 오전 8시
  step: 15, // 시간 간격: 15분
  timeslots: 4, // 시간당 슬롯 개수: 4개 (15분 × 4)
};

/**
 * 캘린더 인터랙션 설정
 * 사용 위치: handleSelectSlot 함수
 * 역할: 사용자 클릭/드래그 동작 감지 기준값
 */
export const CALENDAR_INTERACTION_CONFIG = {
  doubleClickThreshold: 300, // 더블클릭 판정 시간(ms)
};

/**
 * 캘린더 뷰 타입 상수
 * 사용 위치: CalendarView의 view 상태 관리
 * 역할: 뷰 타입을 리터럴 타입으로 제한
 */
export const CALENDAR_VIEWS = {
  MONTH: "month" as const,
  WEEK: "week" as const,
  DAY: "day" as const,
  AGENDA: "agenda" as const,
};

/**
 * 뷰 타입별 한국어 라벨
 * 사용 위치: CalendarHeader 컴포넌트
 * 역할: 현재 선택된 뷰를 한국어로 표시
 */
export const VIEW_LABELS = {
  [CALENDAR_VIEWS.MONTH]: "월간뷰",
  [CALENDAR_VIEWS.WEEK]: "주간뷰",
  [CALENDAR_VIEWS.DAY]: "일간뷰",
  [CALENDAR_VIEWS.AGENDA]: "일정뷰",
} as const;

/**
 * 업무 시간 범위
 * 사용 위치: TimeSlotWrapper, isBusinessTime 함수
 * 역할: 업무 시간대를 초록색 배경으로 시각적 구분
 */
export const BUSINESS_HOURS = {
  start: 9, // 업무 시작: 오전 9시
  end: 18, // 업무 종료: 오후 6시
} as const;

/**
 * 점심 시간 범위
 * 사용 위치: TimeSlotWrapper, isLunchTime 함수
 * 역할: 점심 시간대를 노란색 배경으로 시각적 구분
 */
export const LUNCH_TIME = {
  start: 12, // 점심 시작: 오후 12시
  end: 13, // 점심 종료: 오후 1시
} as const;

/**
 * 캘린더 사용자 편의 기능 설정
 * 사용 위치: 각 컴포넌트 및 함수에서 조건부 렌더링/동작 제어
 * 역할: 기능 활성화 여부를 중앙에서 관리
 */
export const CALENDAR_FEATURES = {
  highlightToday: true, // 오늘 날짜 강조 표시
  highlightWeekends: true, // 주말 색상 구분
  showBusinessHours: true, // 업무 시간대 배경색 표시
  showLunchTime: true, // 점심 시간대 배경색 표시
  showOtherMonthDays: true, // 월간뷰에서 다른 달 날짜 표시
  updateCurrentTime: true, // 현재 시간 1분마다 업데이트
  enableKeyboardShortcuts: true, // 키보드 단축키 활성화
  showEventCount: true, // 헤더에 일정 개수 표시
  showWeekNumbers: false, // 주차 번호 표시 (미사용)
  enableDragAndDrop: false, // 일정 드래그 이동 (향후 기능)
  showMiniCalendar: false, // 사이드 미니 캘린더 (향후 기능)
  autoSaveViewPreference: true, // 마지막 뷰 선택 기억
  compactMode: false, // 모바일 컴팩트 모드 (향후 기능)
} as const;

/**
 * 캘린더 알림 설정
 * 사용 위치: 모달, 확인 다이얼로그
 * 역할: 사용자 안내 및 확인 메시지 표시 여부
 */
export const CALENDAR_NOTIFICATIONS = {
  showHelp: false, // 도움말 기본 표시 여부
  showWelcomeMessage: false, // 첫 방문 시 안내 메시지
  confirmBeforeDelete: true, // 일정 삭제 전 확인
} as const;

/**
 * 캘린더 성능 최적화 설정
 * 사용 위치: 이벤트 로딩, 렌더링 최적화
 * 역할: 많은 일정 처리 시 성능 개선
 */
export const CALENDAR_PERFORMANCE = {
  lazyLoadEvents: false, // 이벤트 지연 로딩 (향후 기능)
  virtualScrolling: false, // 가상 스크롤링 (향후 기능)
  cacheEvents: true, // 이벤트 데이터 캐싱
} as const;
