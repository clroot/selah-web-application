"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  type PrayerTopicFormData,
  prayerTopicFormSchema,
} from "@/features/prayer-topic/utils/schemas";
import { Button } from "@/shared/components";
import { cn } from "@/shared/lib/utils";

interface PrayerTopicFormProps {
  initialData?: PrayerTopicFormData;
  onSubmit: (data: PrayerTopicFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  className?: string;
}

/**
 * 기도제목 생성/수정 폼 컴포넌트
 *
 * 기도제목 입력을 위한 폼을 제공합니다.
 * 생성과 수정 모드 모두 지원합니다.
 */
export function PrayerTopicForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "저장",
  className,
}: PrayerTopicFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch: useWatch,
  } = useForm<PrayerTopicFormData>({
    resolver: zodResolver(prayerTopicFormSchema),
    defaultValues: initialData ?? { title: "" },
  });

  // initialData가 변경되면 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const title = useWatch("title");
  const characterCount = title?.length ?? 0;
  const isDisabled = isSubmitting || isLoading;

  const handleFormSubmit = async (data: PrayerTopicFormData) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("flex flex-col gap-4", className)}
    >
      {/* 기도제목 입력 */}
      <div className="flex flex-col gap-2">
        <textarea
          {...register("title")}
          placeholder="기도제목을 입력하세요..."
          rows={4}
          disabled={isDisabled}
          className={cn(
            "w-full resize-none rounded-xl border-2 p-4",
            "font-serif text-base leading-relaxed text-deep-brown",
            "placeholder:text-soft-brown/50",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-sand focus:border-deep-brown focus:ring-deep-brown",
          )}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />

        {/* 글자 수 및 에러 메시지 */}
        <div className="flex items-center justify-between px-1">
          {errors.title ? (
            <p id="title-error" className="text-sm text-red-500" role="alert">
              {errors.title.message}
            </p>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "text-xs",
              characterCount > 180 ? "text-red-500" : "text-soft-brown/60",
            )}
          >
            {characterCount}/200
          </span>
        </div>
      </div>

      {/* 제출 버튼 */}
      <Button type="submit" isLoading={isDisabled}>
        {submitLabel}
      </Button>
    </form>
  );
}
