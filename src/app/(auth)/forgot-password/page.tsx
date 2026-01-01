'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { ForgotPasswordForm } from '@/features/member/components';

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex h-11 w-11 items-center justify-center rounded-full text-soft-brown hover:bg-sand/50"
        aria-label="뒤로 가기"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-deep-brown">
              비밀번호 재설정
            </h1>
            <p className="mt-2 text-soft-brown">
              가입하신 이메일로 재설정 링크를 보내드릴게요
            </p>
          </div>

          <ForgotPasswordForm />

          <Link
            href="/login"
            className="block text-center text-sm text-soft-brown hover:text-deep-brown"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
