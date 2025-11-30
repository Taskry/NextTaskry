"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "날짜를 선택하세요",
  label,
  icon = "calendar",
  error,
  disabled = false,
}: DatePickerProps) {
  const stringToLocalDate = (str: string) => {
    if (!str) return new Date();
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const [activeStartDate, setActiveStartDate] = useState<Date>(() =>
    value ? stringToLocalDate(value) : new Date()
  );
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  /** 📌 팝업 위치 계산 */
  const updateCalendarPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const popupWidth = 330;
    const popupHeight = 340;
    const gap = 14;

    let top = rect.bottom + gap;
    let left = rect.left;

    if (top + popupHeight > window.innerHeight)
      top = rect.top - popupHeight - gap;

    if (left + popupWidth > window.innerWidth)
      left = window.innerWidth - popupWidth - gap;

    if (left < 8) left = 8;

    setCalendarPos({ top, left });
  }, []);

  /** 📌 외부 클릭 감지 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** 📌 스크롤/리사이즈 시 닫기 */
  useEffect(() => {
    if (!showCalendar) return;

    const close = () => setShowCalendar(false);

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [showCalendar]);

  /** 📌 캘린더 토글 */
  const handleToggleCalendar = () => {
    if (disabled) return;
    if (!showCalendar) updateCalendarPosition();

    // 캘린더 열 때 적절한 월로 설정
    let startDate = value ? stringToLocalDate(value) : new Date();

    // minDate가 있고 현재 날짜가 minDate 이전이면 minDate 월로
    if (minDate) {
      const minDateObj = stringToLocalDate(minDate);
      if (startDate < minDateObj) {
        startDate = minDateObj;
      }
    }

    // maxDate가 있고 현재 날짜가 maxDate 이후면 maxDate 월로
    if (maxDate) {
      const maxDateObj = stringToLocalDate(maxDate);
      if (startDate > maxDateObj) {
        startDate = maxDateObj;
      }
    }

    setActiveStartDate(startDate);
    setWarningMessage(null); // 경고 메시지 초기화
    setShowCalendar((prev) => !prev);
  };

  /** 📌 날짜 선택 */
  const handleDateChange = (selected: any) => {
    if (!(selected instanceof Date)) return;

    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, "0");
    const d = String(selected.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;

    // 프로젝트 범위 체크 및 경고 메시지
    if (minDate && formatted < minDate) {
      setWarningMessage("프로젝트 시작일 이전의 날짜는 선택할 수 없습니다");
      setTimeout(() => setWarningMessage(null), 2500);
      return;
    }
    if (maxDate && formatted > maxDate) {
      setWarningMessage("프로젝트 종료일 이후의 날짜는 선택할 수 없습니다");
      setTimeout(() => setWarningMessage(null), 2500);
      return;
    }

    setWarningMessage(null);
    onChange(formatted);
    setShowCalendar(false);
  };

  /** 📌 표시 포맷 */
  const formatDisplayDate = (str: string) => {
    if (!str) return "";
    return stringToLocalDate(str).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      {/* 입력창 */}
      <div className="relative" ref={triggerRef}>
        <div
          onClick={handleToggleCalendar}
          className={`
            w-full h-10 px-3 pr-10 border rounded-lg flex items-center text-sm cursor-pointer
            bg-white dark:bg-gray-700 input-focus-style
            ${
              error
                ? "border-red-500"
                : showCalendar
                ? "border-main-400 ring-2 ring-main-400/20"
                : "border-gray-300 dark:border-gray-600"
            }
            hover:border-gray-400 dark:hover:border-gray-500
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-1 pl-1">* {error}</p>}

      {/* 캘린더 팝업 (Portal) */}
      {showCalendar &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="calendar-portal"
            style={{
              top: calendarPos.top,
              left: calendarPos.left,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Calendar
              value={value ? stringToLocalDate(value) : new Date()}
              onChange={handleDateChange}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate: newDate }) => {
                if (!newDate) return;
                setActiveStartDate(newDate);
              }}
              tileDisabled={({ date }) => {
                if (minDate && date < stringToLocalDate(minDate)) return true;
                if (maxDate && date > stringToLocalDate(maxDate)) return true;
                return false;
              }}
              locale="ko-KR"
              calendarType="gregory"
              className="react-calendar-custom"
            />

            {/* 경고 메시지 */}
            {warningMessage && (
              <div className="mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium text-center">
                  ⚠️ {warningMessage}
                </p>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
