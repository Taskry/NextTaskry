"use client";

import clsx from "clsx";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { useEffect } from "react";
import { ModalProps } from "@/types/modal";
import { modalConfigs } from "@/config/modalConfigs";

const modalClasses = clsx(
  "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40",
  "w-full h-full",
  "flex items-center"
);

const modalInnerClasses = clsx(
  "relative m-auto w-xl min-h-68 py-9 px-7",
  "flex flex-col items-center justify-center",
  "border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800"
);
const modalIconClasses = clsx(
  "size-15 flex items-center justify-center",
  "absolute -top-8 left-1/2 transform -translate-x-1/2",
  "shadow-lg rounded-full bg-white dark:bg-gray-800"
);

export default function Modal({
  type,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  warning,
  buttonDisabled,
  children,
}: ModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = type
    ? modalConfigs[type as keyof typeof modalConfigs]
    : ({} as any);
  // prop으로 전달받은 title, description이 있다면 사용하고, 없으면 config 값 사용
  const finalTitle = title ?? config.title;
  const finalDescription = description ?? config.description;
  const finalWarning = warning ?? config.warning;

  // 성공 타입은 5초 자동 닫힘
  useEffect(() => {
    if (type === "success" || type === "deleteSuccess") {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={modalClasses}>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      <div className={modalInnerClasses}>
        {/* 모달 아이콘 */}
        {config?.icon && (
          <div className={modalIconClasses}>
            <Icon
              type={config.icon}
              className={`${config.iconColor}`}
              size={config.iconSize}
            />
          </div>
        )}
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <Icon type="x" />
        </button>

        {/* 텍스트 또는 커스텀 컨텐츠 */}
        <div className="text-center w-full">
          {children ? (
            children
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {finalTitle}
              </h2>
              <p className="text-base font-medium mt-2 text-gray-700 dark:text-gray-300">
                {finalDescription}
              </p>

              {finalWarning && (
                <p className="text-sm font-semibold mt-5 text-red-500 dark:text-red-400">
                  {finalWarning}
                </p>
              )}

              {config?.info && (
                <p
                  className={`text-sm font-medium mt-5 ${
                    config.infoColor || "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {config.info}
                </p>
              )}
            </>
          )}
        </div>

        {/* 버튼 */}
        {(config?.buttonCancelText || config?.buttonConfirmText) && (
          <div className="flex gap-3 justify-center mt-6">
            {config?.buttonCancelText && (
              <Button btnType="basic" variant="basic" onClick={onClose}>
                {config.buttonCancelText}
              </Button>
            )}
            {config?.buttonConfirmText && (
              <Button
                btnType="form"
                variant="warning"
                onClick={onConfirm}
                disabled={buttonDisabled ?? config.buttonDisabled}
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
