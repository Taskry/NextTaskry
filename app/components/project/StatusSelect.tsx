import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StatusSelect({ value, onValueChange }: StatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="프로젝트 상태를 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="계획중">계획중</SelectItem>
          <SelectItem value="진행중">진행중</SelectItem>
          <SelectItem value="완료">완료</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
