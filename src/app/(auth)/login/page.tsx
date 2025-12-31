import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-deep-brown">Selah</h1>
          <p className="mt-2 text-soft-brown">멈추고, 묵상하고, 기록하다</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-sand bg-white p-6">
            <p className="text-center text-soft-brown">로그인 폼이 여기에 구현됩니다</p>
          </div>

          <p className="text-center text-sm text-soft-brown">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-medium text-gold hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
