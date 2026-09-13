"use client";

import * as React from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** A labeled input with a leading icon and an inline error message. */
export const IconField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { icon: LucideIcon; label: string; error?: string }
>(({ icon: Icon, label, error, className, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-lg pl-10",
            error && "border-red-400 focus-visible:ring-red-200",
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
});
IconField.displayName = "IconField";

/** Same as IconField, but with a show/hide toggle for password entry. */
export const PasswordField = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { icon: LucideIcon; label: string; error?: string }
>(({ icon: Icon, label, error, className, id, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 rounded-lg pl-10 pr-10",
            error && "border-red-400 focus-visible:ring-red-200",
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
});
PasswordField.displayName = "PasswordField";
