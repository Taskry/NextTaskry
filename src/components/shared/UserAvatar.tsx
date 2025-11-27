"use client";

import { useState } from "react";
import Image from "next/image";

interface UserAvatarProps {
  /** 사용자 이름 */
  userName: string;
  /** 프로필 이미지 URL */
  profileImage?: string | null;
  /** 아바타 크기 (픽셀) */
  size?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 이미지 로딩 실패 시 콜백 */
  onImageError?: () => void;
}

/**
 * UserAvatar - 사용자 프로필 이미지 또는 이니셜을 표시하는 공통 컴포넌트
 *
 * 기능:
 * - 프로필 이미지가 있으면 이미지 표시
 * - 이미지가 없거나 로딩 실패 시 이름의 첫 글자로 대체
 * - 다크모드 지원
 * - 커스터마이징 가능한 크기
 */
export function UserAvatar({
  userName,
  profileImage,
  size = 32,
  className = "",
  onImageError,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const isValidImageUrl = (url?: string | null) => {
    if (!url) return false;
    // default-user, placeholder 등의 더미 이미지 필터링
    if (url.includes("default-user") || url.includes("placeholder"))
      return false;
    return true;
  };

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const getInitial = () => {
    return userName?.charAt(0)?.toUpperCase() || "?";
  };

  // 크기에 따른 폰트 크기 계산
  const getFontSize = () => {
    if (size <= 24) return "text-xs";
    if (size <= 32) return "text-sm";
    if (size <= 48) return "text-base";
    return "text-lg";
  };

  const avatarClasses = [
    `w-${Math.ceil(size / 4)} h-${Math.ceil(size / 4)}`, // Tailwind 사이즈
    "rounded-full",
    "bg-main-200 dark:bg-main-700",
    "flex items-center justify-center",
    "overflow-hidden",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={avatarClasses}
      style={{ width: size, height: size }} // 정확한 크기를 위한 인라인 스타일
    >
      {isValidImageUrl(profileImage) && !imageError ? (
        <Image
          src={profileImage!}
          alt={userName}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span
          className={`font-medium text-main-600 dark:text-main-300 ${getFontSize()}`}
        >
          {getInitial()}
        </span>
      )}
    </div>
  );
}

// 편의를 위한 사이즈별 프리셋 컴포넌트들
export function UserAvatarSmall(props: Omit<UserAvatarProps, "size">) {
  return <UserAvatar {...props} size={24} />;
}

export function UserAvatarMedium(props: Omit<UserAvatarProps, "size">) {
  return <UserAvatar {...props} size={32} />;
}

export function UserAvatarLarge(props: Omit<UserAvatarProps, "size">) {
  return <UserAvatar {...props} size={48} />;
}
