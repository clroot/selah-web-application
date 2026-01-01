"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

import { PasswordStrengthMeter } from "@/features/member/components/PasswordStrengthMeter";
import {
  type ChangePasswordFormData,
  changePasswordFormSchema,
  type SetPasswordFormData,
  setPasswordFormSchema,
} from "@/features/member/utils/schemas";
import { Button, Input } from "@/shared/components";

interface PasswordChangeFormProps {
  hasPassword: boolean;
  onSubmitChange: (currentPassword: string, newPassword: string) => void;
  onSubmitSet: (newPassword: string) => void;
  isLoading?: boolean;
}

export function PasswordChangeForm({
  hasPassword,
  onSubmitChange,
  onSubmitSet,
  isLoading,
}: PasswordChangeFormProps) {
  if (hasPassword) {
    return (
      <ChangePasswordFormContent
        onSubmit={onSubmitChange}
        isLoading={isLoading}
      />
    );
  }
  return (
    <SetPasswordFormContent onSubmit={onSubmitSet} isLoading={isLoading} />
  );
}

interface ChangePasswordFormContentProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  isLoading?: boolean;
}

function ChangePasswordFormContent({
  onSubmit,
  isLoading,
}: ChangePasswordFormContentProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword", "");

  const handleFormSubmit = (data: ChangePasswordFormData) => {
    onSubmit(data.currentPassword, data.newPassword);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        type="password"
        placeholder="현재 비밀번호"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
        showPasswordToggle
      />
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="새 비밀번호 (영문, 숫자 포함 8자 이상)"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          showPasswordToggle
        />
        <PasswordStrengthMeter password={newPassword} />
      </div>
      <Input
        type="password"
        placeholder="새 비밀번호 확인"
        {...register("newPasswordConfirm")}
        error={errors.newPasswordConfirm?.message}
        showPasswordToggle
      />
      <Button type="submit" isLoading={isLoading}>
        비밀번호 변경
      </Button>
    </form>
  );
}

interface SetPasswordFormContentProps {
  onSubmit: (newPassword: string) => void;
  isLoading?: boolean;
}

function SetPasswordFormContent({
  onSubmit,
  isLoading,
}: SetPasswordFormContentProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordFormSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword", "");

  const handleFormSubmit = (data: SetPasswordFormData) => {
    onSubmit(data.newPassword);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-sand/30 p-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-soft-brown" />
          <p className="text-sm text-soft-brown">
            소셜 로그인 외에 이메일/비밀번호로도 로그인할 수 있도록 비밀번호를
            설정합니다.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="비밀번호 (영문, 숫자 포함 8자 이상)"
            {...register("newPassword")}
            error={errors.newPassword?.message}
            showPasswordToggle
          />
          <PasswordStrengthMeter password={newPassword} />
        </div>
        <Input
          type="password"
          placeholder="비밀번호 확인"
          {...register("newPasswordConfirm")}
          error={errors.newPasswordConfirm?.message}
          showPasswordToggle
        />
        <Button type="submit" isLoading={isLoading}>
          비밀번호 설정
        </Button>
      </form>
    </div>
  );
}
