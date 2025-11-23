"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AssigneeInfoProps {
  userId: string;
  projectId: string;
}

interface UserInfo {
  user_id: string;
  user_name: string;
  email: string;
  profile_image?: string;
  role: string;
}

const AssigneeInfo = ({ userId, projectId }: AssigneeInfoProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${projectId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user info");

        const result = await response.json();
        const member = result.data?.find((m: any) => m.user_id === userId);

        if (member) {
          setUserInfo({
            user_id: member.user_id,
            user_name: member.users.user_name,
            email: member.users.email,
            profile_image: member.users.profile_image,
            role: member.role,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, projectId]);

  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    if (url.includes("default-user") || url.includes("placeholder"))
      return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
        <span className="text-xs text-gray-400">불러오는 중...</span>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-400">?</span>
        </div>
        <span className="text-xs text-gray-400">담당자 없음</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-main-200 dark:bg-main-700 flex items-center justify-center overflow-hidden">
        {isValidImageUrl(userInfo.profile_image) && !imageError ? (
          <Image
            src={userInfo.profile_image!}
            alt={userInfo.user_name}
            width={24}
            height={24}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-xs font-medium text-main-600 dark:text-main-300">
            {userInfo.user_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {userInfo.user_name}
      </span>
    </div>
  );
};

export default AssigneeInfo;
