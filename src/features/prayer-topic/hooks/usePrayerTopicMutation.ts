'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCrypto } from '@/features/encryption/hooks';
import { prayerTopicApi } from '@/features/prayer-topic/api/prayerTopic.api';

/**
 * 기도제목 생성 훅
 *
 * 제목을 암호화하여 서버에 저장합니다.
 */
export function useCreatePrayerTopic() {
  const queryClient = useQueryClient();
  const { encryptData } = useCrypto();

  return useMutation({
    mutationFn: async (title: string) => {
      const encryptedTitle = await encryptData(title);
      const { data, error } = await prayerTopicApi.create({
        title: encryptedTitle,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

/**
 * 기도제목 수정 훅
 *
 * 제목을 암호화하여 서버에 저장합니다.
 */
export function useUpdatePrayerTopic() {
  const queryClient = useQueryClient();
  const { encryptData } = useCrypto();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const encryptedTitle = await encryptData(title);
      const { data, error } = await prayerTopicApi.update(id, {
        title: encryptedTitle,
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
 * 기도제목 삭제 훅
 */
export function useDeletePrayerTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await prayerTopicApi.delete(id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerTopics'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}
