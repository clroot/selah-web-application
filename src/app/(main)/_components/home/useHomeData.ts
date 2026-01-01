import { useQuery } from '@tanstack/react-query';

import { prayerApi } from '@/features/prayer/api/prayer.api';
import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';
import { PrayerTopicStatus } from '@/features/prayer-topic/types/prayerTopic.types';
import { useCrypto } from '@/shared/hooks/useCrypto';

import type { Prayer } from '@/features/prayer/types/prayer.types';
import type { PrayerTopic } from '@/features/prayer-topic/types/prayerTopic.types';

interface HomeData {
  prayerTopics: PrayerTopic[];
  recentPrayers: Prayer[];
}

/**
 * 홈 화면 프리뷰 데이터 조회 훅
 */
export function useHomeData() {
  const { decryptData, isUnlocked } = useCrypto();

  return useQuery({
    queryKey: ['home', 'preview'],
    queryFn: async (): Promise<HomeData> => {
      const [topicsResult, prayersResult] = await Promise.all([
        prayerTopicApi.list({ status: PrayerTopicStatus.PRAYING, size: 5 }),
        prayerApi.list({ size: 3 }),
      ]);

      const topics = topicsResult.data?.content ?? [];
      const prayers = prayersResult.data?.content ?? [];

      // 복호화
      const [decryptedTopics, decryptedPrayers] = await Promise.all([
        Promise.all(
          topics.map(async (topic) => ({
            ...topic,
            title: await decryptData(topic.title),
            reflection: topic.reflection
              ? await decryptData(topic.reflection)
              : null,
          }))
        ),
        Promise.all(
          prayers.map(async (prayer) => ({
            ...prayer,
            content: await decryptData(prayer.content),
          }))
        ),
      ]);

      return {
        prayerTopics: decryptedTopics,
        recentPrayers: decryptedPrayers,
      };
    },
    enabled: isUnlocked,
  });
}
