import {
  primaryBgColor,
  primaryTextColor,
  primaryBorderColor,
  bgColorOpacity,
} from "../../sample/color/page";

// 배경 색상 정의
export const baseBgClasses = {
  // 회색, 빨간색, 초록색
  basic: primaryBgColor.Color2[0],
  warning: bgColorOpacity.colorOpacity2[0],
  success: bgColorOpacity.colorOpacity3[0],
  // 포인트 컬러
  bgMain100: primaryBgColor.color1[0],
  bgMain200: primaryBgColor.color1[1],
  bgMain300: primaryBgColor.color1[2],
  bgMain400: primaryBgColor.color1[3],
  bgMain500: primaryBgColor.color1[4],
  bgMain600: primaryBgColor.color1[5],
  //
  lightMain40: bgColorOpacity.colorOpacity[2],
  //
  lightRed40: bgColorOpacity.colorOpacity2[2],
  lightRed100: bgColorOpacity.colorOpacity2[0],

  white: "bg-[#ffffff]",
};

// 사이즈 정의(padding, font-size 등)
export const baseSizeClasses = {
  sm: "px-3 py-2 text-sm font-medium",
  base: "px-7 py-3 text-base font-medium",
  full: "p-3",
};

// border-radius 정의
export const baseRadiusClasses = {
  sm: "rounded-sm",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// 텍스트 색상 정의
export const baseTextColorClasses = {
  txtMain600: primaryTextColor.color1[5],
  white: "text-[#ffffff]",
  lightRed100: bgColorOpacity.colorOpacity2[0],
};

// 테두리 정의
export const borderClasses = {
  basic: "border-1",
};

// 테두리 색상 정의
export const borderColorClasses = {
  base: `border-[${primaryBorderColor.color1[0]}]`,
  bgMain300: `border-[${primaryBgColor.color1[2]}]`,
};

// 아이콘 사이즈 정의
export const iconSizeClasses = {
  sm: "size-4",
};

// 아이콘 색상 정의
export const iconColorClasses = {
  lightRed100: bgColorOpacity.colorOpacity2[0],
};
