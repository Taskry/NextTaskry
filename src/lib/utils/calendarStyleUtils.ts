/**
 * 캘린더 스타일 관련 유틸리티 함수
 */

/**
 * 주간 뷰 헤더 스타일 인터페이스
 * 사용 위치: WeekHeader 컴포넌트
 */
export interface WeekHeaderStyles {
  container: string; // 전체 배경 및 레이아웃
  day: string; // 요일 텍스트 ("월", "화")
  date: string; // 날짜 숫자 (15, 16)
}

/**
 * 일간 뷰 헤더 스타일 인터페이스
 * 사용 위치: DayHeader 컴포넌트
 */
export interface DayHeaderStyles {
  container: string; // 전체 배경 및 레이아웃
  weekdayText: string; // 요일 전체 ("월요일", "화요일")
  dateText: string; // 날짜 숫자 (15)
  monthText: string; // 년월 표시 ("2024년 11월")
}

/**
 * 월간 뷰 요일 헤더 스타일 인터페이스
 * 사용 위치: MonthHeader 컴포넌트
 */
export interface MonthHeaderStyles {
  container: string; // 요일 셀 배경 및 텍스트 색상
  text: string; // 요일 텍스트 스타일
}

/**
 * 주간 뷰 헤더 스타일 가져오기
 */
export const getWeekHeaderStyles = (
  isToday: boolean,
  isWeekend: boolean,
  isOutsideProject?: boolean
): WeekHeaderStyles => {
  // 프로젝트 기간 밖
  if (isOutsideProject) {
    return {
      container: "bg-gray-100 dark:bg-gray-900 opacity-50 cursor-not-allowed",
      day: "text-gray-400 dark:text-gray-600",
      date: "text-gray-400 dark:text-gray-600 line-through",
    };
  }

  // 오늘
  if (isToday) {
    return {
      container:
        "bg-gradient-to-b from-main-50 to-main-100 dark:from-main-900/30 dark:to-main-800/20 border-main-300 dark:border-main-600",
      day: "text-main-600 dark:text-main-400",
      date: "bg-main-500 text-white rounded-lg px-2 py-1 font-bold mx-auto inline-block shadow-sm",
    };
  }

  // 주말
  if (isWeekend) {
    return {
      container: "bg-red-50 dark:bg-red-900/10",
      day: "text-red-500 dark:text-red-400",
      date: "text-red-600 dark:text-red-400 font-medium",
    };
  }

  // 평일
  return {
    container: "bg-white dark:bg-gray-800",
    day: "text-gray-500 dark:text-gray-400",
    date: "text-gray-700 dark:text-gray-300 font-medium",
  };
};

/**
 * 일간 뷰 헤더 스타일 가져오기
 */
export const getDayHeaderStyles = (
  isToday: boolean,
  isOutsideProject?: boolean
): DayHeaderStyles => {
  // 프로젝트 기간 밖
  if (isOutsideProject) {
    return {
      container:
        "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 opacity-40",
      weekdayText: "text-gray-400 dark:text-gray-500",
      dateText: "text-gray-400 dark:text-gray-500",
      monthText: "text-gray-400 dark:text-gray-500",
    };
  }

  // 오늘
  return {
    container: isToday
      ? "border-main-500 bg-gradient-to-r from-main-50 to-main-100 dark:from-main-900/30 dark:to-main-800/20"
      : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50",
    weekdayText: isToday
      ? "text-main-600 dark:text-main-400"
      : "text-gray-500 dark:text-gray-400",
    dateText: isToday
      ? "text-main-600 dark:text-main-400"
      : "text-gray-700 dark:text-gray-300",
    monthText: isToday
      ? "text-main-500 dark:text-main-300"
      : "text-gray-400 dark:text-gray-500",
  };
};
/**
 * 월간 뷰 날짜 헤더 스타일 가져오기
 */
export const getMonthDateHeaderStyles = (
  isToday: boolean,
  isWeekend: boolean,
  isOtherMonth: boolean,
  isOutsideProject?: boolean
): string => {
  if (isOutsideProject) {
    return "text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-30 bg-gray-100 dark:bg-gray-900";
  }

  if (isOtherMonth) {
    return "text-gray-500 dark:text-gray-400 opacity-50";
  }

  if (isToday) {
    return "bg-main-500 text-white rounded-lg mx-1 font-bold shadow-sm";
  }

  if (isWeekend) {
    return "text-red-500 dark:text-red-400 font-medium";
  }

  return "text-gray-700 dark:text-gray-300";
};

/**
 * 월간 뷰 요일 헤더 스타일 가져오기
 * @param isWeekend 주말 여부
 * @param dayIndex 요일 인덱스 (0: 일 ~ 6: 토)
 */

export const getMonthHeaderStyles = (dayIndex?: number): MonthHeaderStyles => {
  const isSaturday = dayIndex === 6;
  const isSunday = dayIndex === 0;

  if (isSaturday) {
    return {
      container: "text-blue-500 dark:text-blue-400 font-medium",
      text: "text-blue-500 dark:text-blue-400 font-medium",
    };
  }

  if (isSunday) {
    return {
      container: "text-red-500 dark:text-red-400 font-medium",
      text: "text-red-500 dark:text-red-400 font-medium",
    };
  }

  return {
    container: "text-gray-700 dark:text-gray-300 font-medium",
    text: "text-gray-700 dark:text-gray-300 font-medium",
  };
};

/**
 * 시간 슬롯 스타일 가져오기
 */
export const getTimeSlotStyles = (
  isLunchTime: boolean,
  isBusinessTime: boolean
): string => {
  if (isLunchTime) {
    return "bg-yellow-50 dark:bg-yellow-900/10 border-l-2 border-yellow-300 dark:border-yellow-600";
  }

  if (isBusinessTime) {
    return "bg-green-50 dark:bg-green-900/5 border-l-2 border-green-200 dark:border-green-700";
  }

  return "bg-gray-50 dark:bg-gray-800/30";
};
