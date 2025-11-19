"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"


export type Item = {
  id: string;
  value: string;
  label: string;
  email: string;
}

interface ComboBoxProps {
  items: Item[]
  value: Item | null
  setValue: (item: Item | null) => void
  placeholder?: string
}

export function ComboBox({ 
  items, 
  value, 
  setValue,
  placeholder = "+ Select Data" 
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {value ? <>{value.label}</> : <>{placeholder}</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <StatusList 
          setOpen={setOpen} 
          setValue={setValue} 
          items={items}
        />
      </PopoverContent>
    </Popover>
  )
}

// 내부 컴포넌트 Props 정의
interface StatusListProps {
  setOpen: (open: boolean) => void
  setValue: (item: Item | null) => void
  items: Item[]
}

function StatusList({
  setOpen,
  setValue,
  items,
}: StatusListProps) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(value) => {
                setValue(
                  items.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}