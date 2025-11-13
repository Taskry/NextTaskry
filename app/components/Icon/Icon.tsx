// Theme
import { TbSun, TbMoon, TbSunMoon } from "react-icons/tb";

// User
import { TbUsers, TbUserPlus, TbUserCircle, TbUserCheck } from "react-icons/tb";

// CRUD?
import { TbPencil, TbEdit, TbTrash, TbAlertTriangle } from "react-icons/tb";

// Calendar & Clock
import {
  TbCalendar,
  TbCalendarStar,
  TbCalendarCheck,
  TbCalendarShare,
  TbCalendarPlus,
  TbCalendarEventFilled,
} from "react-icons/tb";
import { TbClock } from "react-icons/tb";

// search
import { TbSearch, TbFilter } from "react-icons/tb";

// project
import {
  TbLayoutBoard,
  TbNotes,
  TbChecklist,
  TbDetails,
  TbLayoutKanbanFilled,
  TbProgressAlert,
  TbFolder,
} from "react-icons/tb";

// check
import {
  TbCircleCheck,
  TbCircleCheckFilled,
  TbInfoCircle,
  TbCirclePlus,
  TbCirclePlusFilled,
  TbSquareCheck,
  TbAlertCircleFilled,
} from "react-icons/tb";

// etc
import { TbX, TbPlus, TbBrandGoogleFilled, TbBellFilled } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiImageSquare } from "react-icons/pi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { TbDots } from "react-icons/tb";
import { GrTextAlignFull } from "react-icons/gr";
import { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  //Theme
  sun: TbSun,
  moon: TbMoon,
  sunMoon: TbSunMoon,

  //User
  users: TbUsers,
  userPlus: TbUserPlus,
  userCircle: TbUserCircle,
  userCheck: TbUserCheck,

  //CRUD?
  pencil: TbPencil,
  edit: TbEdit,
  trash: TbTrash,
  alertTriangle: TbAlertTriangle,

  //Calendar & Clock
  calendar: TbCalendar,
  calendarPlus: TbCalendarPlus,
  calendarCheck: TbCalendarCheck,
  calendarShare: TbCalendarShare,
  calendarStar: TbCalendarStar,
  calendarEvent: TbCalendarEventFilled,
  clock: TbClock,

  // search
  search: TbSearch,
  filter: TbFilter,

  //project
  board: TbLayoutBoard,
  notes: TbNotes,
  checkList: TbChecklist,
  details: TbDetails,
  kanban: TbLayoutKanbanFilled,
  squareCheck: TbSquareCheck,
  folder: TbFolder,

  //circle
  circleCheck: TbCircleCheck,
  circleCheckFilled: TbCircleCheckFilled,
  circleInfo: TbInfoCircle,
  circlePlus: TbCirclePlus,
  circlePlusFilled: TbCirclePlusFilled,
  progressAlert: TbProgressAlert,
  alertCircleFilled: TbAlertCircleFilled,

  // etc
  x: TbX,
  plus: TbPlus,
  google: TbBrandGoogleFilled,
  arrowDown: IoIosArrowDown,
  eye: IoEye,
  imageSquare: PiImageSquare,
  speakerPhone: HiOutlineSpeakerphone,
  dot: TbDots,
  description: GrTextAlignFull,
  bellFilled: TbBellFilled,
};

type IconTypeKeys = keyof typeof ICON_MAP;

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  // type prop의 기본값 'x'는 ICON_MAP의 유효한 키여야 합니다.
  // 여기서는 'x'가 ICON_MAP에 정의되어 있으므로 문제 없습니다.
  type?: IconTypeKeys;
  size?: number;
  color?: string;
  props?: any;
  className?: string;
}

const Icon = ({
  type, // type의 기본값으로 'x' 설정
  size = 24,
  color, // color의 기본값으로 'gray' 설정
  className = "",
  ...props
}: IconProps) => {
  const iconType = type ? type : "x";
  const IconComponent = ICON_MAP[iconType]; // type에 맞는 아이콘이 없으면 TbX를 기본으로 사용

  return <IconComponent size={size} color={color} className={className} />;
};

export { Icon };
