// app/components/DatePicker/DatePicker.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Icon } from "@/components/shared/Icon";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  label?: string;
  icon?: "calendarPlus" | "calendarCheck" | "calendar";
  error?: string;
  disabled?: boolean;
}

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "날짜를 선택하세요",
  label,
  icon = "calendar",
  error,
  disabled = false,
}: DatePickerProps) => {
  // 문자열을 로컬 Date 객체로 변환
  const stringToLocalDate = (dateString: string) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
    // 선택된 값이 있으면 해당 날짜
    if (value) return stringToLocalDate(value);

    // 프로젝트 기간 제한이 있는 경우
    if (minDate && maxDate) {
      return stringToLocalDate(minDate); // 프로젝트 시작 월로 설정
    }

    // minDate만 있는 경우
    if (minDate) return stringToLocalDate(minDate);

    // maxDate만 있는 경우
    if (maxDate) return stringToLocalDate(maxDate);

    // 제한이 없는 경우 현재 날짜
    return new Date();
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  // 캘린더 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 캘린더를 열 때 적절한 activeStartDate 설정
  // activeStartDate : 캘린더가 표시하는 현재 월의 첫 날짜
  const getActiveStartDate = () => {
    if (value) return stringToLocalDate(value);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    // 프로젝트 기간이 설정된 경우
    if (minDate && maxDate) {
      // 1️⃣ 시작 전 (오늘 < 시작일): 프로젝트 시작 월
      if (todayStr < minDate) {
        return stringToLocalDate(minDate);
      }

      // 2️⃣ 진행 중 (시작일 ≤ 오늘 ≤ 종료일): 오늘 월
      if (todayStr >= minDate && todayStr <= maxDate) {
        return today;
      }

      // 3️⃣ 종료 후 (오늘 > 종료일): 프로젝트 종료 월
      if (todayStr > maxDate) {
        return stringToLocalDate(maxDate);
      }
    }

    // minDate만 있는 경우
    if (minDate) {
      return todayStr >= minDate ? today : stringToLocalDate(minDate);
    }

    // maxDate만 있는 경우
    if (maxDate) {
      return todayStr <= maxDate ? today : stringToLocalDate(maxDate);
    }

    return today;
  };

  // 날짜 선택 핸들러
  const handleDateChange = (selectedValue: any) => {
    if (selectedValue instanceof Date) {
      const year = selectedValue.getFullYear();
      const month = String(selectedValue.getMonth() + 1).padStart(2, "0");
      const day = String(selectedValue.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // 문자열로 비교 (YYYY-MM-DD 형식)
      if (minDate && formattedDate < minDate) {
        console.warn("최소 날짜보다 이전입니다.");
        return;
      }

      if (maxDate && formattedDate > maxDate) {
        console.warn("최대 날짜보다 이후입니다.");
        return;
      }

      onChange(formattedDate);
      setShowCalendar(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = stringToLocalDate(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* 라벨 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      {/* 날짜 선택 Input */}
      <div className="relative">
        <div
          onClick={() => {
            if (!disabled) {
              if (!showCalendar) {
                // 캘린더를 열 때 적절한 월로 설정
                setActiveStartDate(getActiveStartDate());
              }
              setShowCalendar(!showCalendar);
            }
          }}
          className={`
            w-full h-10 px-3 pr-10 border rounded-lg transition-all 
            flex items-center
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            text-sm
            ${
              !disabled
                ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-main-300 dark:focus:ring-main-500 focus:border-main-500"
                : "cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
            }
            ${
              error
                ? "border-red-500 dark:border-red-600 hover:border-red-600 dark:hover:border-red-500"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
          `}
        >
          <span
            className={
              value
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>
        <Icon
          type={icon}
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1 text-left pl-3">
          * {error}
        </p>
      )}

      {/* 캘린더 */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 z-30">
          <Calendar
            onChange={handleDateChange}
            value={value ? stringToLocalDate(value) : new Date()}
            minDate={minDate ? stringToLocalDate(minDate) : undefined}
            maxDate={maxDate ? stringToLocalDate(maxDate) : undefined}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({
              activeStartDate: newActiveStartDate,
            }) => {
              if (!newActiveStartDate) return;

              // 프로젝트 기간 제한이 있는 경우 월 네비게이션 제한
              if (minDate || maxDate) {
                const minDateObj = minDate ? stringToLocalDate(minDate) : null;
                const maxDateObj = maxDate ? stringToLocalDate(maxDate) : null;

                // 최소 날짜의 월보다 이전으로 가는 것 방지
                if (minDateObj) {
                  const minMonth = new Date(
                    minDateObj.getFullYear(),
                    minDateObj.getMonth(),
                    1
                  );
                  if (newActiveStartDate < minMonth) {
                    setActiveStartDate(minMonth);
                    return;
                  }
                }

                // 최대 날짜의 월보다 이후로 가는 것 방지
                if (maxDateObj) {
                  const maxMonth = new Date(
                    maxDateObj.getFullYear(),
                    maxDateObj.getMonth(),
                    1
                  );
                  if (newActiveStartDate > maxMonth) {
                    setActiveStartDate(maxMonth);
                    return;
                  }
                }
              }

              setActiveStartDate(newActiveStartDate);
            }}
            tileDisabled={({ date }) => {
              if (minDate) {
                const min = stringToLocalDate(minDate);
                if (date < min) return true;
              }
              if (maxDate) {
                const max = stringToLocalDate(maxDate);
                if (date > max) return true;
              }
              return false;
            }}
            locale="ko-KR"
            calendarType="gregory"
            className="react-calendar-custom"
          />
        </div>
      )}
    </div>
  );
};
export default DatePicker;
