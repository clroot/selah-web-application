"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { prayerApi } from "@/features/prayer/api/prayer.api";
import { useCrypto } from "@/shared/hooks/useCrypto";

import type {
  CreatePrayerRequest,
  UpdatePrayerRequest,
} from "@/features/prayer/types/prayer.types";

/**
 * 기도문 생성 훅
 */
export function useCreatePrayer() {
  const { encryptData } = useCrypto();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePrayerRequest) => {
      // content 암호화
      const encryptedContent = await encryptData(data.content);

      const { data: result, error } = await prayerApi.create({
        ...data,
        content: encryptedContent,
      });

      if (error) {
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
}

/**
 * 기도문 수정 훅
 */
export function useUpdatePrayer() {
  const { encryptData } = useCrypto();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePrayerRequest;
    }) => {
      // content 암호화
      const encryptedContent = await encryptData(data.content);

      const { data: result, error } = await prayerApi.update(id, {
        content: encryptedContent,
        prayerTopicIds: data.prayerTopicIds,
      });

      if (error) {
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
      queryClient.invalidateQueries({ queryKey: ["prayer", variables.id] });
    },
  });
}

/**
 * 기도문 삭제 훅
 */
export function useDeletePrayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await prayerApi.delete(id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayers"] });
    },
  });
}
