"use client";
import Button from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20">
      
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-main-200 rounded-full flex items-center justify-center">
          <Icon  type="board" size={28} className="text-main-500 " />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Taskry</h1>
        <div className="mt-3">
          <p className="text-sm md:text-md text-gray-600 text-center font-medium">
            Taskry와 함께 프로젝트를 쉽게 관리할 수 있습니다. <br />
            계속하시려면 로그인해주세요.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {/* 구글 버튼 컴포넌트 들어갈 자리 */}
        <Button  textColor="white" icon="google" variant="bgMain500" size="base" radius="lg" 
        onClick={ ()=> signIn("google", {callbackUrl:"/"})}>Google로 시작하기</Button>
      </div>
    </div>
  );
}