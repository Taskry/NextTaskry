"use client";

import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/shared/UserAvatar";

/**
 * AssigneeInfo: 프로젝트 담당자 정보를 표시하는 컴포넌트
 * @param userId - 담당자 user_id
 * @param projectId - 프로젝트 id
 */

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

  useEffect(() => {
    /**
     * 프로젝트 멤버 중 userId에 해당하는 사용자 정보 fetch
     */
    const fetchUserInfo = async () => {
      // projectId 또는 userId가 유효하지 않으면 API 호출 방지
      if (
        !projectId ||
        projectId === "undefined" ||
        !userId ||
        userId === "undefined"
      ) {
        setUserInfo(null);
        setIsLoading(false);
        return;
      }

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
      } catch {
        // 네트워크/파싱 에러 처리
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, [userId, projectId]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <UserAvatar
          userName="로딩"
          profileImage={null}
          size={24}
          className="animate-pulse"
        />
        <span className="text-xs text-gray-400">불러오는 중...</span>
      </div>
    );
  }

  // 담당자 정보 없음
  if (!userInfo) {
    return (
      <div className="flex items-center gap-2">
        <UserAvatar userName="?" profileImage={null} size={24} />
        <span className="text-xs text-gray-400 dark:text-gray-400">
          담당자 없음
        </span>
      </div>
    );
  }

  // 담당자 정보 표시
  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        userName={userInfo.user_name}
        profileImage={userInfo.profile_image}
        size={24}
      />
      <span className="text-xs text-gray-600 dark:text-gray-400">
        {userInfo.user_name}
      </span>
    </div>
  );
};

export default AssigneeInfo;
