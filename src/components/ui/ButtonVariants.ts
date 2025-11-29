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
      basic: "text-foreground px-7 py-3 rounded-lg font-semibold",
      nav: "rounded-md px-3.5 py-2 text-sm",
      tab: "px-4 py-2 text-sm font-medium rounded-sm",
      form: "",
      icon: "w-8 h-8 block rounded-full border bg-transparent",
      form_s: "text-sm px-3 py-1.5 rounded-sm",
    },

    variant: {
      basic: "",
      warning: "",
      success: "",
      new: "",
      list: "",
      white: "",
      primary: "",
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
      variant: "basic",
      className: `
      text-foreground bg-gray-100 hover:bg-gray-200/60
      dark:text-black dark:hover:bg-gray-100/80`,
    },
    {
      btnType: "basic",
      variant: "primary",
      className: "text-white bg-main-500 hover:bg-main-600",
    },
    {
      btnType: "basic",
      variant: "warning",
      className: `
      text-white bg-destructive/80 hover:bg-destructive
      `,
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
      className: `text-white 
        bg-main-300 hover:bg-main-400 
        dark:bg-main-600 dark:hover:bg-main-600/40`,
    },

    // ------------------------------------------------------------------
    // 아이콘 버튼
    // ------------------------------------------------------------------
    {
      btnType: "icon",
      variant: "warning",
      className:
        "border border-destructive/40 hover:bg-destructive/20 text-destructive",
    },
    {
      btnType: "icon",
      variant: "primary",
      className: `
      border border-main-200 
      hover:bg-main-200/40
      text-main-300
      dark:border-main-200/40`,
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
