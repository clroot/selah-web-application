"use client";

import { ChangeEvent, ClipboardEvent, forwardRef, useCallback } from "react";

import { cn } from "@/shared/lib/utils";

const RECOVERY_KEY_LENGTH = 64;
const GROUP_SIZE = 4;
const TOTAL_GROUPS = RECOVERY_KEY_LENGTH / GROUP_SIZE;

interface RecoveryKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface RecoveryKeyInputHandle {
  clear: () => void;
  focus: () => void;
}

function formatWithHyphens(hex: string): string {
  const groups: string[] = [];
  for (let i = 0; i < hex.length; i += GROUP_SIZE) {
    groups.push(hex.slice(i, i + GROUP_SIZE));
  }
  return groups.join("-");
}

function removeHyphens(formatted: string): string {
  return formatted.replace(/-/g, "").toUpperCase();
}

function isValidHexChar(char: string): boolean {
  return /^[0-9A-Fa-f]$/.test(char);
}

export const RecoveryKeyInput = forwardRef<
  HTMLTextAreaElement,
  RecoveryKeyInputProps
>(function RecoveryKeyInput(
  { value, onChange, disabled = false, error, className },
  ref,
) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const raw = removeHyphens(e.target.value);
      const filtered = raw
        .split("")
        .filter(isValidHexChar)
        .slice(0, RECOVERY_KEY_LENGTH)
        .join("")
        .toUpperCase();

      onChange(formatWithHyphens(filtered));
    },
    [onChange],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");
      const raw = removeHyphens(pastedData);
      const filtered = raw
        .split("")
        .filter(isValidHexChar)
        .slice(0, RECOVERY_KEY_LENGTH)
        .join("")
        .toUpperCase();

      onChange(formatWithHyphens(filtered));
    },
    [onChange],
  );

  const rawLength = removeHyphens(value).length;
  const isComplete = rawLength === RECOVERY_KEY_LENGTH;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        disabled={disabled}
        rows={3}
        placeholder="XXXX-XXXX-XXXX-..."
        className={cn(
          "w-full rounded-lg border-2 p-3 font-mono text-sm",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-[var(--color-deep-brown)] focus:ring-[var(--color-deep-brown)]",
          "bg-white text-deep-brown",
        )}
        aria-label="복구 키 입력"
        aria-invalid={!!error}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
      />

      <div className="flex items-center justify-between text-sm">
        <span className={cn(error ? "text-red-500" : "text-soft-brown")}>
          {error || `${TOTAL_GROUPS}개 그룹 (${GROUP_SIZE}자리씩)`}
        </span>
        <span
          className={cn(
            "font-mono",
            isComplete ? "text-green-600" : "text-soft-brown",
          )}
        >
          {rawLength}/{RECOVERY_KEY_LENGTH}
        </span>
      </div>
    </div>
  );
});
