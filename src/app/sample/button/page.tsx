"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

export default function Page() {
  type basicButtonType = {
    text?: string;
    btnType?: "basic" | "form" | "nav" | "tab" | "form_s" | "icon";
    variant?: "basic" | "warning" | "success" | "list" | "new" | "white";
    icon?: string;
    iconSize?: "sm";
    isActive?: boolean;
    hasIcon?: boolean;
  };

  // 기본 버튼에 대한 샘플
  const basicData: basicButtonType[] = [
    { text: "취소", variant: "basic" },
    { text: "삭제", variant: "warning" },
    { text: "추가", variant: "success" },
    { text: "등록", variant: "new" },
    { text: "목록", variant: "list" },
    { text: "수정하기", variant: "basic" },
  ];

  // 폼 액션 버튼에 대한 샘플
  const particularData: basicButtonType[] = [
    {
      text: "새 프로젝트",
      icon: "plus",
    },
    {
      text: "Google로 시작하기",
      icon: "google",
    },
    {
      text: "프로젝트 수정",
      icon: "edit",
    },
    {
      text: "프로젝트 생성하기",
      icon: "plus",
    },
    {
      text: "수정 완료",
      icon: "edit",
    },
  ];

  // 네비게이션에 대한 샘플
  const navigationsData: basicButtonType[] = [
    { text: "칸반보드", icon: "board" },
    { text: "메모", icon: "notes" },
    { text: "프로젝트", icon: "details" },
    { text: "내 일정", icon: "board" },
    { text: "캘린더", icon: "calendar" },
  ];

  // 탭 버튼에 대한 샘플
  const tabsData = ["프로젝트 관리", "유저 관리", "공지사항 관리"];

  // 🔥 수정: 문자열로 초기값 설정 (객체 대신)
  const [activeTab, setActiveTab] = useState(tabsData[0]);
  const [activeNav, setActiveNav] = useState("칸반보드");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleNavClick = (navText: string) => {
    setActiveNav(navText);
  };

  return (
    <section>
      <div className="px-7">
        {/* 기본 버튼 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">기본 버튼</h1>
          <div className="flex gap-2 mb-4">
            {basicData.map((item) => {
              return (
                <Button btnType="basic" key={item.text} variant={item.variant}>
                  {item.text}
                </Button>
              );
            })}
            <Button
              btnType="basic"
              variant="primary"
              className="w-full max-w-[200px] text-white"
            >
              Login
            </Button>
          </div>

          <p>{'<Button btnType="basic">텍스트</Button>'}</p>
          <p>{'<Button btnType="basic" variant="warning">텍스트</Button>'}</p>
        </div>

        {/* 폼 액션 버튼 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">폼 액션 버튼(1)</h1>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {particularData.map((item) => {
              return (
                <Button btnType="form" icon={item.icon} key={item.text}>
                  {item.text}
                </Button>
              );
            })}
            <Button btnType="form" icon="plus" state="disabled" disabled>
              프로젝트 생성하기
            </Button>
          </div>

          <p>{'<Button btnType="form" icon="plus">텍스트</Button>'}</p>
          <p>
            {
              'disabled: <Button btnType="form" state="disabled" disabled>텍스트</Button>'
            }
          </p>
        </div>

        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">폼 액션 버튼(2)</h1>
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Button btnType="form_s" icon="plus" size={18} hasIcon={true}>
              새 공지사항
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">네비게이션</h1>
          <div className="flex items-center gap-2 mb-4">
            {navigationsData.map((nav) => {
              const isActive = nav.text === activeNav;

              return (
                <Button
                  btnType="nav"
                  icon={nav.icon}
                  size={24}
                  key={nav.text}
                  hasIcon={true}
                  color="black"
                  isActive={isActive}
                  onClick={() => handleNavClick(nav.text!)}
                >
                  {nav.text}
                </Button>
              );
            })}
          </div>

          <p>
            {
              '<Button btnType="nav" icon="board" size={24} hasIcon={true}>텍스트</Button>'
            }
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="mb-8">
          <h1 className="mb-3 text-xl font-semibold">탭 버튼</h1>
          <div className="flex gap-2 mb-4">
            {tabsData.map((item) => {
              const isActive = item === activeTab;

              return (
                <Button
                  btnType="tab"
                  key={item}
                  isActive={isActive}
                  onClick={() => handleTabClick(item)}
                >
                  {item}
                </Button>
              );
            })}
          </div>
          <p>{'<Button btnType="tab">텍스트</Button>'}</p>
        </div>

        {/* 아이콘 버튼 */}
        <div>
          <h1 className="mb-3 text-xl font-semibold">아이콘 버튼</h1>
          <div className="flex gap-2 mb-4">
            <Button
              btnType="icon"
              icon="edit"
              size={16}
              variant="white"
              className="hover:bg-main-100/40 hover:border-main-100/40"
            />
            <Button
              btnType="icon"
              icon="trash"
              size={16}
              color="red"
              variant="white"
              className="hover:bg-red-100/40 hover:border-red-100/40"
            />
          </div>
          <p>
            {
              '<Button btnType="icon" icon="trash" size={16} variant="white" color="red"/>'
            }
          </p>
          <p>
            {
              '<Button btnType="icon" icon="trash" size={16} variant="white" color="red" className="hover:bg-red-100/40 hover:border-red-100/40"/>'
            }
          </p>
        </div>
      </div>
    </section>
  );
}
