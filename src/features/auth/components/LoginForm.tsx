'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginFormSchema, type LoginFormData } from '@/features/auth/utils/schemas';
import { Button, Input } from '@/shared/components';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
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

      <Input
        label="비밀번호"
        type="password"
        placeholder="••••••••"
        showPasswordToggle
        {...register('password')}
        error={errors.password?.message}
      />

      {error && (
        <p className="text-center text-sm text-red-500">
          {error.message || '로그인에 실패했습니다'}
        </p>
      )}

      <Button type="submit" isLoading={isPending}>
        로그인
      </Button>
    </form>
  );
}
