"use client";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/shared/Container";

export default function LoginPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const inviteId = searchParams.get("invite");

    //초대 링크에서 들어온 경우에만 저장
    if (inviteId) {
      localStorage.setItem("invite_id", inviteId);
    }

    console.log(inviteId,"inviteId")
  }, [searchParams]);

  return (
    <Container
      className="
      min-h-screen 
      flex flex-col items-center justify-center 
      overflow-hidden"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-main-200 rounded-full flex items-center justify-center">
          <Icon type="board" size={28} className="text-main-500" />
        </div>

        <h1 className="text-4xl font-bold">Taskry</h1>

        <div className="mt-3">
          <p className="md:text-md text-center text-base font-medium dark-description">
            Taskry와 함께 프로젝트를 쉽게 관리할 수 있습니다. <br />
            계속하시려면 로그인해주세요.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button
          btnType="basic"
          icon="google"
          variant="primary"
          size={18}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Google로 시작하기
        </Button>
      </div>
    </Container>
  );
}
