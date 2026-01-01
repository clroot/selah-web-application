import { z } from "zod";

/**
 * 기도문 폼 스키마
 */
export const prayerFormSchema = z.object({
  content: z
    .string()
    .min(1, "기도문을 입력해주세요")
    .max(10000, "기도문은 10,000자까지 입력할 수 있습니다"),
  prayerTopicIds: z.array(z.string()),
});

export type PrayerFormData = z.infer<typeof prayerFormSchema>;
