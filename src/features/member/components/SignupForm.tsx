'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useSignup } from '@/features/member/hooks/useSignup';
import {
  signupFormSchema,
  type SignupFormData,
} from '@/features/member/utils/schemas';
import { Button, Input } from '@/shared/components';

import { PasswordStrengthMeter } from './PasswordStrengthMeter';

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  const { mutate: signup, isPending, error } = useSignup();
  const password = watch('password', '');

  const onSubmit = (data: SignupFormData) => {
    signup(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="이메일"
        type="email"
        placeholder="hello@selah.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="space-y-2">
        <Input
          label="비밀번호"
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

      <Input
        label="닉네임"
        type="text"
        placeholder="기도 노트에서 사용할 이름"
        {...register('nickname')}
        error={errors.nickname?.message}
      />

      {error && (
        <p className="text-center text-sm text-red-500">
          {error.message || '회원가입에 실패했습니다'}
        </p>
      )}

      <Button type="submit" isLoading={isPending}>
        회원가입
      </Button>
    </form>
  );
}
