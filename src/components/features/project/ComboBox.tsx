"use client"

import { useState } from "react"
import {Button} from "@/components/ui/shadcn/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/shadcn/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/Popover"


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
  onChange?: (item: Item | null) => void 
  placeholder?: string
}

export function ComboBox({ 
  items, 
  value, 
  setValue,
  onChange,
  placeholder = "추가하고 싶은 팀원을 선택해주세요." 
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
         <Button variant="outline" className="w-full justify-start px-3 text-left font-normal">
          <span className="truncate w-full">
            {value ? value.label : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <ItemList 
          setOpen={setOpen} 
          setValue={setValue} 
          onChange={onChange}
          items={items}
        />
      </PopoverContent>
    </Popover>
  )
}

// 내부 컴포넌트 Props 정의
interface ItemListProps {
  setOpen: (open: boolean) => void
  setValue: (item: Item | null) => void
  onChange?: (item: Item | null) => void
  items: Item[]
}

function ItemList({
  setOpen,
  setValue,
  onChange,
  items,
}: ItemListProps) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList >
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.id}
              value={item.value}
              onSelect={() => {
                 setValue(item)
                
                if (onChange) {
                  onChange(item)
                }
                setOpen(false)
              }}
            >
              <span className="truncate w-full text-left block">
                {item.label}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}