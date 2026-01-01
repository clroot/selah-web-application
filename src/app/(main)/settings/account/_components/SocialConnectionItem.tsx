import { Check } from "lucide-react";

import type { OAuthProvider } from "@/features/member/types/member.types";

interface SocialConnectionItemProps {
  provider: OAuthProvider;
  isConnected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isLoading?: boolean;
}

const providerConfig: Record<
  OAuthProvider,
  { name: string; bgColor: string; icon: React.ReactNode }
> = {
  GOOGLE: {
    name: "Google",
    bgColor: "bg-[#F5F5F5]",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  KAKAO: {
    name: "Kakao",
    bgColor: "bg-[#FEE500]",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#3D1D1D">
        <path d="M12 3c-5.52 0-10 3.59-10 8 0 2.73 1.82 5.14 4.56 6.51-.2.75-.73 2.72-.83 3.14-.13.54.2.53.42.39.17-.12 2.71-1.84 3.8-2.59.66.09 1.35.14 2.05.14 5.52 0 10-3.59 10-8s-4.48-8-10-8z" />
      </svg>
    ),
  },
  NAVER: {
    name: "Naver",
    bgColor: "bg-[#03C75A]",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
        <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
      </svg>
    ),
  },
};

/**
 * 소셜 계정 연결 아이템 컴포넌트
 */
export function SocialConnectionItem({
  provider,
  isConnected,
  onConnect,
  onDisconnect,
  isLoading = false,
}: SocialConnectionItemProps) {
  const config = providerConfig[provider];

  return (
    <div className="flex items-center justify-between border-b border-sand py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${config.bgColor}`}
        >
          {config.icon}
        </div>
        <span className="text-[15px] text-deep-brown">{config.name}</span>
      </div>

      {isConnected ? (
        <button
          type="button"
          onClick={onDisconnect}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-[13px] text-green-600 disabled:opacity-50"
        >
          <Check className="h-4 w-4" strokeWidth={2} />
          연결됨
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          disabled={isLoading}
          className="rounded-full border border-sand px-4 py-2 text-[13px] text-soft-brown transition-colors hover:border-warm-beige hover:bg-sand/30 disabled:opacity-50"
        >
          연결
        </button>
      )}
    </div>
  );
}
