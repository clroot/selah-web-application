"use client";

import { useCallback, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Key, Plus } from "lucide-react";
import { toast } from "sonner";

import { memberApi } from "@/features/member/api/member.api";
import { PasswordChangeForm } from "@/features/member/components/PasswordChangeForm";
import { useCurrentUser } from "@/features/member/hooks/useCurrentUser";

export default function PasswordSettingsPage() {
  const router = useRouter();
  const { data: user, refetch } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setIsLoading(true);
      try {
        const { error } = await memberApi.changePassword({
          currentPassword,
          newPassword,
        });
        if (error) throw error;
        toast.success("비밀번호가 변경되었습니다");
        router.push("/settings/account");
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "비밀번호 변경에 실패했습니다",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const handleSetPassword = useCallback(
    async (newPassword: string) => {
      setIsLoading(true);
      try {
        const { error } = await memberApi.setPassword({ newPassword });
        if (error) throw error;
        toast.success("비밀번호가 설정되었습니다");
        await refetch();
        router.push("/settings/account");
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "비밀번호 설정에 실패했습니다",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, refetch],
  );

  if (!user) return null;

  const hasPassword = user.hasPassword;
  const Icon = hasPassword ? Key : Plus;
  const title = hasPassword ? "비밀번호 변경" : "비밀번호 설정";

  return (
    <div className="min-h-screen bg-cream pb-safe">
      <header className="flex items-center gap-1 px-3 pb-4 pt-14 lg:hidden">
        <Link
          href="/settings/account"
          className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand/50"
        >
          <ArrowLeft className="h-5 w-5 text-deep-brown" strokeWidth={1.5} />
        </Link>
        <h1 className="text-base font-medium text-deep-brown">{title}</h1>
      </header>

      <header className="hidden px-4 pb-6 pt-14 md:px-6 lg:block lg:px-8">
        <h1 className="text-2xl font-bold text-deep-brown">{title}</h1>
      </header>

      <section className="px-4 py-4 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand/50">
            <Icon className="h-6 w-6 text-soft-brown" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium text-deep-brown">{title}</p>
            <p className="text-sm text-soft-brown">
              {hasPassword
                ? "새로운 비밀번호를 입력하세요"
                : "소셜 로그인 외에 비밀번호로도 로그인하세요"}
            </p>
          </div>
        </div>

        <PasswordChangeForm
          hasPassword={hasPassword}
          onSubmitChange={handleChangePassword}
          onSubmitSet={handleSetPassword}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
