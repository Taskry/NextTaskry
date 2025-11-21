"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import MemoPanel from "@/components/features/kanban/MemoPanel";

interface KanbanLayoutContextType {
  showMemoPanel: boolean;
  toggleMemoPanel: (show?: boolean) => void;
}

const KanbanLayoutContext = createContext<KanbanLayoutContextType | undefined>(
  undefined
);

export const useKanbanLayout = () => {
  const context = useContext(KanbanLayoutContext);
  if (!context) {
    throw new Error("useKanbanLayout must be used within KanbanLayout");
  }
  return context;
};

interface KanbanLayoutProps {
  children: ReactNode;
  initialShowMemoPanel?: boolean;
}

export default function KanbanLayout({
  children,
  initialShowMemoPanel = false,
}: KanbanLayoutProps) {
  const [showMemoPanel, setShowMemoPanel] = useState(initialShowMemoPanel);

  const toggleMemoPanel = (show?: boolean) => {
    setShowMemoPanel((prev) => (show !== undefined ? show : !prev));
  };

  return (
    <KanbanLayoutContext.Provider value={{ showMemoPanel, toggleMemoPanel }}>
      {/* 여기 wrapper가 max-width를 담당해야 함 */}
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-[1400px] overflow-hidden">
          {/* 칸반 영역 */}
          <main
            className={`
              h-full flex flex-col transition-all duration-300 min-w-0
              ${showMemoPanel ? "flex-[0.75]" : "flex-1"}
            `}
          >
            {children}
          </main>

          {/* 메모 패널 */}
          <aside
            className={`
              h-full transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white
              ${showMemoPanel ? "flex-[0.25] opacity-100" : "flex-0 opacity-0"}
            `}
          >
            {showMemoPanel && <MemoPanel />}
          </aside>
        </div>
      </div>
    </KanbanLayoutContext.Provider>
  );
}
