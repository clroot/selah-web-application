'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from '@/features/auth/utils/schemas';
import { Button, Input } from '@/shared/components';

interface PasswordSetupFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}

export function PasswordSetupForm({
  onSubmit,
  isLoading,
}: PasswordSetupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    onSubmit(data.password);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sand to-warm-beige">
          <ShieldCheck className="h-8 w-8 text-deep-brown" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-deep-brown">
          비밀번호 설정
        </h1>
        <p className="mt-2 text-soft-brown">
          기도 내용을 안전하게 암호화하기 위해
          <br />
          비밀번호를 설정해주세요
        </p>
      </div>

      {/* 안내 박스 */}
      <div className="rounded-lg bg-sand/30 p-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-soft-brown" />
          <div className="space-y-1 text-sm text-soft-brown">
            <p>
              설정한 비밀번호로 기도 내용이 암호화됩니다.
            </p>
            <p>
              이 비밀번호는 소셜 로그인과 별도로 사용되며, 기도 데이터 보호에
              사용됩니다.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* 비밀번호 */}
        <div className="space-y-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 (영문, 숫자 포함 8자 이상)"
            {...register('password')}
            error={errors.password?.message}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-soft-brown hover:text-deep-brown"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
          />
          <PasswordStrengthMeter password={password} />
        </div>

        {/* 비밀번호 확인 */}
        <Input
          type={showPasswordConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          {...register('passwordConfirm')}
          error={errors.passwordConfirm?.message}
          suffix={
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="text-soft-brown hover:text-deep-brown"
            >
              {showPasswordConfirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />

        <Button type="submit" isLoading={isLoading}>
          다음
        </Button>
      </form>
    </div>
  );
}
