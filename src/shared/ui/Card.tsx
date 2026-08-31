import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
  padding?: boolean;
}

export function Card({ className, title, description, action, padding = true, children, ...props }: CardProps) {
  return (
    <div className={cn("card", className)} {...props}>
      {(title || action) && (
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(padding && "p-5")}>{children}</div>
    </div>
  );
}
