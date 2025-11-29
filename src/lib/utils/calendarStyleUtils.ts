/**
 * 캘린더 스타일 관련 유틸리티 함수
 */

export interface WeekHeaderStyles {
  container: string;
  day: string;
  date: string;
}

export interface DayHeaderStyles {
  container: string;
  weekdayText: string;
  dateText: string;
  monthText: string;
}

export interface MonthHeaderStyles {
  container: string;
  text: string;
}

/**
 * 주간 뷰 헤더 스타일
 */
export const getWeekHeaderStyles = (
  isToday: boolean,
  isWeekend: boolean,
  isOutsideProject?: boolean
): WeekHeaderStyles => {
  // 프로젝트 기간 밖
  if (isOutsideProject) {
    return {
      container: "bg-gray-100 dark:bg-gray-900/50",
      day: "text-gray-400 dark:text-gray-600",
      date: "text-gray-400 dark:text-gray-600 line-through",
    };
  }

  // 오늘
  if (isToday) {
    return {
      container: "bg-main-50 dark:bg-main-900/20",
      day: "text-main-600 dark:text-main-400 font-semibold",
      date: "text-main-600 dark:text-main-400 font-semibold",
    };
  }

  // 주말
  if (isWeekend) {
    return {
      container: "bg-red-50 dark:bg-red-900/10",
      day: "text-red-600 dark:text-red-400",
      date: "text-red-600 dark:text-red-400 font-medium",
    };
  }

  // 평일
  return {
    container: "bg-white dark:bg-gray-800",
    day: "text-gray-600 dark:text-gray-400",
    date: "text-gray-700 dark:text-gray-300 font-medium",
  };
};

/**
 * 일간 뷰 헤더 스타일
 */
export const getDayHeaderStyles = (
  isToday: boolean,
  isOutsideProject?: boolean
): DayHeaderStyles => {
  // 프로젝트 기간 밖
  if (isOutsideProject) {
    return {
      container: "bg-gray-100 dark:bg-gray-800/50",
      weekdayText: "text-gray-400 dark:text-gray-500 line-through",
      dateText: "text-gray-400 dark:text-gray-500 line-through",
      monthText: "text-gray-400 dark:text-gray-500",
    };
  }

  // 오늘
  if (isToday) {
    return {
      container: "bg-main-50 dark:bg-main-900/20",
      weekdayText: "text-main-600 dark:text-main-400 font-semibold",
      dateText: "text-main-600 dark:text-main-400 font-semibold",
      monthText: "text-main-500 dark:text-main-300",
    };
  }

  // 일반
  return {
    container: "bg-gray-50 dark:bg-gray-800/50",
    weekdayText: "text-gray-600 dark:text-gray-400",
    dateText: "text-gray-700 dark:text-gray-300 font-medium",
    monthText: "text-gray-500 dark:text-gray-400",
  };
};

/**
 * 월간 뷰 날짜 헤더 스타일
 */
export const getMonthDateHeaderStyles = (
  isToday: boolean,
  isWeekend: boolean,
  isOtherMonth: boolean,
  isOutsideProject?: boolean
): string => {
  if (isOutsideProject) {
    return "text-gray-400 dark:text-gray-600 line-through opacity-40";
  }

  if (isOtherMonth) {
    return "text-gray-400 dark:text-gray-500 opacity-50";
  }

  if (isToday) {
    return "text-main-600 dark:text-main-400 font-semibold";
  }

  if (isWeekend) {
    return "text-red-600 dark:text-red-400 font-medium";
  }

  return "text-gray-700 dark:text-gray-300";
};

/**
 * 월간 뷰 요일 헤더 스타일
 */
export const getMonthHeaderStyles = (dayIndex?: number): MonthHeaderStyles => {
  const isSaturday = dayIndex === 6;
  const isSunday = dayIndex === 0;

  if (isSaturday) {
    return {
      container: "text-blue-600 dark:text-blue-400",
      text: "text-blue-600 dark:text-blue-400",
    };
  }

  if (isSunday) {
    return {
      container: "text-red-600 dark:text-red-400",
      text: "text-red-600 dark:text-red-400",
    };
  }

  return {
    container: "text-gray-700 dark:text-gray-300",
    text: "text-gray-700 dark:text-gray-300",
  };
};

/**
 * 시간 슬롯 스타일
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
