'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';
import { useCrypto } from '@/shared/hooks/useCrypto';

/**
 * 기도제목 응답 체크 훅
 *
 * 기도제목을 응답됨 상태로 변경하고 선택적으로 응답 소감을 저장합니다.
 */
export function useMarkAsAnswered() {
  const queryClient = useQueryClient();
  const { encryptData } = useCrypto();

  return useMutation({
    mutationFn: async ({
      id,
      reflection,
    }: {
      id: string;
      reflection?: string;
    }) => {
      const encryptedReflection = reflection
        ? await encryptData(reflection)
        : undefined;

      const { data, error } = await prayerTopicApi.markAsAnswered(id, {
        reflection: encryptedReflection,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
      queryClient.invalidateQueries({ queryKey: ['prayerTopics', id] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

/**
 * 기도제목 응답 취소 훅
 *
 * 응답됨 상태를 기도 중 상태로 되돌립니다.
 */
export function useCancelAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await prayerTopicApi.cancelAnswer(id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
      queryClient.invalidateQueries({ queryKey: ['prayerTopics', id] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

/**
 * 응답 소감 수정 훅
 */
export function useUpdateReflection() {
  const queryClient = useQueryClient();
  const { encryptData } = useCrypto();

  return useMutation({
    mutationFn: async ({
      id,
      reflection,
    }: {
      id: string;
      reflection: string | null;
    }) => {
      const encryptedReflection = reflection
        ? await encryptData(reflection)
        : null;

      const { data, error } = await prayerTopicApi.updateReflection(id, {
        reflection: encryptedReflection,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
      queryClient.invalidateQueries({ queryKey: ['prayerTopics', id] });
    },
  });
}
