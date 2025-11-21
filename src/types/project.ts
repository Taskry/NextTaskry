// types/project.types.ts
export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  project_id: string;
  user_id?: string;
  project_name: string;
  description?: string;
  type: string;
  status: ProjectStatus;
  tech_stack?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export type InsertProject = Omit<
  Project,
  "project_id" | "created_at" | "updated_at"
>;
export type UpdateProject = Partial<Omit<Project, "project_id" | "created_at">>;


export type ProjectRole = "leader" | "member";
