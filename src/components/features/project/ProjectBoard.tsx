import ProjectBoardHeader from "@/components/features/project/ProjectBoardHeader";
import PorjectBoardFilter from "./ProjectBoardFilter";
import ProjectBoardBody from "@/components/features/project/ProjectBoardBody";
import { ProjectBoardProvider } from "@/providers/ProjectBoardProvider";

export default function ProjectBoard() {
  return (
     <ProjectBoardProvider>
        <ProjectBoardHeader />
        <PorjectBoardFilter />
        <ProjectBoardBody />
     </ProjectBoardProvider>
  );
}
