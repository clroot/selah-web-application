import { useQuery } from '@tanstack/react-query';

import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';
import { PrayerTopicStatus } from '@/features/prayer-topic/types/prayerTopic.types';

interface HomeStats {
  prayingCount: number;
  answeredCount: number;
}

/**
 * 홈 화면 통계 조회 훅
 */
export function useHomeStats() {
  return useQuery({
    queryKey: ['home', 'stats'],
    queryFn: async (): Promise<HomeStats> => {
      // 기도 중/응답됨 상태별 개수 조회 (size: 1로 최소 데이터만 가져옴)
      const [prayingResult, answeredResult] = await Promise.all([
        prayerTopicApi.list({ status: PrayerTopicStatus.PRAYING, size: 1 }),
        prayerTopicApi.list({ status: PrayerTopicStatus.ANSWERED, size: 1 }),
      ]);

      return {
        prayingCount: prayingResult.data?.totalElements ?? 0,
        answeredCount: answeredResult.data?.totalElements ?? 0,
      };
    },
  });
}
