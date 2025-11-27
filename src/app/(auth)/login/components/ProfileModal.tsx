import Button from "@/components/ui/Button";
import { Icon } from "@/components/shared/Icon";
import { signOut } from "next-auth/react";

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
}

export default function ProfileModal({ onClose, user }: ProfileModalProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative w-80 rounded-xl shadow-lg p-6 z-50 border border-border bg-card
"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <Icon type="x" />
        </button>

        {/* 유저 정보 */}
        <div className="flex flex-col items-center">
          <img
            src={user?.image ?? "/default.png"}
            alt="profile"
            className="w-16 h-16 rounded-full border"
          />

          <h3 className="mt-3 text-lg font-semibold">{user?.name}</h3>
          <p className="text-gray-500 text-sm dark:text-white">{user?.email}</p>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            btnType="basic"
            variant="primary"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            로그아웃
          </Button>
          <Button
            btnType="basic"
            variant="basic"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
