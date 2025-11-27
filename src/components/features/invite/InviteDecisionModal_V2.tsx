"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase/supabase";
import { showToast } from "@/lib/utils/toast";
import { Invitation } from "@/types/invite";  // 새로 만든 타입
import { useEffect, useRef } from "react";

export default function InviteDecisionModal_V2({ invite, onCloseModal }: { invite: Invitation ,onCloseModal:()=>void}) {

  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.user_id;

  const {
    invitation_id,
    invitation_type,
    project_id,   //service Only 일때는 null
    project_role, //service Only 일때는 null
  } = invite;


  const hasHandledRef = useRef(false);
  // 일반초대 수락과정
  async function handleServiceOnlyAccept() {
    try {
      // 1) 초대 accepted 처리
      await supabase
        .from("project_invitation_new")
        .update({
          status: "accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_id", invitation_id);

      // 2) invite_id 제거
      localStorage.removeItem("invite_id");

      showToast("서비스 초대가 완료되었습니다!", "success");
      
      onCloseModal(); //모달 닫기
      // 3) 프로젝트목록으로 이동
      router.push("/");
    } catch (err) {
      console.error("service_only 처리 오류:", err);
      showToast("초대 처리 중 오류가 발생했습니다.", "error");
    }
  }



  //service_only 초대는 모달을 띄우지 않고 자동 처리 => 무한 토스트!!!
  // if (invitation_type === "service_only") {
  //   handleServiceOnlyAccept();
  //   return null;
  // }
  //렌더링 과정에서 네트워크 요청, 라우팅, localStorage, toast 같은 side-effect를 실행하면 안 됨. 이건 전부 useEffect 안에서 해야 함.
  /**
   * 
   * 4-1. useRef가 여기서 하는 역할
      useRef는 current라는 값을 가진 객체를 반환하고,
      이 current는 리렌더링이 되어도 유지됨.
      하지만 current를 바꿔도 컴포넌트를 리렌더링시키지 않음.
      즉, “컴포넌트 인스턴스 안에 숨겨진 로컬 변수”처럼 쓸 수 있음.
  * 
  * 
  */


 /**
   * service_only 자동 수락 처리
   */
  useEffect(() => {
    if (invitation_type !== "service_only") return;
    if (hasHandledRef.current) return;   // 이미 처리했으면 또 실행 X

    hasHandledRef.current = true;
    handleServiceOnlyAccept();
  }, []);

    
  if (!userId || !invite) return null;

  if (invite.invitation_type === "service_only") return null;
 
  

  /**
   * 프로젝트 초대 수락 처리
   */
  const handleAccept = async () => {
    try {
      // 1) 초대 상태 업데이트
      const { error: updateError } = await supabase
        .from("project_invitation_new")
        .update({
          status: "accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_id", invitation_id);

      if (updateError) {
        console.error(updateError);
        showToast("초대 수락 중 오류가 발생했습니다.", "error");
        return;
      }

      // 2) 프로젝트 멤버 추가
      const { error: insertError } = await supabase
        .from("project_members")
        .insert({
          project_id,
          user_id: userId,
          role: project_role,
          joined_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(insertError);
        showToast("프로젝트 멤버 추가 실패", "error");
        return;
      }

      // 3) invite_id 제거
      localStorage.removeItem("invite_id");

      showToast("프로젝트에 참여했습니다!", "success");

      // 4) 프로젝트 페이지 이동
      router.push(`/project/${project_id}`);
    } catch (err) {
      console.error("초대 수락 오류:", err);
      showToast("처리 중 오류가 발생했습니다.", "error");
    }
  };

  /**
   * 프로젝트 초대 거절
   */
  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("project_invitation_new")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_id", invitation_id);

      if (error) {
        console.error("거절 실패:", error);
        showToast("처리 중 오류 발생", "error");
        return;
      }

      localStorage.removeItem("invite_id");
      showToast("초대를 거절했습니다.", "alert");
      window.location.reload();
    } catch (err) {
      console.error("거절 처리 오류:", err);
      showToast("처리 중 오류가 발생했습니다.", "error");
    }
  };

  // -----------------------------------------
  //  invitation_type === "project" 인 경우만 모달 렌더링
  // -----------------------------------------
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[380px]">
        <h2 className="text-lg font-semibold mb-3">프로젝트 초대가 도착했습니다</h2>
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
