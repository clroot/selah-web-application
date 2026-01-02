import Image from "next/image";
import Link from "next/link";

import { User } from "lucide-react";

interface ProfileCardProps {
  nickname: string;
  email: string;
  profileImageUrl?: string | null;
}

/**
 * 프로필 카드 컴포넌트
 */
export function ProfileCard({
  nickname,
  email,
  profileImageUrl,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center pb-10 pt-16">
      <div className="mb-4 flex h-[88px] w-[88px] items-center justify-center rounded-full border border-sand bg-sand/50">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={nickname}
            width={88}
            height={88}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="h-9 w-9 text-soft-brown/70" strokeWidth={1.5} />
        )}
      </div>

      <h2 className="mb-1 text-xl font-medium text-deep-brown">{nickname}</h2>

      <p className="mb-5 text-sm text-soft-brown/70">{email}</p>

      <Link
        href="/settings/profile/edit"
        className="rounded-full border border-sand px-7 py-3 text-sm font-medium text-soft-brown transition-colors hover:border-warm-beige hover:bg-sand/30"
      >
        프로필 수정
      </Link>
    </div>
  );
}
