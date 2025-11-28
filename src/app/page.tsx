// app/page.tsx

"use client";

import ProjectCard from "@/components/features/project/ProjectCard";
import ProjectCardHeader from "@/components/features/project/ProjectCardHeader";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InviteDecisionModal_V2 from "@/components/features/invite/InviteDecisionModal_V2";
import Container from "@/components/shared/Container";

const Home = () => {
  const router = useRouter();
  console.log("프로젝트 목록페이지");

  const handleSelectProject = (projectId: string) => {
    // 세션 스토리지에 선택한 프로젝트 ID 저장
    sessionStorage.setItem("current_Project_Id", projectId);
    // URL에 ID 노출없이 프로젝트 페이지로 이동
    router.push(`/project/workspace`);
  };

  const [inviteData, setInviteData] = useState(null);

  useEffect(() => {
    const checkInvite = async () => {
      const inviteId = localStorage.getItem("invite_id");
      if (!inviteId) return;

     
      const { data, error } = await supabase
        .from("project_invitation_new")
        .select("*")
        .eq("invitation_id", inviteId)
        .maybeSingle();

      if (error) {
        console.error("초대 조회 오류:", error);
        return;
      }

      if (data && data.status === "pending") {
        setInviteData(data);
      }
    };

    checkInvite();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <Container className="h-full">
        <ProjectCardHeader />
        <ProjectCard onSelectProject={handleSelectProject} />
      </Container>


       {/* 초대 모달 표시 */}
      {inviteData && <InviteDecisionModal_V2 invite={inviteData} 
       onCloseModal={() => setInviteData(null)}/>}
    </div>
  );
};

export default Home;
