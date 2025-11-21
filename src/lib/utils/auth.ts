import { Session } from "next-auth";

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "admin";
}

export function checkUserPermission(session: Session | null) {
  return {
    isAdmin: isAdmin(session),
    isAuthenticated: !!session?.user,
    userId: session?.user?.user_id,
  };
}
