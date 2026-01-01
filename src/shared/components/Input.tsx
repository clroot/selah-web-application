"use client";

import { forwardRef, useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, showPasswordToggle, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-xs font-medium text-soft-brown">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full border-b border-sand bg-transparent py-3 text-deep-brown",
              "placeholder:text-warm-beige",
              "focus:border-soft-brown focus:outline-none",
              "transition-colors duration-200",
              error && "border-red-500 focus:border-red-500",
              isPassword && showPasswordToggle && "pr-10",
              className,
            )}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-soft-brown hover:text-deep-brown"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
