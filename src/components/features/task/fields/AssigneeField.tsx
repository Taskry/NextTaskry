"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { MOCK_TEAM_MEMBERS } from "@/lib/constants/assignees";

interface AssigneeFieldProps {
  value: string | null | undefined;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  // 편집 모드 props (TaskDetail용)
  isEditing?: boolean;
  onEdit?: () => void;
  onBlur?: () => void;
  onCancel?: () => void;
}

/**
 * 담당자 입력/선택 컴포넌트
 * - 검색 필터링 및 드롭다운 선택
 * - 보기/편집 모드 전환 (선택적)
 * - Enter/Escape 키 처리
 *
 * 사용 사례:
 * 1. TaskAdd: 기본 모드 (항상 입력 가능)
 * 2. TaskDetail: 편집 모드 (보기/편집 토글)
 */
export function AssigneeField({
  value,
  disabled = false,
  onChange,
  placeholder = "담당자 이름을 입력하세요",
  isEditing = false,
  onEdit,
  onBlur,
  onCancel,
}: AssigneeFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filteredMembers = MOCK_TEAM_MEMBERS.filter((name) =>
    name.toLowerCase().includes(value?.toLowerCase() || "")
  );

  const handleSelectMember = (name: string) => {
    onChange(name);
    setIsOpen(false);
    onBlur?.();
  };

  // 편집 모드 렌더링 (TaskDetail용)
  if (isEditing !== undefined && isEditing !== true && onEdit) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="userCircle" size={16} color="#6B7280" />
          담당자
        </h3>
        {value ? (
          <div
            onClick={onEdit}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
              <span className="text-sm font-medium text-main-600">
                {value.charAt(0)}
              </span>
            </div>
            <span className="text-gray-700">{value}</span>
          </div>
        ) : (
          <p
            onClick={onEdit}
            className="text-gray-400 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            클릭하여 담당자 추가
          </p>
        )}
      </div>
    );
  }

  // 입력 모드 렌더링 (편집 중 또는 TaskAdd용)
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
        <Icon type="userCircle" size={16} color="#6B7280" />
        담당자
      </h3>
      <div className="space-y-2">
        <div className="relative">
          <Icon
            type="search"
            size={18}
            color="#9CA3AF"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e: any) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setIsOpen(false);
              onBlur?.();
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                onBlur?.();
              }
              if (e.key === "Escape") {
                onCancel?.();
                setIsOpen(false);
              }
            }}
            autoFocus={isEditing}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-300 focus:outline-none"
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        {isOpen && value && filteredMembers.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            {filteredMembers.map((name) => (
              <div
                key={name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectMember(name);
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-main-600">
                    {name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
