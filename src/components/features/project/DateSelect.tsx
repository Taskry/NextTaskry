import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/Select"

interface DateSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function DateSelect({ value, onValueChange }: DateSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="정렬 기준을 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="startedAt">시작일</SelectItem>
          <SelectItem value="endedAt">마감일</SelectItem>
          <SelectItem value="createdAt">생성일</SelectItem>
          <SelectItem value="updatedAt">최종 수정일</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}