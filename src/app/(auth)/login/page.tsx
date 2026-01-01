import Link from "next/link";

import { LoginForm, SocialLoginButtons } from "@/features/member/components";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            다시 만나서 반가워요
          </h1>
          <p className="mt-2 text-soft-brown">기도의 여정을 이어가세요</p>
        </div>

        <LoginForm />

        <Link
          href="/forgot-password"
          className="block text-center text-sm text-soft-brown hover:text-deep-brown"
        >
          비밀번호를 잊으셨나요?
        </Link>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-sand" />
          <span className="text-sm text-soft-brown">또는</span>
          <div className="h-px flex-1 bg-sand" />
        </div>

        <SocialLoginButtons providers={["GOOGLE", "NAVER"]} />

        <p className="text-center text-sm text-soft-brown">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-gold hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
