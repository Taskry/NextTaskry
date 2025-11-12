"use client";

import clsx from "clsx";
import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { useEffect } from "react";

export const modalConfigs = {
  delete: {
    icon: "trash",
    iconColor: "text-red-100",
    iconSize: 36,
    title: "정말 이 일정을 삭제하시겠습니까?",
    description: "삭제한 일정은 다시 되돌릴 수 없습니다.",
    warning: "*하위 할 일을 포함한 모든 데이터가 함께 삭제됩니다.",
    info: null,
    buttonCancelText: "취소",
    buttonConfirmText: "일정 삭제",
    confirmVariant: "warning" as const,
  },
  success: {
    icon: "circleCheckFilled",
    iconBgColor: "bg-green-50",
    iconColor: "text-green-500",
    iconSize: 45,
    title: "일정 삭제가 완료되었습니다.",
    description:
      "모든 하위 작업이 삭제되었습니다.<br/>대시보드가 업데이트 되었습니다.",
    warning: null,
    info: "*5초 뒤, 아무런 동작이 없을 시 자동으로 창이 닫힙니다.",
    infoColor: "text-gray-400",
    buttonCancelText: null,
    buttonConfirmText: null,
  },
  error: {
    icon: "alertTriangle",
    iconBgColor: "bg-red-50",
    iconColor: "text-red-500",
    iconSize: 36,
    title: "삭제에 실패했습니다.",
    description: "재시도 해주세요.",
    warning: null,
    info: null,
    buttonCancelText: "취소",
    buttonConfirmText: "재시도",
    confirmVariant: "warning" as const,
  },
};

const modalClasses = clsx(
  "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40",
  "w-full h-full",
  "flex items-center"
);

const modalInnerClasses = clsx(
  "relative m-auto w-xl min-h-68 py-9 px-7",
  "flex flex-col items-center justify-center",
  "border border-gray-100 rounded-2xl shadow-sm bg-white"
);
const modalIconClasses = clsx(
  "size-15 flex items-center justify-center",
  "absolute -top-8 left-1/2 transform -translate-x-1/2",
  "shadow-lg rounded-full bg-white"
);

interface ModalProps {
  type?: "delete" | "success" | "error";
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
}

export default function Modal({
  type,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ModalProps) {
  const config = modalConfigs[type as keyof typeof modalConfigs];

  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={modalClasses}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={modalInnerClasses}>
        {/* 모달 아이콘 */}
        <div className={modalIconClasses}>
          <Icon
            type={config.icon}
            className={` ${config.iconColor}`}
            size={config.iconSize}
          />
        </div>
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <Icon type="x" />
        </button>

        {/* 텍스트 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">{config.title}</h2>
          <p
            className="text-base font-medium mt-2"
            dangerouslySetInnerHTML={{ __html: config.description }}
          />

          {config.warning && (
            <p className="text-sm font-semibold mt-5 text-red-500">
              {config.warning}
            </p>
          )}

          {config.info && (
            <p className={`text-sm font-medium mt-5 ${config.infoColor}`}>
              {config.info}
            </p>
          )}
        </div>

        {/* 버튼 */}
        {(config.buttonCancelText || config.buttonConfirmText) && (
          <div className="flex gap-3 justify-center mt-6">
            {config.buttonCancelText && (
              <Button variant="basic" size="base" onClick={onClose}>
                {config.buttonCancelText}
              </Button>
            )}
            {config.buttonConfirmText && (
              <Button
                variant={config.confirmVariant}
                size="base"
                onClick={onConfirm}
                textColor="white"
              >
                {config.buttonConfirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
