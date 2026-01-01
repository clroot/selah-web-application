import { z } from "zod";

// 공통 필드 스키마
export const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일 형식이 아닙니다");

export const passwordSchema = z
  .string()
  .min(1, "비밀번호를 입력해주세요")
  .min(8, "비밀번호는 8자 이상이어야 합니다")
  .regex(
    /^(?=.*[a-zA-Z])(?=.*[0-9])/,
    "비밀번호는 영문과 숫자를 포함해야 합니다",
  );

export const nicknameSchema = z
  .string()
  .min(1, "닉네임을 입력해주세요")
  .min(2, "닉네임은 2자 이상이어야 합니다")
  .max(20, "닉네임은 20자 이하여야 합니다");

// 로그인 폼 스키마
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// 회원가입 폼 스키마
export const signupFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    nickname: nicknameSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type SignupFormData = z.infer<typeof signupFormSchema>;

// 비밀번호 찾기 폼 스키마
export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

// 비밀번호 재설정 폼 스키마
export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

// 비밀번호 강도 계산
export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels = ["", "약함", "보통", "강함", "매우 강함"];
  return {
    score,
    label: labels[score] ?? "",
  };
}
