import { Icon } from "@/components/shared/Icon";

// 모든 토스트에 공통으로 적용될 기본 클래스
export const BASE_TOAST_CLASSNAME = `
  !py-2.5 !pl-4 !pr-3 
  font-semibold !text-lg !text-white
  !shadow-none !m-0
  shadow-sm
`;

// 모든 토스트에 공통으로 적용될 기본 css
export const BASE_TOAST_STYLE = {
  color: "#fff",
};

// 타입별 속성
export const TOAST_COLORS = {
  success: {
    background: "#79C98D",
  },
  error: {
    background: "#F26969",
  },
  deleted: {
    background: "#F26969",
  },
  alert: {
    background: "#F26969",
  },
};

export const ICON_MAP = {
  success: <Icon type="circleCheckFilled" size={32} />,
  error: <Icon type="alertTriangle" size={32} />,
  deleted: <Icon type="trash" size={32} />,
  alert: <Icon type="alertCircleFilled" size={32} />,
};
