"use client";

import Button from "@/app/components/Button/Button";
import Modal from "@/app/components/Modal/Modal";
import { useCallback, useState } from "react";

export default function Page() {
  const [modalStatus, setModalStatus] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "success" | "error">(
    "success"
  );

  const handleModal = (type: "delete" | "success" | "error") => {
    setModalType(type);
    setModalStatus(true);
  };

  return (
    <div className="py-20 text-center">
      <h1 className="mb-3 text-xl font-semibold">모달 샘플 테스트</h1>
      <div className="flex justify-center gap-4">
        <Button onClick={() => handleModal("delete")}>삭제 모달 노출</Button>
        <Button
          variant="success"
          textColor="white"
          onClick={() => handleModal("success")}
        >
          성공 모달 노출
        </Button>
        <Button
          variant="warning"
          textColor="white"
          onClick={() => handleModal("error")}
        >
          실패 모달 노출
        </Button>
      </div>

      <Modal
        type={modalType}
        isOpen={modalStatus}
        onClose={() => setModalStatus(false)}
      ></Modal>
    </div>
  );
}
