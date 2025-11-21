"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { showToast } from "@/lib/utils/toast";
import { InviteMemberModalProps, Invitation } from "@/types/invite";

export default function InviteMemberModal({ projectId, onClose }: InviteMemberModalProps) {

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

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

    const { error } = await supabase.from("project_invitations").insert({
      project_id: projectId,
      invited_email: email,
      invited_by: "", // TODO: 로그인한 유저의 user_id 넣기
      project_role: role,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("초대 중 오류가 발생했습니다.");
      console.error(error);
      return;
    }

    showToast("초대가 완료되었습니다!", "success");

    setEmail(""); // 초기화
    await fetchInvitations(); // 목록 갱신
  };

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
