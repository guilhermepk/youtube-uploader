import { ReactNode } from "react";

export default function Flow2StepTemplate({
  children
}: { children: ReactNode }): React.JSX.Element {
  return (
    <div className="flex items-center justify-center p-4 h-[400px]">
      {children}
    </div>
  );
}
