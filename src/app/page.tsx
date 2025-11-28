// app/page.tsx

"use client";

import { supabase } from "@/lib/supabase/supabase";
import { useEffect, useState } from "react";
import InviteDecisionModal_V2 from "@/components/features/invite/InviteDecisionModal_V2";
import Container from "@/components/shared/Container";
import ProjectBoard from "@/components/features/project/ProjectBoard";

const Home = () => {
  console.log("프로젝트 목록페이지");

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
        <ProjectBoard />
      </Container>


       {/* 초대 모달 표시 */}
      {inviteData && <InviteDecisionModal_V2 invite={inviteData} 
       onCloseModal={() => setInviteData(null)}/>}
    </div>
  );
};

export default Home;
