import { Icon } from "../Icon/Icon";

import {
  baseBgClasses,
  baseSizeClasses,
  baseRadiusClasses,
  baseTextColorClasses,
  borderClasses, 
  borderColorClasses,
  iconSizeClasses,
  iconColorClasses,
} from "./Button.styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: string;
  iconSize?: "sm";
  iconColor?: "lightRed100";
  variant?:
    | "basic"
    | "warning"
    | "success"
    | "bgMain100"
    | "bgMain200"
    | "bgMain300"
    | "bgMain400"
    | "bgMain500"
    | "bgMain600"
    | "lightMain40"
    | "lightRed40"
    | "lightRed100"
    | "white";
  size?: "sm" | "base" | "full";
  radius?: "sm" | "lg" | "xl" | "full";
  textColor?: "txtMain600" | "white" | "lightRed100";
  border?: string;
  borderColor?: string;
}
// 1. 버튼이 받을 수 있는 속성 정의
export default function Button({
  children,
  icon,
  iconSize = "sm",
  iconColor = "lightRed100",
  variant = "basic",
  size = "sm",
  radius = "sm",
  textColor = "txtMain600",
  border = "",
  borderColor = "",
  className = "", // 추가로 적용할 클래스
  ...props // 그 외 나머지 속성
}: ButtonProps) {
  // ## 전체 아우르는 클래스 조합
  const allButtonClasses = `${baseBgClasses[variant]} ${
    baseSizeClasses[size]
  } ${baseRadiusClasses[radius]} ${borderClasses[border]} ${
    borderColorClasses[borderColor]
  } ${baseTextColorClasses[textColor]}  ${
    icon ? "inline-flex items-center gap-2" : ""
  } ${className}`;

  // ## 버튼 컴포넌트 렌더링
  return (
    <button className={allButtonClasses} {...props}>
      {icon && (
        <Icon
          type={icon}
          className={`${iconSizeClasses[iconSize]}`} // svg 사이즈도 설정한 대로 바꾸고 싶은데 안 됨...
          style={{
            stroke: iconColorClasses[iconColor],
            width: iconSizeClasses[iconSize],
            height: iconSizeClasses[iconSize],
          }} // stroke 색상도 바꾸고 싶은데 잘 안 됨
        />
      )}{" "}
      {children && <span>{children}</span>}
    </button>
  );
}
