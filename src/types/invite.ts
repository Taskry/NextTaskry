export type Invitation = {
  invitation_id: string;
  project_id: string;
  invited_email: string;
  invited_by: string;
  project_role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type InviteMemberModalProps = {
  projectId: string;
  onClose: () => void;
};
