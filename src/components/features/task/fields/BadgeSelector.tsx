"use client";

import { useState, useRef, useEffect } from "react";
import Badge, { badgeConfigs } from "@/components/ui/Badge";

interface BadgeSelectorProps<T extends string> {
  value: T;
  options: { value: T; badgeType: keyof typeof badgeConfigs }[];
  onChange: (value: T) => void;
}

export default function BadgeSelector<T extends string>({
  value,
  options,
  onChange,
}: BadgeSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const current = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="flex items-center gap-2 flex-nowrap">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          relative transition-all duration-200 cursor-pointer
          hover:scale-105 active:scale-95 
          ${
            isOpen
              ? "ring-2 ring-main-300 dark:ring-main-500 ring-offset-1 rounded-sm"
              : ""
          }
        `}
      >
        {current && <Badge type={current.badgeType} />}
      </button>

      {isOpen && (
        <div className="flex items-center gap-1.5 animate-fadeIn flex-nowrap bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-sm">
          {options
            .filter((opt) => opt.value !== value)
            .map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="hover:scale-105 active:scale-95 transition-all duration-200 opacity-70 hover:opacity-100"
              >
                <Badge type={opt.badgeType} />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
