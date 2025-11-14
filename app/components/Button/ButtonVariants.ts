// ButtonVariants.ts (개선 버전)
import { cva } from "class-variance-authority";
import clsx from "clsx";

export const buttonCommonStyles = clsx(
  "inline-flex items-center justify-center",
  "font-medium",
  "transition-colors",
  "focus:outline-none",
  "disabled:bg-gray-200 disabled:pointer-events-none",
  "hover:cursor-pointer"
);

export const buttonVariants = cva(buttonCommonStyles, {
  variants: {
    btnType: {
      basic: "",
      nav: "rounded-md px-3.5 py-2 text-sm",
      tab: "px-4 py-2 text-sm font-medium rounded-sm",
      form: "",
      icon: "",
      form_s: "",
    },

    variant: {
      basic: "bg-gray-100 text-txtMain600",
      warning: "bg-red-500 text-white",
      success: "bg-green-500 text-white",
      new: "bg-main-300 text-white",
      list: "bg-main-100 text-black",
      white: "bg-white",
      primary: "bg-main-500",
    },

    isActive: {
      false: "",
      true: "",
    },

    hasIcon: {
      true: "gap-2",
      false: "",
    },
  },

  compoundVariants: [
    // ------------------------------------------------------------------
    // 기본 버튼
    // ------------------------------------------------------------------
    {
      btnType: "basic",
      className: "rounded-lg px-7 py-3 text-base font-semibold",
    },

    // ------------------------------------------------------------------
    // 네비게이션 버튼
    // ------------------------------------------------------------------
    {
      btnType: "nav",
      isActive: false,
      className: "bg-white text-black",
    },
    {
      btnType: "nav",
      isActive: true,
      className: "bg-main-200/40 font-semibold",
    },

    // ------------------------------------------------------------------
    // 탭 버튼
    // ------------------------------------------------------------------
    {
      btnType: "tab",
      isActive: false,
      className: "bg-white text-gray-600 border border-white",
    },
    {
      btnType: "tab",
      isActive: true,
      className: "bg-white text-[#6A929A] border border-main-300",
    },

    // ------------------------------------------------------------------
    // 폼 액션 버튼
    // ------------------------------------------------------------------
    {
      btnType: "form",
      className: "bg-main-500 px-6 py-2.5 rounded-xl text-white",
    },
    {
      btnType: "form_s",
      className: "text-sm bg-main-300 text-white px-3 py-1.5 rounded-sm",
    },

    // ------------------------------------------------------------------
    // 아이콘 버튼
    // ------------------------------------------------------------------
    {
      btnType: "icon",
      className:
        "w-8 h-8 block rounded-full border border-gray-200 font-medium",
    },
  ],

  defaultVariants: {
    btnType: "basic",
    variant: "basic",
    hasIcon: false,
    isActive: false,
  },
});

export type ButtonVariants = NonNullable<Parameters<typeof buttonVariants>[0]>;
