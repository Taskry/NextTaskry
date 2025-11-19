"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import Button from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import { Label } from "@/components/ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { format } from "date-fns"

interface Calendar22Props {
  value?: Date; // 외부에서 주입될 날짜 값
  onValueChange?: (date: Date | undefined) => void; // 외부로 날짜 변경을 알릴 함수
  placeholder?: string; // 플레이스홀더 텍스트
}

export function Calendar22({
  value,
  onValueChange,
  placeholder = "Select Date"
}: Calendar22Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const handleSelectDate = (selectedDate: Date | undefined) => {
    // 외부로 변경 사항을 알립니다.
    if (onValueChange) {
      onValueChange(selectedDate);
    }
    // Popover를 닫습니다.
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal"
          >
            {value ? format(value, "yyyy년 MM월 dd일") : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value} // 외부에서 받은 value를 Calendar의 selected 프롭에 전달
            captionLayout="dropdown"
            onSelect={handleSelectDate} // 수정된 핸들러 사용
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
