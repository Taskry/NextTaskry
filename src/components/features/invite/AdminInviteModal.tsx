"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/lib/utils/toast";
import { useSession } from "next-auth/react";
import type { AdminInviteModalProps, Invitation } from "@/types/invite";

type InvitationWithProject = Invitation & {
  project_name: string | null;
};

export default function AdminInviteModal({
  projects,
  onClose,
}: AdminInviteModalProps) {
  const { data: session } = useSession();

  const [invitationType, setInvitationType] = useState<"service_only" | "project">("service_only");
  const [email, setEmail] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [role, setRole] = useState<"member" | "leader">("member");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invitationList, setInvitationList] = useState<Invitation[]>([]);

 
  // 전체 초대 현황 조회
  const loadInvitations = async () => {
    try {
      const res = await fetch("/api/admin/invitations");
      const data = await res.json();
      setInvitationList(data || []);
      console.log(data,"프로젝트 목록")
    } catch (err) {
      console.error("초대현황 로드 실패:", err);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  // 초대 로직 실행
  const handleSubmit = async () => {
    setErrorMessage(""); //에러문구초기화

    if (!email.includes("@")) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 프로젝트 초대인데 프로젝트 선택 안했을 때 => 프로젝트 선택 필수
    if (invitationType === "project" && !projectId) {
      setErrorMessage("프로젝트를 선택하세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_type: invitationType,
          email,
          project_id: invitationType === "project" ? projectId : null,
          project_role: invitationType === "project" ? role : null,
          invited_by: session?.user?.user_id,
        }),
      });

      const result = await res.json();

      console.log(result,"result")
      if (!res.ok) {
        showToast(result.error || "초대 실패", "error");
        setIsLoading(false);
        return;
      }

      // 성공 처리
      showToast("초대를 전송했습니다!", "success");

      // 초기화
      setEmail("");
      setProjectId(null);
      setRole("member");

      // 현황 새로고침
      await loadInvitations();

      onClose();
    } catch (err) {
      console.error(err);
      showToast("서버 오류 발생", "error");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-black rounded-xl p-6 w-[420px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">유저 초대</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* 초대 타입 선택 */}
        <div className="mb-4">
          <label className="text-sm font-medium">초대 방식</label>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="service_only"
                checked={invitationType === "service_only"}
                onChange={() => setInvitationType("service_only")}
              />
              서비스 전체 초대 (가입만 하면 완료)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="project"
                checked={invitationType === "project"}
                onChange={() => setInvitationType("project")}
              />
              프로젝트 초대 (프로젝트에 멤버로 참여)
            </label>
          </div>
        </div>

        {/* EMAIL INPUT */}
        <div className="mb-3">
          <label className="text-sm font-medium">이메일</label>
          <input
            className="w-full mt-1 border rounded-md px-3 py-2"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PROJECT + ROLE */}
        {invitationType === "project" && (
          <>
            <div className="mb-3">
              <label className="text-sm font-medium">프로젝트 선택</label>
              <select
                className="w-full mt-1 border rounded-md px-3 py-2 dark:bg-black"
                value={projectId ?? ""}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">프로젝트를 선택하세요</option>
                {projects.map((p) => (
                  <option key={p.project_id} value={p.project_id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="text-sm font-medium">역할</label>
              <select
                className="w-full mt-1 border rounded-md px-3 py-2 dark:bg-black"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "member" | "leader")
                }
              >
                <option value="member">Member</option>
                <option value="leader">Leader</option>
              </select>
            </div>
          </>
        )}

        {/* ERROR */}
        {errorMessage && (
          <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
        )}

        {/* 전체 초대 현황 */}
        <div className="mt-6 border-t pt-4 max-h-56 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">전체 초대 현황</h3>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300 border-b">
                <th className="py-2 text-left">이메일</th>
                <th className="py-2 text-left">타입</th>
                <th className="py-2 text-left">프로젝트</th>
                <th className="py-2 text-left">역할</th>
                <th className="py-2 text-left">상태</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {invitationList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    아직 초대 내역이 없습니다.
                  </td>
                </tr>
              )}

              {invitationList.map((inv: InvitationWithProject) => (
                <tr key={inv.invitation_id}>
                  <td className="py-2">{inv.invited_email}</td>
                  <td className="py-2">
                    {inv.invitation_type === "service_only"
                      ? "서비스초대"
                      : "프로젝트초대"}
                  </td>
                  <td className="py-2">{inv.project_name ?? "-"}</td>
                  <td className="py-2">{inv.project_role ?? "-"}</td>
                  <td className="py-2 capitalize">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-md border" onClick={onClose}>
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
