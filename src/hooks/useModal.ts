import { useCallback, useState } from "react";
import { ModalProps } from "@/types/modal";

interface ModalControls {
  openModal: (
    type: "delete" | "success" | "error" | "progress" | "deleteSuccess",
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
    "delete" | "success" | "error" | "progress" | "deleteSuccess" | undefined
  >(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [warning, setWarning] = useState<string | undefined>(undefined);

  const openModal = useCallback(
    (type: any, title: any, description: any, warning: any) => {
      setType(type);
      setTitle(title);
      setDescription(description);
      setIsOpen(true);
      setWarning(warning);
    },
    []
  );

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
