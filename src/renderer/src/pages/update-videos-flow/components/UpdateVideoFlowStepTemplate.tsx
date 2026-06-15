import { ReactNode } from "react";

export default function UpdateVideoFlowStepTemplate({
  children
}: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-4 h-[400px]">
      {children}
    </div>
  );
}
