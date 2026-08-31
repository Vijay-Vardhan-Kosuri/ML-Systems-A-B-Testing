import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label htmlFor={id || props.name} className="text-sm font-medium text-slate-700">{label}</label>}
      <input ref={ref} id={id || props.name} className={cn("input", error && "border-red-500", className)} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
