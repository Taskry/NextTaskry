export type Invitation = {
  invitation_id: string;
  invitation_type: "service_only" | "project";

  invited_email: string;
  invited_by: string;

  project_id: string | null;
  project_role: "member" | "leader" | null;

  status: "pending" | "accepted" | "rejected" | "expired";

  expires_at: string | null;
  created_at: string;
  updated_at: string;
};


export type AdminInviteModalProps = {
  projects: { project_id: string; project_name: string }[];
  onClose: () => void;
};


