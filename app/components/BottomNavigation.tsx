// components/BottomNavigation.tsx

"use client";

type NavItem = "calendar" | "kanban" | "memo" | "project";

interface BottomNavigationProps {
  activeView: NavItem;
  onViewChange: (view: NavItem) => void;
}

const BottomNavigation = ({
  activeView,
  onViewChange,
}: BottomNavigationProps) => {
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="flex justify-center items-center gap-1 px-4 py-3">
        <button
          onClick={() => onViewChange("calendar")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
            activeView === "calendar"
              ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={`text-xs ${
              activeView === "calendar" ? "font-bold" : "font-medium"
            }`}
          >
            캘린더
          </span>
        </button>

        <button
          onClick={() => onViewChange("kanban")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
            activeView === "kanban"
              ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <span
            className={`text-xs ${
              activeView === "kanban" ? "font-bold" : "font-medium"
            }`}
          >
            칸반보드
          </span>
        </button>

        <button
          onClick={() => onViewChange("memo")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
            activeView === "memo"
              ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span
            className={`text-xs ${
              activeView === "memo" ? "font-bold" : "font-medium"
            }`}
          >
            메모
          </span>
        </button>

        <div className="h-8 w-px bg-gray-300 mx-1"></div>

        <button
          onClick={() => onViewChange("project")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-md border transition-all ${
            activeView === "project"
              ? "text-blue-600 bg-blue-50 border-2 border-blue-600"
              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span
            className={`text-xs ${
              activeView === "project" ? "font-bold" : "font-medium"
            }`}
          >
            프로젝트
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
