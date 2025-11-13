"use client";

import Link from "next/link";
import { Icon } from "../Icon/Icon";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-black">
      
      {/* 왼쪽: 로고 */}
      <Link href="/" className="flex items-center gap-2">
        <Icon type="board" size={22} className="text-main-500 dark:text-main-300" />
        <span className="font-bold text-main-600 dark:text-white text-lg">Taskry</span>
      </Link>

      {/* 오른쪽: 아이콘 영역 */}
      <div className="flex items-center gap-4">

        {/* ⭐ 팀원이 만든 '유저 아이콘' (프로필 버튼) */}
        <Link
          href="/user/profile"
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-main-500 transition"
        >
          <Icon
            type="userCircle"
            size={20}
            className="text-gray-600 dark:text-gray-300"
          />
        </Link>

        {/* ⭐ 테마 토글 버튼 */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-main-500 transition"
        >
          {theme === "dark" ? (
            <Icon type="sun" size={20} className="text-yellow-300 dark:text-yellow-400" />
          ) : (
            <Icon type="moon" size={20} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}