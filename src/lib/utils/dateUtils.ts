// 날짜 관련 유틸리티 함수 모음

/**
 * 두 날짜가 같은 날인지 확인하는 함수
 */

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * 오늘 날짜인지 확인하는 함수
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * 주말(토요일, 일요일)인지 확인하는 함수
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

/**
 * 다른 달인지 확인하는 함수
 */

export const isDifferentMonth = (date: Date, baseDate: Date): boolean => {
  return (
    date.getMonth() !== baseDate.getMonth() ||
    date.getFullYear() !== baseDate.getFullYear()
  );
};

/**
 * 날짜 이동 방향
 * */
export type DateDirection = -1 | 0 | 1;

/**
 * 뷰 타입에 따라 날짜를 이동시키는 함수 (일간, 주간, 월간, 일정)
 * @param currentDate 현재 기준 날짜
 * @param direction 이동 방향 ('PREV', 'NEXT', 'TODAY')
 * @param view 뷰 타입 ('day', 'week', 'month', 'agenda')
 * @returns 이동된 날짜
 */
export const navigateDate = (
  currentDate: Date,
  direction: DateDirection,
  viewType: "day" | "week" | "month" | "agenda"
): Date => {
  const newDate = new Date(currentDate);

  switch (viewType) {
    case "month":
      newDate.setMonth(newDate.getMonth() + direction);
      break;
    case "week":
      newDate.setDate(newDate.getDate() + direction * 7);
      break;
    case "day":
    case "agenda":
      newDate.setDate(newDate.getDate() + direction);
      break;
  }

  return newDate;
};

/*
 * 업무 시간인지 확인 (오전 9시 ~ 오후 6시)
 */
export const isBusinessTime = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 9 && hours < 18;
};

/**
 * 점심 시간인지 확인 (오후 12시 ~ 오후 1시)
 */
export const isLunchTime = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 12 && hours < 13;
};

/**
 * 날짜 범위 계산 (시작일과 종료일 사이의 일수)
 */
export const getDaysDiff = (start: Date, end: Date): number => {
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/** 날짜를 자정으로 설정(00:00:00.000) */
export const setToStartOfDay = (date: Date): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * 날짜를 하루 끝(23:59:59.999)으로 설정
 */
export const setToEndOfDay = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};
