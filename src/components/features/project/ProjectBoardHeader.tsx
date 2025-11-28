"use client"

import { SectionHeader } from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ProjectBoardHeader() {
  const router = useRouter();

  const handleAddProject = () => {
    sessionStorage.removeItem("current_Project_Id");
    router.push('/project/create');
  };
  
  return (
    <div className="flex justify-between mb-7">
      <SectionHeader
        title="프로젝트 목록"
        description="Taskry에서 프로젝트를 생성하고 관리합니다."
        className="!mb-0"
      />
      <div className="p-1 content-center">
        <Button btnType="basic" icon="plus" variant="primary" size={18} onClick={handleAddProject}>
          새 프로젝트
        </Button>
      </div>
    </div>
  );
}
