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
    <section className="p-6 rounded-xl bg-[#FAFAFA] border border-border dark:bg-[#171415]">
      <div className="py-8 px-5 bg-background border border-border rounded-xl ">
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
