"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Key, Trash2 } from "lucide-react";

import { SettingsMenuItem } from "@/app/(main)/settings/_components";
import { oauthConnectionApi } from "@/features/member/api/member.api";
import { useCurrentUser } from "@/features/member/hooks/useCurrentUser";
import { getLinkAuthorizationUrl } from "@/features/member/lib/oauth";

import { SocialConnectionItem } from "./_components/SocialConnectionItem";

import type { OAuthProvider } from "@/features/member/types/member.types";

// TODO: KAKAO 추가 예정 (OAuth 설정 완료 후)
const ALL_PROVIDERS: OAuthProvider[] = ["GOOGLE", "NAVER"];

/**
 * 계정 관리 페이지
 */
export default function AccountPage() {
  const { data: user, refetch } = useCurrentUser();
  const [disconnectingProvider, setDisconnectingProvider] =
    useState<OAuthProvider | null>(null);

  if (!user) {
    return null;
  }

  const connectedProviders = user.connectedProviders ?? [];

  const handleConnect = (provider: OAuthProvider) => {
    window.location.href = getLinkAuthorizationUrl(provider);
  };

  const handleDisconnect = async (provider: OAuthProvider) => {
    if (disconnectingProvider) return;

    setDisconnectingProvider(provider);
    try {
      const { error } = await oauthConnectionApi.disconnect(provider);
      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error("OAuth 연결 해제 실패:", err);
    } finally {
      setDisconnectingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-safe">
      <header className="px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-1 pb-4 pt-14 lg:hidden">
          <Link
            href="/settings"
            className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-sand/50"
          >
            <ArrowLeft className="h-5 w-5 text-deep-brown" strokeWidth={1.5} />
          </Link>
          <h1 className="text-base font-medium text-deep-brown">계정 관리</h1>
        </div>
        <div className="hidden lg:block lg:py-8">
          <h1 className="font-serif text-2xl font-bold text-deep-brown">
            계정 관리
          </h1>
        </div>
      </header>

      {/* 연결된 소셜 계정 */}
      <section>
        <h2 className="px-6 pb-3 pt-6 text-xs font-medium uppercase tracking-wide text-soft-brown/70">
          연결된 소셜 계정
        </h2>
        <div className="px-6">
          {ALL_PROVIDERS.map((provider) => (
            <SocialConnectionItem
              key={provider}
              provider={provider}
              isConnected={connectedProviders.includes(provider)}
              isLoading={disconnectingProvider === provider}
              onConnect={() => handleConnect(provider)}
              onDisconnect={() => handleDisconnect(provider)}
            />
          ))}
        </div>
      </section>

      <div className="mx-6 my-6 h-px bg-sand" />

      {/* 계정 보안 */}
      <section>
        <h2 className="px-6 pb-1 text-xs font-medium uppercase tracking-wide text-soft-brown/70">
          계정 보안
        </h2>
        <SettingsMenuItem
          icon={Key}
          label="비밀번호 변경"
          href="/settings/account/password"
        />
      </section>

      <div className="mx-6 h-px bg-sand" />

      {/* 위험 구역 */}
      <section className="mt-2">
        <SettingsMenuItem
          icon={Trash2}
          label="회원 탈퇴"
          href="/settings/account/delete"
          danger
        />
      </section>
    </div>
  );
}
