import { Icon } from "@/components/shared/Icon";
import { ReactNode } from "react";

interface pageWrapperProps {
  children: ReactNode;
  title: string;
  titleIcon: string;
  action?: ReactNode;
}

export default function AdminPageWrapper({
  children,
  title,
  titleIcon,
  action,
}: pageWrapperProps) {
  return (
    <section className="bg-[#fafafa] p-8 rounded-xl dark:bg-[#1A1A1A]">
      <div className="bg-[#ffffff] py-8 px-5 rounded-xl dark:bg-transparent dark:border">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Icon type={titleIcon} />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          {action && <div>{action}</div>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
