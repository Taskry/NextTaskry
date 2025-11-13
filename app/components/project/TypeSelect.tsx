import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TypeSelect({ value, onValueChange }: TypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="프로젝트 분류를 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="개발">개발</SelectItem>
          <SelectItem value="기획">기획</SelectItem>
          <SelectItem value="디자인">디자인</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
