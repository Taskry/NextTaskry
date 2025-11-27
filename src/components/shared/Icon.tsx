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
  TbCircle,
  TbCircleCheck,
  TbCircleCheckFilled,
  TbInfoCircle,
  TbCirclePlus,
  TbCirclePlusFilled,
  TbSquareCheck,
  TbSquareCheckFilled,
  TbAlertCircleFilled,
} from "react-icons/tb";

// etc
import {
  TbX,
  TbPlus,
  TbBrandGoogleFilled,
  TbChevronRight,
  TbChevronLeft,
  TbBellFilled,
  TbSpeakerphone,
  TbInbox,
  TbClipboard,
  TbLoader,
  TbList,
  TbDeviceFloppy,
} from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiImageSquare } from "react-icons/pi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { TbDots, TbDotsVertical } from "react-icons/tb";
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
  squareCheckFilled: TbSquareCheckFilled,
  folder: TbFolder,

  //circle
  circle: TbCircle,
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
  arrowLeft: TbChevronLeft,
  chevronRight: TbChevronRight,
  eye: IoEye,
  imageSquare: PiImageSquare,
  speakerPhone: HiOutlineSpeakerphone,
  dot: TbDots,
  dotsVertical: TbDotsVertical,
  description: GrTextAlignFull,
  bellFilled: TbBellFilled,
  speakerphone: TbSpeakerphone,
  inbox: TbInbox,
  clipboard: TbClipboard,
  loading: TbLoader,
  list: TbList,
  deviceFloppy: TbDeviceFloppy,
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

const Icon = ({ type, size = 24, color, className = "" }: IconProps) => {
  const iconType = type ? type : "x";
  const IconComponent = ICON_MAP[iconType];

  // 아이콘이 정의되지 않은 경우 기본 아이콘 반환
  if (!IconComponent) {
    console.warn(
      `Icon "${iconType}" not found in ICON_MAP. Using default "x" icon.`
    );
    return <TbX size={size} color={color} className={className} />;
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export { Icon };
