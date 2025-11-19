import { useCallback, useState } from "react";

interface ModalControls {
  openModal: (
    type: "delete" | "success" | "error" | "progress",
    title?: string,
    description?: string,
    warning?: string
  ) => void;
  closeModal: () => void;
  modalProps: ModalProps;
}

export const useModal = (): ModalControls => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<
    "delete" | "success" | "error" | "progress" | undefined
  >(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [warning, setWarning] = useState<string | undefined>(undefined);

  const openModal = useCallback((type, title, description, warning) => {
    setType(type);
    setTitle(title);
    setDescription(description);
    setIsOpen(true);
    setWarning(warning);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setType(undefined);
    setTitle(undefined);
    setDescription(undefined);
    setWarning(undefined);
  }, []);

  return {
    openModal,
    closeModal,
    modalProps: {
      type,
      isOpen,
      onClose: closeModal,
      title,
      description,
      warning,
    },
  };
};
