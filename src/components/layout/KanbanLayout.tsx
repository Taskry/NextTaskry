"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import MemoView from "@/components/features/kanban/MemoView";

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
  projectId: string;
  initialShowMemoPanel?: boolean;
}

export default function KanbanLayout({
  children,
  projectId,
  initialShowMemoPanel = false,
}: KanbanLayoutProps) {
  const [showMemoPanel, setShowMemoPanel] = useState(initialShowMemoPanel);

  const toggleMemoPanel = (show?: boolean) => {
    setShowMemoPanel((prev) => (show !== undefined ? show : !prev));
  };

  return (
    <KanbanLayoutContext.Provider value={{ showMemoPanel, toggleMemoPanel }}>
      <div className="flex h-full w-full overflow-hidden gap-2 md:gap-4">
        {/* 칸반 영역 */}
        <main
          className={`
            h-full flex flex-col transition-all duration-300 min-w-0
            ${showMemoPanel ? "flex-1 lg:flex-[0.65] xl:flex-[0.7]" : "flex-1"}
          `}
        >
          {children}
        </main>

        {/* 메모 패널 */}
        <aside
          className={`
            h-full transition-all duration-300 overflow-hidden
            ${
              showMemoPanel
                ? "w-[280px] sm:w-[320px] md:w-[360px] lg:flex-[0.35] xl:flex-[0.3] min-w-[280px] max-w-[400px] lg:max-w-none opacity-100"
                : "w-0 opacity-0"
            }
          `}
        >
          {showMemoPanel && <MemoView projectId={projectId} />}
        </aside>
      </div>
    </KanbanLayoutContext.Provider>
  );
}
