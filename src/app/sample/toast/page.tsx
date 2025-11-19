// ------------------------------------------------------------------
// react-hot-toast 사용
// ------------------------------------------------------------------
"use client";

import Button from "@/components/ui/Button";
import Container from "@/components/shared/Container";
import { showToast, showApiError } from "@/lib/utils/toast";

export default function Page() {
  return (
    <Container>
      <div className="flex gap-2">
        <Button onClick={() => showToast("로그인이 필요합니다.", "alert")}>
          로그인 유도 토스트
        </Button>
        <Button onClick={() => showToast("로그인 되었습니다.", "success")}>
          로그인 성공 토스트
        </Button>
        <Button onClick={() => showToast("로그아웃 되었습니다.", "success")}>
          로그아웃 성공 토스트
        </Button>
        <Button onClick={() => showToast("저장되었습니다.", "success")}>
          저장 성공 토스트
        </Button>
        <Button onClick={() => showToast("삭제되었습니다.", "deleted")}>
          삭제 토스트
        </Button>
        <Button
          onClick={() => showToast("잠시 후 다시 시도하십시오.", "error")}
        >
          에러 토스트
        </Button>
        <Button onClick={() => showApiError("서버에 연결할 수 없습니다.")}>
          호출 실패 토스트
        </Button>
      </div>
    </Container>
  );
}
