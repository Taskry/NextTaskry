import React from "react";
import { Icon } from "@/components/shared/Icon";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  className?: string;
}

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  size = 18,
  className = "",
}: CheckboxProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`flex items-center gap-2 cursor-pointer select-none 
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {checked ? (
          <Icon type="squareCheckFilled" size={size} />
        ) : (
          <Icon type="squareCheck" size={size} />
        )}

        {label && <span className="text-sm">{label}</span>}
      </label>
    </div>
  );
}
