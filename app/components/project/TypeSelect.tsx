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
          <SelectItem value="팀 프로젝트">팀 프로젝트</SelectItem>
          <SelectItem value="상용 프로젝트">상용 프로젝트</SelectItem>
          <SelectItem value="학습 프로젝트">학습 프로젝트</SelectItem>
          <SelectItem value="개인 프로젝트">개인 프로젝트</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
