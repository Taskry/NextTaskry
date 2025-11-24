import { Label } from "@/components/ui/shadcn/Label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/shadcn/RadioGroup"

export function SortRadioGroup() {
  return (
    <RadioGroup defaultValue="startedAt" className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <RadioGroupItem value="asc" id="r1" />
        <Label htmlFor="r1">오름차순</Label>
      </div>
      <div className="flex items-center gap-1">
        <RadioGroupItem value="desc" id="r2" />
        <Label htmlFor="r2">내림차순</Label>
      </div>
    </RadioGroup>
  )
}