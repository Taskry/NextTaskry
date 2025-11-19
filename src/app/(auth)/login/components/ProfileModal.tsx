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
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 본문 */}
      <div className="relative bg-white w-80 rounded-xl shadow-lg p-6 z-50">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        {/* 유저 정보 */}
        <div className="flex flex-col items-center">
          <img
            src={user?.image ?? "/default.png"}
            alt="profile"
            className="w-16 h-16 rounded-full border"
          />

          <h3 className="mt-3 text-lg font-semibold">{user?.name}</h3>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        {/* 버튼 */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-2 bg-main-500 text-white rounded-lg"
          >
            로그아웃
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
