export type UserRole = "admin" | "user";

export interface User {
  user_id: string;
  email: string;
  user_name: string;
  profile_image?: string;
  global_role: UserRole;
  auth_provider: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InsertUser = Omit<User, "user_id" | "created_at" | "updated_at">;
export type UpdateUser = Partial<Omit<User, "user_id" | "created_at">>;
