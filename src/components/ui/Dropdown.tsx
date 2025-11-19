"use client";

import { Icon } from "@/components/shared/Icon";
import { primaryBorderColor, primaryBgColor } from "@/app/sample/color/page";
import { useState } from "react";

type DropdownType = "view" | "theme";

interface ToggleProps {
  type: DropdownType;
  currentValue: string;
  onChange?: (value: string) => void;
}

export default function DropdownToggle({
  type,
  currentValue,
  onChange,
}: ToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const openList = () => {
    setIsOpen(!isOpen);
  };
  const listItemActive = () => {
    setIsActive(() => !isActive);
  };

  const render = () => {
    if (type === "view") {
      return (
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${primaryBorderColor.Color2[0]}`}
          onClick={openList}
        >
          <Icon type="board" size={24}></Icon>
          <Icon type="arrowDown" size={18} />
        </button>
      );
    }
    if (type === "theme") {
      return (
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${primaryBorderColor.Color2[0]}`}
          onClick={openList}
        >
          <Icon type="sun" size={24}></Icon>
        </button>
      );
    }
    return [];
  };
  const options = () => {
    if (type === "view") {
      return [
        {
          value: "board",
          label: "Board",
          icon: <Icon type="board" size={24} />,
        },
        {
          value: "calendar",
          label: "Calendar",
          icon: <Icon type="calendar" />,
        },
      ];
    }
    if (type === "theme") {
      return [
        { value: "light", label: "Light Mode", icon: <Icon type="sun" /> },
        { value: "dark", label: "Dark Mode", icon: <Icon type="moon" /> },
        {
          value: "settings",
          label: "System 설정값",
          icon: <Icon type="settings" />,
        },
      ];
    }
  };
  const getOptions = options();

  return (
    <div className="relative">
      {render()}

      {isOpen && (
        <ul
          role="menu"
          className={`border rounded-sm py-3 w-40 absolute top-12 bg-white ${primaryBorderColor.Color2[0]}`}
        >
          {getOptions?.map((option) => {
            const isSelected = option.value === currentValue;

            return (
              <li
                key={option.value}
                role="menuitem"
                className="hover:bg-gray-100"
                onClick={() => listItemActive()}
              >
                <button
                  className={`flex items-center gap-3 py-3 px-3 w-full ${
                    isSelected ? `${primaryBgColor.Color2[0]}` : ""
                  }`}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.icon}
                  <span className="font-medium tracking-tight">
                    {option.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
