// ButtonVariants.ts (개선 버전)
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

export const buttonCommonStyles = clsx(
  "inline-flex items-center justify-center",
  "font-medium",
  "transition-colors",
  "focus:outline-none",
  "disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:pointer-events-none disabled:text-gray-400 dark:disabled:text-gray-500",
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
      basic:
        "bg-gray-100 hover:bg-gray-200 text-txtMain600 dark:hover:bg-gray-200 dark:text-gray-700",
      warning:
        "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700",
      success:
        "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700",
      new: "bg-main-300 dark:bg-main-600 text-white hover:bg-main-400 dark:hover:bg-main-700",
      list: "bg-main-100 dark:bg-main-900/30 text-black dark:text-gray-200 hover:bg-main-200 dark:hover:bg-main-800/40",
      white:
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700",
      primary:
        "bg-main-500 dark:bg-main-600 text-white hover:bg-main-600 dark:hover:bg-main-700",
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
      className:
        "bg-white dark:bg-gray-800 text-black dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    {
      btnType: "nav",
      isActive: true,
      className:
        "bg-main-200/40 dark:bg-main-800/40 font-semibold text-gray-900 dark:text-gray-100",
    },

    // ------------------------------------------------------------------
    // 탭 버튼
    // ------------------------------------------------------------------
    {
      btnType: "tab",
      isActive: false,
      className:
        "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-white dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
    },
    {
      btnType: "tab",
      isActive: true,
      className:
        "bg-white dark:bg-gray-800 text-[#6A929A] dark:text-main-400 border border-main-300 dark:border-main-600",
    },

    // ------------------------------------------------------------------
    // 폼 액션 버튼
    // ------------------------------------------------------------------
    {
      btnType: "form",
      className:
        "bg-main-500 dark:bg-main-600 px-6 py-2.5 rounded-xl text-white hover:bg-main-600 dark:hover:bg-main-700",
    },
    {
      btnType: "form_s",
      className:
        "text-sm bg-main-300 dark:bg-main-600 text-white px-3 py-1.5 rounded-sm hover:bg-main-400 dark:hover:bg-main-700",
    },

    // ------------------------------------------------------------------
    // 아이콘 버튼
    // ------------------------------------------------------------------
    {
      btnType: "icon",
      className:
        "w-8 h-8 block rounded-full border border-gray-200 dark:border-gray-700 font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700",
    },
  ],

  defaultVariants: {
    btnType: "basic",
    variant: "basic",
    hasIcon: false,
    isActive: false,
  },
});

// export type ButtonVariants = NonNullable<Parameters<typeof buttonVariants>[0]>;
export type ButtonVariants = VariantProps<typeof buttonVariants>;
