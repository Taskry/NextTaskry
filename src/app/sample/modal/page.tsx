"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";

export default function Page() {
  type buttonType = {
    type?: string;
    title?: string;
    description?: string;
    warning?: string;
    name?: string;
  };
  const { openModal, modalProps } = useModal();
  const modalButtonData: buttonType[] = [
    {
      type: "delete",
      title: "이 일정을 삭제하시겠습니까?",
      description: "모든 하위 할 일이 사라집니다.",
      name: "일정 삭제 모달",
    },
    { type: "delete", name: "일정 삭제 진행중 모달 노출" },
    { type: "success", name: "일정 삭제 성공 모달 노출" },
    { type: "error", name: "일정 삭제 실패 모달 노출" },
    {
      type: "delete",
      title: "프로젝트를 삭제하시겠습니까?",
      description: "삭제한 프로젝트는 다시 되돌릴 수 없습니다.",
      warning: "*프로젝트 관련 모든 데이터가 삭제됩니다.",
      name: "프로젝트 삭제 모달 노출",
    },
  ];

  return (
    <>
      <div className="p-2 mb-5 border-1 border-main-300">
        {
          '버튼: <Button onClick={() => ("delete", "이 일정을 삭제하시겠습니까?", "모든 하위 할 일이 사라집니다.")}>삭제</Button>'
        }
      </div>
      <div className="py-20 text-center">
        <h1 className="mb-3 text-xl font-semibold">모달 샘플 테스트</h1>
        <div className="flex justify-center gap-4 mb-4">
          {modalButtonData.map((button) => {
            return (
              <Button
                key={button.name}
                onClick={() =>
                  openModal(
                    button.type,
                    button.title,
                    button.description,
                    button.warning
                  )
                }
              >
                {button.name}
              </Button>
            );
          })}
        </div>

        <Modal {...modalProps}></Modal>
      </div>
    </>
  );
}
