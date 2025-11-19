// types/projectMember.types.ts
export type ProjectMemberRole = "leader" | "member";

export interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  joined_at: string;
}

export type InsertProjectMember = Omit<
  ProjectMember,
  "member_id" | "joined_at"
>;
export type UpdateProjectMember = Partial<
  Omit<ProjectMember, "member_id" | "joined_at">
>;
