import React from "react";

export interface ModalProps {
  type?: "delete" | "success" | "error" | "progress" | "deleteSuccess";
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  warning?: string;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
}
