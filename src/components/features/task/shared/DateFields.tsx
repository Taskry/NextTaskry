// components/features/task/shared/DateFields.tsx
import { Clock } from "lucide-react";
import DatePicker from "@/components/ui/DatePicker";
import { useState, useRef, useEffect } from "react";

export function DateFields({
  startDate,
  endDate,
  startTime,
  endTime,
  projectStartedAt,
  projectEndedAt,
  useTime = false,
  error,
  disabled,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onUseTimeChange,
}: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  useTime: boolean;
  projectStartedAt?: string;
  projectEndedAt?: string;
  error?: string;
  disabled?: boolean;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onStartTimeChange: (v: string) => void;
  onEndTimeChange: (v: string) => void;
  onUseTimeChange: (v: boolean) => void;
}) {
  // 프로젝트 상태에 따른 비활성화 여부 결정
  const isProjectEnded = (() => {
    if (!projectEndedAt) return false;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
    return today > projectEndedAt;
  })();

  // 3️⃣ 종료 후 상태에서는 일정 추가 불가 (읽기 전용)
  const isReadOnly = isProjectEnded;
  const finalDisabled = disabled || isReadOnly;

  return (
    <div className="space-y-4">
      {/* 날짜 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="시작일"
          icon="calendarPlus"
          value={startDate}
          onChange={onStartDateChange}
          minDate={projectStartedAt}
          maxDate={endDate || projectEndedAt}
          disabled={finalDisabled}
        />

        <DatePicker
          label="마감일"
          icon="calendarCheck"
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate || projectStartedAt}
          maxDate={projectEndedAt}
          error={error}
          disabled={finalDisabled}
        />
      </div>

      {/* 프로젝트 종료 후 읽기전용 안내 */}
      {isReadOnly && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
            ⚠️ 프로젝트가 종료되어 일정을 추가할 수 없습니다 (읽기 전용)
          </p>
        </div>
      )}

      {/* 시간 지정 토글 */}
      <label
        className={`flex items-center gap-2 text-sm select-none ${
          finalDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={useTime}
          onChange={(e) => onUseTimeChange(e.target.checked)}
          disabled={finalDisabled}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 
            text-main-600 focus:ring-main-500 dark:bg-gray-700
            disabled:cursor-not-allowed"
        />
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          시간 지정
        </span>
      </label>

      {/* 시간 입력 */}
      {useTime && (
        <div className="grid grid-cols-2 gap-4">
          <TimePicker
            label="시작 시간"
            value={startTime}
            onChange={onStartTimeChange}
            disabled={finalDisabled}
          />
          <TimePicker
            label="종료 시간"
            value={endTime}
            onChange={onEndTimeChange}
            disabled={finalDisabled}
          />
        </div>
      )}
    </div>
  );
}

function TimePicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 15 }, (_, i) =>
    (i + 9).toString().padStart(2, "0")
  ); // 09:00 ~ 23:00
  const minutes = ["00", "15", "30", "45"]; // 15분 간격

  const [hour, minute] = value ? value.split(":") : ["09", "00"];

  // value가 변경되면 inputValue도 동기화
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const handleTimeChange = (newHour: string, newMinute: string) => {
    const newTime = `${newHour}:${newMinute}`;
    setInputValue(newTime);
    onChange(newTime);
  };

  // 직접 입력 처리 (자동 포맷팅 포함)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9:]/g, ""); // 숫자와 콜론만 허용

    // 자동으로 콜론 추가 (4자리 입력 시)
    if (val.length === 4 && !val.includes(":")) {
      val = val.slice(0, 2) + ":" + val.slice(2);
    }

    setInputValue(val);

    // HH:MM 포맷 검증
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (timeRegex.test(val)) {
      onChange(val);
    }
  };

  // 입력 필드에서 포커스 아웃될 때 포맷 보정
  const handleBlur = () => {
    if (inputValue && !inputValue.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)) {
      // 잘못된 포맷이면 이전 값으로 복원
      setInputValue(value);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>

      {/* 직접 입력 필드 */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "Enter") {
              e.preventDefault();
              setIsFocused(true);
            } else if (e.key === "Escape") {
              setIsFocused(false);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="09:00"
          disabled={disabled}
          className={`
            w-full h-10 pl-3 pr-10
            border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-main-300 dark:focus:ring-main-500 
            focus:border-main-500
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
            text-sm transition-all
          `}
        />
        <Clock
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 
          text-gray-400 dark:text-gray-500 pointer-events-none"
        />
      </div>

      {/* 빠른 선택 패널 (포커스 시 표시) */}
      {isFocused && !disabled && (
        <div
          className="absolute z-50 mt-1 w-full
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg shadow-lg p-3"
          onMouseDown={(e) => e.preventDefault()} // 포커스 유지 위해 기본 동작 방지
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
            시간 선택
          </div>
          <div className="flex gap-2">
            {/* 시간 선택 */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                시
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={() => handleTimeChange(h, minute)}
                    className={`px-2 py-1.5 text-sm cursor-pointer text-center
                      ${
                        hour === h
                          ? "bg-main-50 dark:bg-main-900/30 text-main-600 dark:text-main-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* 분 선택 */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                분
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded">
                {minutes.map((m) => (
                  <div
                    key={m}
                    onClick={() => handleTimeChange(hour, m)}
                    className={`px-2 py-1.5 text-sm cursor-pointer text-center
                      ${
                        minute === m
                          ? "bg-main-50 dark:bg-main-900/30 text-main-600 dark:text-main-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
