"use client";

import { useState } from "react";

import { useCurrentUser } from "@/features/member/hooks/useCurrentUser";
import { useLogout } from "@/features/member/hooks/useLogout";

import {
  AppVersion,
  LogoutConfirmModal,
  ProfileCard,
  SettingsMenu,
} from "./_components";

/**
 * 설정 메인 페이지
 */
export default function SettingsPage() {
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
      },
    });
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream pb-safe">
      <ProfileCard
        nickname={user.nickname}
        email={user.email}
        profileImageUrl={user.profileImageUrl}
      />

      <div className="mx-6 h-px bg-sand" />

      <SettingsMenu onLogoutClick={handleLogoutClick} />

      <AppVersion />

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isPending}
      />
    </div>
  );
}
