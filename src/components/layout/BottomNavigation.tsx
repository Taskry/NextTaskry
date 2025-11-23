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
  const navItems = [
    {
      id: "calendar" as NavItem,
      label: "캘린더",
      icon: (
        <svg
          className="w-5 h-5 rounded"
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
      ),
    },
    {
      id: "kanban" as NavItem,
      label: "칸반보드",
      icon: (
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
      ),
    },
    {
      id: "memo" as NavItem,
      label: "메모",
      icon: (
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
      ),
    },
  ];

  return (
    <div className="border-t bg-white dark:bg-gray-900 shadow-lg h-16">
      <div className="flex justify-center h-full items-center">
        {navItems.map((item) => {
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                relative flex flex-col items-center gap-1 px-8 py-2
                transition-colors duration-200
                ${
                  isActive
                    ? "text-main-200 hover:text-main-200/50 dark:text-main-400 dark:hover:text-main-300"
                    : "text-main-400 hover:text-main-400/50 dark:text-gray-400 dark:hover:text-gray-200"
                }
              `}
            >
              {item.icon}
              <span
                className={`text-xs ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>

              {/* 하단 보더 */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-main-200 dark:bg-main-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
