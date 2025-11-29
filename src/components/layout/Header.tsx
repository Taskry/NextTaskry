"use client";

import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import ProfileModal from "@/app/(auth)/login/components/ProfileModal";
import { useSession } from "next-auth/react";
import { showToast } from "@/lib/utils/toast";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  let handleLoginModal = () => {
    if (!session) {
      showToast("로그인이 필요합니다.", "alert");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <header
        className="
      fixed top-0 left-0 right-0 z-50 
      w-full h-14 
      border-b border-border 
      flex items-center justify-between 
      
      bg-bakground backdrop-blur-md"
      >
        <div className="w-full max-w-[1280px] px-10 mx-auto flex justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icon
              type="board"
              size={22}
              className="text-main-500 dark:text-main-300"
            />
            <span className="font-bold text-lg text-dark-title">Taskry</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLoginModal}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-main-500 transition"
            >
              <Icon
                type="userCircle"
                size={20}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-main-500 transition"
            >
              {!mounted ? (
                <Icon
                  type="moon"
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              ) : theme === "dark" ? (
                <Icon
                  type="sun"
                  size={20}
                  className="text-yellow-300 dark:text-yellow-400"
                />
              ) : (
                <Icon
                  type="moon"
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              )}
            </button>

            <button className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-main-500 transition">
              <Link href="/notice">
                <Icon
                  type="speakerphone"
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </Link>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <ProfileModal
          onClose={() => setOpen(false)}
          user={session?.user ?? null}
        />
      ) : null}
    </>
  );
}
