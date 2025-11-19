import { Icon } from "../Icon/Icon";
import { buttonVariants, ButtonVariants } from "./ButtonVariants";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  children?: React.ReactNode;
  icon?: string; // 아이콘명
  className?: string; // 추가 클래스
  size?: number; // 아이콘 사이즈
  color?: string; // 아이콘 색상
  // state?: "default" | "disabled";
}

export default function Button({
  children,
  icon,
  className,
  variant,
  btnType,
  size,
  color,
  isActive,
  hasIcon,
  ...props
}: ButtonProps) {
  // cva에 전달할 props만 선별
  const classes = buttonVariants({
    variant,
    hasIcon: hasIcon ?? !!icon,
    btnType,
    isActive,
    className,
  });

  return (
    <button className={classes} {...props}>
      {icon && <Icon type={icon} size={size} color={color} />}
      {children && <span>{children}</span>}
    </button>
  );
}
