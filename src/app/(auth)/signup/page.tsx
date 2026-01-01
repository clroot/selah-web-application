"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { SignupForm } from "@/features/member/components";

export default function SignupPage() {
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
              함께 기도해요
            </h1>
            <p className="mt-2 text-soft-brown">
              새로운 기도의 여정을 시작하세요
            </p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-soft-brown">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium text-gold hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
