'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { passwordResetApi } from '@/features/member/api/member.api';
import { PasswordStrengthMeter } from '@/features/member/components/PasswordStrengthMeter';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from '@/features/member/utils/schemas';
import { Button, Input, FullPageSpinner } from '@/shared/components';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const password = watch('password', '');

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }

    async function validateToken() {
      const { data, error } = await passwordResetApi.validateToken(token!);

      setIsValidating(false);

      if (error || !data?.valid) {
        setIsValid(false);
        return;
      }

      setIsValid(true);
      setEmail(data.email);
    }

    validateToken();
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    const { error: apiError } = await passwordResetApi.resetPassword(
      token,
      data.password
    );

    setIsLoading(false);

    if (apiError) {
      setError(apiError.message);
      return;
    }

    // 성공 시 로그인 페이지로 이동
    router.push('/login');
  };

  if (isValidating) {
    return <FullPageSpinner />;
  }

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            유효하지 않은 링크
          </h1>
          <p className="text-soft-brown">
            이 비밀번호 재설정 링크는 만료되었거나 이미 사용되었습니다.
          </p>
          <Button onClick={() => router.push('/forgot-password')}>
            다시 요청하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            새 비밀번호 설정
          </h1>
          {email && (
            <p className="mt-2 text-soft-brown">
              {email} 계정의 새 비밀번호를 입력해주세요
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              label="새 비밀번호"
              type="password"
              placeholder="8자 이상 입력해주세요"
              showPasswordToggle
              {...register('password')}
              error={errors.password?.message}
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            showPasswordToggle
            {...register('passwordConfirm')}
            error={errors.passwordConfirm?.message}
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" isLoading={isLoading}>
            비밀번호 변경
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
