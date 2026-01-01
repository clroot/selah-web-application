import { z } from "zod";

/**
 * 기도제목 생성/수정 폼 스키마
 */
export const prayerTopicFormSchema = z.object({
  title: z
    .string()
    .min(1, "기도제목을 입력해주세요")
    .max(200, "기도제목은 200자 이하여야 합니다"),
});

export type PrayerTopicFormData = z.infer<typeof prayerTopicFormSchema>;

/**
 * 응답 소감 폼 스키마
 */
export const reflectionFormSchema = z.object({
  reflection: z
    .string()
    .max(1000, "응답 소감은 1000자 이하여야 합니다")
    .optional(),
});

export type ReflectionFormData = z.infer<typeof reflectionFormSchema>;
