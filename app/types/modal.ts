export interface ModalProps {
  type?: "delete" | "success" | "error" | "progress";
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  warning?: string;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
}
