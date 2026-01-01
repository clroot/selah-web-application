'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  prayerFormSchema,
  type PrayerFormData,
} from '@/features/prayer/utils/schemas';
import { Button } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { PrayerTopicSelector } from './PrayerTopicSelector';

interface PrayerTopic {
  id: string;
  title: string;
}

interface PrayerEditorProps {
  initialData?: PrayerFormData;
  onSubmit: (data: PrayerFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  showTopicSelector?: boolean;
  prayerTopics?: PrayerTopic[];
  isLoadingTopics?: boolean;
  className?: string;
}

/**
 * 기도문 작성/수정 에디터 컴포넌트
 */
export function PrayerEditor({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = '저장',
  showTopicSelector = true,
  prayerTopics = [],
  isLoadingTopics = false,
  className,
}: PrayerEditorProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PrayerFormData>({
    resolver: zodResolver(prayerFormSchema),
    defaultValues: initialData ?? { content: '', prayerTopicIds: [] },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const isDisabled = isSubmitting || isLoading;

  const handleFormSubmit = async (data: PrayerFormData) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('flex flex-col gap-6', className)}
    >
      {/* 기도제목 선택 */}
      {showTopicSelector && (
        <Controller
          name="prayerTopicIds"
          control={control}
          render={({ field }) => (
            <PrayerTopicSelector
              selectedIds={field.value}
              onChange={field.onChange}
              prayerTopics={prayerTopics}
              isLoading={isLoadingTopics}
            />
          )}
        />
      )}

      {/* 기도문 입력 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-soft-brown">기도문</label>
        <textarea
          {...register('content')}
          placeholder="오늘의 기도문을 작성해보세요..."
          rows={12}
          disabled={isDisabled}
          className={cn(
            'w-full resize-none rounded-2xl border p-5',
            'font-serif text-[17px] leading-loose text-deep-brown',
            'placeholder:text-soft-brown/40',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            errors.content
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-sand focus:border-sand-dark focus:ring-deep-brown'
          )}
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <p id="content-error" className="text-sm text-red-500" role="alert">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <Button type="submit" isLoading={isDisabled}>
        {submitLabel}
      </Button>
    </form>
  );
}
