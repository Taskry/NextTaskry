// app/page.tsx

"use client";

import ProjectCard from "@/components/features/project/ProjectCard";
import ProjectCardHeader from "@/components/features/project/ProjectCardHeader";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleSelectProject = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <ProjectCardHeader />
        <ProjectCard onSelectProject={handleSelectProject} />
      </div>
    </div>
  );
};

export default Home;
