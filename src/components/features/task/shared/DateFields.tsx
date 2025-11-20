// 작업의 시작일과 마감일을 선택하는 컴포넌트
import DatePicker from "@/components/ui/DatePicker";

export function DateFields({
  startDate,
  endDate,
  error,
  disabled,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  error?: string;
  disabled?: boolean;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        label="시작일"
        icon="calendarPlus"
        value={startDate}
        onChange={onStartDateChange}
        disabled={disabled}
      />

      <DatePicker
        label="마감일"
        icon="calendarCheck"
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate}
        error={error}
        disabled={disabled}
      />
    </div>
  );
}
