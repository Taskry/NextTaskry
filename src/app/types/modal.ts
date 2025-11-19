export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'delete' | 'progress';
  title?: string;
  description?: string;
  children?: React.ReactNode;
}
