"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { showToast } from "@/lib/utils/toast";
import { InviteMemberModalProps, Invitation } from "@/types/invite";
import { useSession } from "next-auth/react";


export default function InviteMemberModal({ projectId, onClose }: InviteMemberModalProps) {

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const {data : session} = useSession();

  const userId = session?.user?.user_id;


  // 이미 보낸 초대 목록 가져오기
  const fetchInvitations = async () => {
    const { data } = await supabase
      .from("project_invitations")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    setInvitations(data || []);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // 초대하기
  const handleSubmit = async () => {
    
    setErrorMessage("");

    if (!email.includes("@")) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);


    // 0. 중복 초대 검사
    const { data: existingInvite } = await supabase
      .from("project_invitations")
      .select("status")
      .eq("project_id", projectId)
      .eq("invited_email", email)
      .maybeSingle();

    if (existingInvite) {
      if (existingInvite.status === "pending") {
        showToast("이미 초대한 이메일입니다.", "alert");
        setIsLoading(false);
        return;
      }

      if (existingInvite.status === "accepted") {
        showToast("이미 팀원으로 가입한 사용자입니다.", "alert");
        setIsLoading(false);
        return;
      }
    }




    // insert 후 data에서 invitationId 확보
    const { data,error } = await supabase.from("project_invitations").insert({
      project_id: projectId,
      invited_email: email,
      invited_by: userId,
      project_role: role,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select("invitation_id") // ✅ 방금 생성된 row에서 invitation_id만 가져오겠다는 뜻
    .single();               // ✅ 결과가 1줄이라고 기대할 때 사용

    setIsLoading(false);

    if (error || !data) {
      setErrorMessage("초대 중 오류가 발생했습니다.");
      console.error(error);
      return;
    }

    // ✅ 여기서 방금 생성된 invitation_id 확보
    const invitationId = data.invitation_id;

    // ✅ STEP 3 — 이메일 발송 API 호출
try {
  const res = await fetch("/api/send-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      invitationId: invitationId,
    }),
  });





  const result = await res.json();

    
    if (!res.ok) {
    console.error("Email sending error:", result);
    showToast("이메일 전송에 실패했습니다.", "error");
  } else {
    showToast("초대 이메일을 전송했습니다!", "success");
  }
} catch (err) {
  console.error("Email API 호출 오류:", err);
  showToast("이메일 서버 오류가 발생했습니다.", "error");
}  






    // showToast("초대가 완료되었습니다!", "success");
    setEmail(""); // 초기화
    await fetchInvitations(); // 목록 갱신
  };
    // ⬇️ 이 invitationId를 나중에 이메일 API 호출할 때 사용함
    // 예: /api/send-invite 로 { email, invitationId } 보내기


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[420px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">팀원 초대</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* EMAIL INPUT */}
        <div className="mb-3">
          <label className="text-sm font-medium">초대할 이메일</label>
          <input
            type="email"
            className="w-full mt-1 border rounded-md px-3 py-2"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* ROLE SELECT */}
        <div className="mb-3">
          <label className="text-sm font-medium">역할</label>
          <select
            className="w-full mt-1 border rounded-md px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="leader">Leader</option>
          </select>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
        )}

        {/* PENDING INVITATIONS */}
        <div className="mt-4 max-h-40 overflow-y-auto border-t pt-4 mb-4">
          <h3 className="text-sm font-medium mb-2">보낸 초대 목록</h3>

          {invitations.length === 0 && (
            <p className="text-gray-500 text-sm">아직 보낸 초대가 없습니다.</p>
          )}

          {invitations.map((inv) => (
            <div
              key={inv.invitation_id}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-sm">{inv.invited_email}</span>
              <span className="text-xs text-gray-400">{inv.status}</span>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-md border"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>

          <button
            className="px-4 py-2 rounded-md bg-main-500 text-white"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "초대 중..." : "초대하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
