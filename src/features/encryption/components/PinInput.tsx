"use client";

import {
  ClipboardEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/lib/utils";

const PIN_LENGTH = 6;
const MASK_DELAY_MS = 500; // 입력 후 마스킹까지 대기 시간

interface PinInputProps {
  onComplete: (pin: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

export interface PinInputHandle {
  clear: () => void;
  focus: () => void;
}

/**
 * 6자리 PIN 입력 컴포넌트
 *
 * 각 자리를 개별 입력 필드로 표시하며, 자동으로 다음 필드로 이동합니다.
 * 보안을 위해 이전에 입력한 숫자는 마스킹됩니다.
 */
export const PinInput = forwardRef<PinInputHandle, PinInputProps>(
  function PinInput(
    { onComplete, disabled = false, error, className, autoFocus = false },
    ref,
  ) {
    const [values, setValues] = useState<string[]>(Array(PIN_LENGTH).fill(""));
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const maskTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (maskTimeoutRef.current) {
          clearTimeout(maskTimeoutRef.current);
        }
      };
    }, []);

    // autoFocus 시 첫 번째 입력에 포커스
    useEffect(() => {
      if (autoFocus && !disabled) {
        // 약간의 딜레이를 주어 렌더링 완료 후 포커스
        const timer = setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [autoFocus, disabled]);

    // 부모 컴포넌트에서 호출할 수 있는 메서드 노출
    useImperativeHandle(ref, () => ({
      clear: () => {
        setValues(Array(PIN_LENGTH).fill(""));
        setVisibleIndex(null);
        inputRefs.current[0]?.focus();
      },
      focus: () => {
        inputRefs.current[0]?.focus();
      },
    }));

    const focusInput = useCallback((index: number) => {
      if (index >= 0 && index < PIN_LENGTH) {
        inputRefs.current[index]?.focus();
      }
    }, []);

    const handleChange = useCallback(
      (index: number, value: string) => {
        // 숫자만 허용
        const digit = value.replace(/\D/g, "").slice(-1);

        const newValues = [...values];
        newValues[index] = digit;
        setValues(newValues);

        // 입력값이 있으면 잠시 보여주고 마스킹
        if (digit) {
          // 이전 타이머 취소
          if (maskTimeoutRef.current) {
            clearTimeout(maskTimeoutRef.current);
          }

          // 현재 인덱스를 visible로 설정
          setVisibleIndex(index);

          // 일정 시간 후 마스킹
          maskTimeoutRef.current = setTimeout(() => {
            setVisibleIndex(null);
          }, MASK_DELAY_MS);

          // 다음 필드로 이동
          if (index < PIN_LENGTH - 1) {
            focusInput(index + 1);
          }
        }

        // 모든 자리 입력 완료 시 콜백 호출
        const pin = newValues.join("");
        if (pin.length === PIN_LENGTH && !newValues.includes("")) {
          onComplete(pin);
        }
      },
      [values, focusInput, onComplete],
    );

    const handleKeyDown = useCallback(
      (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
          if (!values[index] && index > 0) {
            // 현재 필드가 비어있으면 이전 필드로 이동
            focusInput(index - 1);
          }
        } else if (e.key === "ArrowLeft" && index > 0) {
          focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
          focusInput(index + 1);
        }
      },
      [values, focusInput],
    );

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const digits = pastedData.replace(/\D/g, "").slice(0, PIN_LENGTH);

        if (digits.length > 0) {
          const newValues = [...values];
          for (let i = 0; i < digits.length; i++) {
            newValues[i] = digits[i];
          }
          setValues(newValues);

          // 마지막 입력 필드로 포커스 이동
          const lastIndex = Math.min(digits.length, PIN_LENGTH) - 1;
          focusInput(lastIndex);

          // 모든 자리 입력 완료 시 콜백 호출
          if (digits.length === PIN_LENGTH) {
            onComplete(digits);
          }
        }
      },
      [values, focusInput, onComplete],
    );

    const handleFocus = useCallback((index: number) => {
      // 입력값이 있으면 선택
      inputRefs.current[index]?.select();
    }, []);

    // 표시할 값 계산 (마스킹 적용)
    const getDisplayValue = useCallback(
      (index: number): string => {
        const value = values[index];
        if (!value) return "";
        // visibleIndex와 같으면 실제 값 표시, 아니면 마스킹
        return index === visibleIndex ? value : "•";
      },
      [values, visibleIndex],
    );

    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="flex gap-2">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <div key={index} className="relative">
              {/* 실제 입력 필드 (숨김) */}
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={values[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => handleFocus(index)}
                disabled={disabled}
                className={cn(
                  "h-14 w-12 rounded-lg border-2 text-center text-2xl font-semibold",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[var(--color-deep-brown)] focus:ring-[var(--color-deep-brown)]",
                  "bg-white text-transparent caret-deep-brown",
                )}
                aria-label={`PIN ${index + 1}번째 자리`}
              />
              {/* 마스킹된 값 표시 (오버레이) */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center",
                  "text-2xl font-semibold text-deep-brown",
                )}
              >
                {getDisplayValue(index)}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
