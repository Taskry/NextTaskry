"use client";

import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/toast";
import { useSession } from "next-auth/react";
import { Invitation } from "@/types/invite";

export default function InviteDecisionModal({ invite } : {invite : Invitation}) {
  const router = useRouter();
  const { data: session } = useSession();

  //현재 로그인된 유저 ID
  const userId = session?.user?.user_id;

  if (!userId) return null; // 로그인 안 됐으면 아무것도 렌더링 안 함

 
  // 참여하기
  const handleAccept = async () => {
    try {
      const { project_id, invitation_id, project_role } = invite;

      // 1) 초대 상태 accepted로 변경
      const { error: updateError } = await supabase
        .from("project_invitations")
        .update({
          status: "accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_id", invitation_id);

      if (updateError) {
        console.error("초대 수락 업데이트 실패:", updateError);
        showToast("초대 수락 중 오류가 발생했습니다.", "error");
        return;
      }

      // 2) 프로젝트 멤버 추가
      const { error: insertError } = await supabase
        .from("project_members")
        .insert({
          project_id,
          user_id: userId,
          role:project_role,
          joined_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("멤버 추가 실패:", insertError);
        showToast("프로젝트 멤버 추가 실패", "error");
        return;
      }

      // 3) invite_id 삭제
      localStorage.removeItem("invite_id");

      // 4) 성공 메시지 후 해당 프로젝트로 이동
      showToast("프로젝트에 참여했습니다!", "success");
      router.push(`/project/${project_id}`);
    } catch (err) {
      console.error("초대 수락 처리 오류:", err);
      showToast("처리 중 오류가 발생했습니다.", "error");
    }
  };

  // 거절하기
  const handleReject = async () => {
    try {
      const { invitation_id } = invite;

      const { error } = await supabase
        .from("project_invitations")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_id", invitation_id);

      if (error) {
        console.error("거절 업데이트 실패:", error);
        showToast("처리 중 오류 발생", "error");
        return;
      }

      // invite 제거
      localStorage.removeItem("invite_id");

      showToast("초대를 거절했습니다.", "alert");

      // 현재 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error("초대 거절 처리 오류:", err);
      showToast("처리 중 오류가 발생했습니다.", "error");
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[380px]">
        <h2 className="text-lg font-semibold mb-3">
          프로젝트 초대가 도착했습니다
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          이 프로젝트에 참여하시겠습니까?
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded-md"
            onClick={handleReject}
          >
            거절하기
          </button>

          <button
            className="px-4 py-2 bg-main-500 text-white rounded-md"
            onClick={handleAccept}
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
