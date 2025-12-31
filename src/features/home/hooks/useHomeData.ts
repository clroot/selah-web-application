import { useQuery } from '@tanstack/react-query';

import { prayerApi } from '@/features/prayer/api/prayer.api';
import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';
import { PrayerTopicStatus } from '@/features/prayer-topic/types/prayerTopic.types';

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
  return useQuery({
    queryKey: ['home', 'preview'],
    queryFn: async (): Promise<HomeData> => {
      const [topicsResult, prayersResult] = await Promise.all([
        prayerTopicApi.list({ status: PrayerTopicStatus.PRAYING, size: 5 }),
        prayerApi.list({ size: 3 }),
      ]);

      return {
        prayerTopics: topicsResult.data?.content ?? [],
        recentPrayers: prayersResult.data?.content ?? [],
      };
    },
  });
}
