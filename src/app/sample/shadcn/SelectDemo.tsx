import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/Select"

interface SelectDemoProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SelectDemo({ value, onValueChange }: SelectDemoProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger >
        <SelectValue placeholder="역할를 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="leader">leader</SelectItem>
          <SelectItem value="member">member</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
