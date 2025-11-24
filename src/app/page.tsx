// app/page.tsx

"use client";

import ProjectCard from "@/components/features/project/ProjectCard";
import ProjectCardHeader from "@/components/features/project/ProjectCardHeader";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InviteDecisionModal from "@/components/features/invite/InviteDecisionModal";



const Home = () => {
  const router = useRouter();
  console.log("프로젝트 목록페이지")

  const handleSelectProject = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const [inviteData, setInviteData] = useState(null);

    useEffect(() => {
    const checkInvite = async () => {
      const inviteId = localStorage.getItem("invite_id");

      // ❌ 일반 로그인 → 초대 없음
      if (!inviteId) return;

      // 🔥 해당 초대 정보 조회
      const { data, error } = await supabase
        .from("project_invitations")
        .select("*")
        .eq("invitation_id", inviteId)
        .maybeSingle();

      if (error) {
        console.error("초대 조회 오류:", error);
        return;
      }

      // 초대가 존재하고 상태가 pending일 때만 모달을 띄움
      if (data && data.status === "pending") {
        setInviteData(data);
      }
    };

    checkInvite();
  }, []);




  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <ProjectCardHeader />
        <ProjectCard onSelectProject={handleSelectProject} />
      </div>


       {/* 🔥 초대 모달 표시 */}
      {inviteData && <InviteDecisionModal invite={inviteData} />}
    </div>
  );
};

export default Home;
