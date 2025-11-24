import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/Select"

interface ViewSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ViewSelect({ value, onValueChange }: ViewSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="View 타입을 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="personal">개인 프로젝트</SelectItem>
          <SelectItem value="all">전체 프로젝트</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
