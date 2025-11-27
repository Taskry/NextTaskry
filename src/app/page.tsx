// app/page.tsx

"use client";

import ProjectCard from "@/components/features/project/ProjectCard";
import ProjectCardHeader from "@/components/features/project/ProjectCardHeader";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InviteDecisionModal_V2 from "@/components/features/invite/InviteDecisionModal_V2";



const Home = () => {
  const router = useRouter();
  
  //초대 확인 절차
  const handleSelectProject = (projectId: string) => {
    router.push(`/project/${projectId}`);
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
      <div className="flex-1 overflow-auto">
        <ProjectCardHeader />
        <ProjectCard onSelectProject={handleSelectProject} />
      </div>


       {/* 초대 모달 표시 */}
      {inviteData && <InviteDecisionModal_V2 invite={inviteData} 
       onCloseModal={() => setInviteData(null)}/>}
    </div>
  );
};

export default Home;
