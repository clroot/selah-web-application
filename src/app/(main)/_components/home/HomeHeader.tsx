'use client';

import Image from 'next/image';
import Link from 'next/link';

import { User } from 'lucide-react';

import { useAuthStore } from '@/features/member/stores/authStore';

import { useGreeting } from './useGreeting';

/**
 * 홈 화면 헤더 (인사말 + 아바타)
 */
export function HomeHeader() {
  const user = useAuthStore((state) => state.user);
  const greeting = useGreeting();

  const nickname = user?.nickname ?? '방문자';
  const profileImageUrl = user?.profileImageUrl;

  return (
    <header className="px-6 pt-14 pb-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-soft-brown">{greeting}</p>
          <h1 className="font-sans text-lg font-medium text-deep-brown">
            {nickname}님
          </h1>
        </div>
        <Link
          href="/settings"
          className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-sand bg-sand/50 transition-colors hover:border-soft-brown"
        >
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={nickname}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-soft-brown" strokeWidth={1.5} />
          )}
        </Link>
      </div>
    </header>
  );
}
