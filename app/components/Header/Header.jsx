import { Link } from "lucide-react";
import { Icon } from "../Icon/Icon"

export function Header() {
  return (
    <header className="w-full h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center gap-2">
        <Icon type="board" size={22} className="text-main-500" />
        <span className="font-bold text-main-600 text-lg">Taskry</span>
      </div>

   
      {/* 오른쪽: 아이콘 영역 */}
      <div className="flex items-center gap-4">
        <Icon type="sunMoon" size={22} className="text-gray-600 hover:text-main-500" /> {/* 테마 */}
        <Icon type="userCircle" size={22} className="text-gray-600 hover:text-main-500" /> {/* 프로필 */}
      </div>
    </header>
  );
} 