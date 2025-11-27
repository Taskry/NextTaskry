"use client";

import { Icon } from "@/components/shared/Icon";
import { ReactNode } from "react";

interface EmptyStateProps {
  /** 아이콘 타입 */
  icon?: string;
  /** 아이콘 크기 */
  iconSize?: number;
  /** 메인 제목 */
  title: string;
  /** 부제목/설명 */
  description?: string;
  /** 추가 정보 텍스트 */
  info?: string;
  /** 커스텀 액션 버튼이나 요소 */
  action?: ReactNode;
  /** 레이아웃 스타일 */
  variant?: "default" | "dashed" | "minimal";
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * EmptyState - 빈 상태를 표시하는 공통 컴포넌트
 *
 * 사용 예시:
 * - 프로젝트 멤버가 없을 때
 * - 검색 결과가 없을 때
 * - 데이터가 로딩되지 않았을 때
 */
export function EmptyState({
  icon = "inbox",
  iconSize = 24,
  title,
  description,
  info,
  action,
  variant = "default",
  className = "",
}: EmptyStateProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "dashed":
        return "p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800";
      case "minimal":
        return "p-2";
      default:
        return "p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className={`text-center ${getVariantStyles()} ${className}`}>
      {/* 아이콘 */}
      <Icon
        type={icon}
        size={iconSize}
        className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
      />

      {/* 메인 제목 */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>

      {/* 부제목 */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {description}
        </p>
      )}

      {/* 추가 정보 */}
      {info && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{info}</p>
      )}

      {/* 액션 */}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

// 편의를 위한 프리셋 컴포넌트들
export function NoMembersState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon="userPlus"
      title="아직 팀원이 없어요"
      info="관리자에게 팀원 초대를 요청해보세요"
      variant="dashed"
      {...props}
    />
  );
}

export function NoResultsState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon="search"
      title="검색 결과가 없습니다"
      variant="minimal"
      {...props}
    />
  );
}

export function LoadingState(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon="loading"
      title="불러오는 중..."
      variant="minimal"
      {...props}
    />
  );
}
