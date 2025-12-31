'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';

import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/utils/schemas';
import { passwordResetApi } from '@/features/member/api/member.api';
import { Button, Input } from '@/shared/components';

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const { error: apiError } = await passwordResetApi.forgotPassword(
      data.email
    );

    setIsLoading(false);

    if (apiError) {
      setError(apiError.message);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-cream to-sand">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-medium text-deep-brown">
            이메일을 확인해주세요
          </h2>
          <p className="text-soft-brown">
            비밀번호 재설정 링크를 보내드렸어요.
            <br />
            메일함을 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="이메일"
        type="email"
        placeholder="가입하신 이메일을 입력해주세요"
        {...register('email')}
        error={errors.email?.message}
      />

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <Button type="submit" isLoading={isLoading}>
        재설정 링크 보내기
      </Button>
    </form>
  );
}
