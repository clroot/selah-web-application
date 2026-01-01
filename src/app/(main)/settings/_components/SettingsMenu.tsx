import { BarChart2, Lock, LogOut, UserCog } from "lucide-react";

import { SettingsMenuItem } from "./SettingsMenuItem";

interface SettingsMenuProps {
  onLogoutClick: () => void;
}

/**
 * 설정 메뉴 목록 컴포넌트
 */
export function SettingsMenu({ onLogoutClick }: SettingsMenuProps) {
  return (
    <div className="py-2">
      <SettingsMenuItem
        icon={BarChart2}
        label="나의 기도 통계"
        href="/settings/statistics"
      />
      <SettingsMenuItem
        icon={Lock}
        label="암호화 설정"
        href="/settings/encryption"
      />
      <SettingsMenuItem
        icon={UserCog}
        label="계정 관리"
        href="/settings/account"
      />

      <div className="my-4 h-px bg-sand" />

      <SettingsMenuItem
        icon={LogOut}
        label="로그아웃"
        onClick={onLogoutClick}
      />
    </div>
  );
}
