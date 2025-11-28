import { createContext, useContext, useState, ReactNode } from "react";

interface FilterProps {
  view: string;
  date: string;
  sort: string;
}

interface ProjectBoardContextType {
  filter: FilterProps;
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
}

const ProjectBoardContext = createContext<ProjectBoardContextType | undefined>(undefined);

export function ProjectBoardProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<FilterProps>({
    view: "all",
    date: "startedAt",
    sort: "asc",
  });

  return (
    <ProjectBoardContext.Provider value={{ filter, setFilter }}>
      {children}
    </ProjectBoardContext.Provider>
  );
}

export function useProjectBoard() {
  const context = useContext(ProjectBoardContext);
  if (!context) throw new Error("Cannot find ProjectBoardProvider");
  return context;
}