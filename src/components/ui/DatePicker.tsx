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
  placeholder = "날짜를 선택하세요",
  label,
  icon = "calendar",
  error,
  disabled = false,
}: DatePickerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
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

  // 날짜 선택 핸들러
  const handleDateChange = (selectedValue: any) => {
    if (selectedValue instanceof Date) {
      const year = selectedValue.getFullYear();
      const month = String(selectedValue.getMonth() + 1).padStart(2, "0");
      const day = String(selectedValue.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

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

  // 문자열을 로컬 Date 객체로 변환
  const stringToLocalDate = (dateString: string) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* 라벨 */}
      {label && (
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <Icon
            type={icon}
            size={16}
            className="text-gray-600 dark:text-gray-400"
          />
          {label}
        </h3>
      )}

      {/* 날짜 선택 Input */}
      <div
        onClick={() => {
          if (!disabled) {
            setShowCalendar(!showCalendar);
          }
        }}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors 
          flex items-center justify-between
          bg-white dark:bg-gray-700
          ${
            !disabled
              ? "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
              : "cursor-not-allowed opacity-50"
          }
          ${
            error
              ? "border-red-500 dark:border-red-600 hover:border-red-600 dark:hover:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
      >
        <span
          className={
            value
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500"
          }
        >
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Icon
          type="calendar"
          size={16}
          className="text-gray-400 dark:text-gray-500"
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
        <div className="absolute top-full left-0 mt-2 z-30 shadow-xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Calendar
            onChange={handleDateChange}
            value={value ? stringToLocalDate(value) : new Date()}
            minDate={minDate ? stringToLocalDate(minDate) : undefined}
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
