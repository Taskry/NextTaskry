import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shedcn/Select"

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
          <SelectItem value="active">active</SelectItem>
          <SelectItem value="completed">completed</SelectItem>
          <SelectItem value="archived">archived</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
